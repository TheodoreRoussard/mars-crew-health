const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8');
const el={innerHTML:'',addEventListener(){},querySelector(){return null;}};
let timer=null, now=100000;
class Clock extends Date { static now(){return now;} }
const c={console,Date:Clock,Math,JSON,setTimeout(){},setInterval(f){timer=f;return 1;},clearInterval(){timer=null;},
 document:{getElementById(){return el;},addEventListener(){},activeElement:null},window:{addEventListener(){}},
 localStorage:{getItem(){return null;},setItem(){}}};
vm.createContext(c);vm.runInContext(html.split('<script>')[1].split('</script>')[0],c);
const day=c.isoOf(c.todayNum());
function profile(id,values){const p=c.sanitizeProfile({id,name:id,baselines:{hr:60,mass:70},entries:[{date:day,values}]});c.store.profiles[id]=p;return p;}
const red=profile('Red',{temp:39,bp:180,hr:60}),yellow=profile('Yellow',{temp:38}),green=profile('Green',{temp:37}),empty=profile('Empty',{});
c.refreshAlarms();c.render();
assert.equal(c.pendingLevel('Red'),'act');assert.equal(c.pendingLevel('Yellow'),'watch');assert.equal(c.pendingLevel('Green'),'');assert.equal(c.pendingLevel('Empty'),'');
assert.ok(el.innerHTML.includes('alert-live alert-act'));assert.ok(el.innerHTML.includes('alert-live alert-watch'));assert.ok(!el.innerHTML.includes('class="alarm'));
const redPending=c.ui.pending.filter(x=>x.p.id==='Red');assert.equal(redPending.filter(x=>x.a.status==='act').length,2);
// Pulses and sound start at the same instant and repeat without requiring a render.
const notes=[];c.audio.ok=true;c.audio.ctx={currentTime:12};c.beep=(...args)=>notes.push(args);c.refreshAlarms();c.render();
assert.equal(notes.length,6);assert.equal(c.crewPulse.act,now+50);assert.equal(notes[0][1],12.05);
now+=8000;timer();assert.equal(notes.length,12);assert.equal(c.crewPulse.act,now+50);
c.acknowledge();c.render();assert.equal(timer,null);assert.ok(!el.innerHTML.includes('alert-live'));assert.ok(el.innerHTML.includes('ACT NOW'));assert.equal(c.assess(red,c.indById('temp')).status,'act');
c.setValue(red,c.indById('temp'),40);c.refreshAlarms();c.render();assert.equal(c.pendingLevel('Red'),'act');assert.equal(c.pendingLevel('Yellow'),'');
// Sort the displayed list and the selected chart/card with the same mapping.
c.openProfile('Red');c.setView('trends');c.render();
const ordered=c.ui.items.map(item=>c.assess(red,c.indById(item.id))),rank={act:0,watch:1,nominal:2,nodata:3};
for(let i=1;i<ordered.length;i++){const a=ordered[i-1],b=ordered[i];assert.ok(rank[a.status]<rank[b.status]||rank[a.status]===rank[b.status]&&a.ind.label.localeCompare(b.ind.label,'en')<=0);}
assert.equal(c.ui.items[0].id,'bp');c.handleKey('Enter',false);c.render();assert.equal(c.ui.card.ids[c.ui.card.i],'bp');
c.setView('body');c.render();const headings=[...el.innerHTML.matchAll(/<div class="grp[^>]*>(.*?)<\/div>/g)];assert.ok(headings.length);assert.ok(headings.every(x=>!x[1].includes('<svg')));assert.ok(el.innerHTML.includes('class="ico"'));
c.setView('hazards');c.render();assert.match(el.innerHTML,/<div class="grp[^>]*><svg/);
// Advice is directional, with an immediate action before escalation.
function advice(id,value){c.setValue(red,c.indById(id),value);return c.actionFor(c.assess(red,c.indById(id))).t;}
assert.match(advice('temp',34),/warm area/);assert.doesNotMatch(advice('temp',34),/shared food|fever/);
assert.match(advice('temp',39),/Rest, take small drinks/);assert.match(advice('mass',80),/increase/);assert.doesNotMatch(advice('mass',80),/snack/);
assert.match(advice('bp',180),/Stop exertion/);assert.match(advice('sleep',4),/Hand over safety-critical tasks/);
for(const ind of c.INDICATORS)for(const a of Object.values(ind.actions))assert.ok(!/^(See|Talk to|Tell|Ask|Report|Send|Show)\b/.test(a.t),ind.id+': '+a.t);
assert.equal(c.crashed,false);
console.log('PASS: crew-specific alerts, pulse/audio timing, acknowledgement, re-alerts, trend order/navigation, Body headings and actionable advice.');
