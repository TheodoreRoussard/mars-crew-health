// Behaviour tests: run the real page script from index.html in Node with a minimal fake DOM,
// check what the crew would see and hear, then fuzz the keyboard. No dependencies. Run: node tests/behaviour.js
const fs=require('fs'),vm=require('vm'),path=require('path');
const root=path.join(__dirname,'..');
const code=fs.readFileSync(path.join(root,'index.html'),'utf8').split('<script>')[1].split('</script>')[0];
const sample=fs.readFileSync(path.join(root,'sample-data.json'),'utf8');
let passed=0;
function mk(lsThrows){
  const listeners={}, inputs={}, beeps=[]; let tick=null;
  const el=()=>({innerHTML:'',hidden:true,value:'',files:null,addEventListener(){},click(){},focus(){},blur(){},querySelector(){return null},setSelectionRange(){},appendChild(){},removeChild(){},getAttribute(){return null}});
  const els={app:el(),crash:el(),file:el()}; const mem={};
  const ctx={console,setInterval:(f)=>{tick=f;return 1},clearInterval(){tick=null},setTimeout(){},Date,Math,JSON,isFinite,isNaN,parseFloat,String,Object,Array,Infinity,NaN,Error,RegExp,
    AudioContext:function(){this.currentTime=0;this.state='running';this.destination={};this.createOscillator=()=>{const o={frequency:{},connect(){},start(t){beeps.push({f:o.frequency.value,type:o.type,t})},stop(){}};return o};this.createGain=()=>({gain:{setValueAtTime(){},linearRampToValueAtTime(){}},connect(){}})},
    document:{getElementById:id=>els[id]||inputs[id]||null,addEventListener:(t,f)=>listeners[t]=f,createElement:el,body:el(),activeElement:null},
    localStorage:{getItem:k=>{if(lsThrows)throw new Error('x');return mem[k]||null},setItem:(k,v)=>{if(lsThrows)throw new Error('x');mem[k]=v}},
    location:{reload(){}},URL:{createObjectURL:()=>'blob:x',revokeObjectURL(){}},Blob:function(){},FileReader:function(){}};
  ctx.window=ctx; ctx.window.addEventListener=()=>{};
  vm.createContext(ctx); vm.runInContext(code.replace(/^'use strict';/,''),ctx);
  const key=k=>listeners.keydown(k==='ShiftTab'?{key:'Tab',shiftKey:true,target:{tagName:'BODY'},preventDefault(){}}:{key:k,target:{tagName:'BODY'},preventDefault(){}});
  const o={ctx,els,inputs,key,mem,beeps,tick:()=>tick&&tick(),get:x=>vm.runInContext(x,ctx)};
  o.html=()=>els.app.innerHTML; o.P=id=>o.get('store.profiles["'+id+'"]'); o.I=id=>ctx.indById(id); o.A=(pid,id)=>ctx.assess(o.P(pid),o.I(id));
  return o;
}
const ok=(c,m)=>{if(!c){console.log('FAIL',m);process.exitCode=1}else{passed++;console.log('ok  ',m)}};
const SAM='sample-okafor',ANA='sample-ruiz',KEN='sample-mori',LENA='sample-fischer', APPID='crew-health-monitor';

// 1. empty device, unsafe imports
let a=mk(false);
ok(a.html().includes('No astronaut on this device yet')&&a.html().includes('Sound is off'),'empty crew page, sound-off notice');
for(const bad of ['{oops','null','[]','{"app":"x"}',JSON.stringify({app:APPID,version:2,profile:{}}),JSON.stringify({app:APPID,version:1,profiles:[]}),JSON.stringify({app:APPID,version:1,profile:{name:'',entries:[]}}),JSON.stringify({app:APPID,version:1,profile:{name:'Z',entries:'no'}}),JSON.stringify({app:APPID,version:1,profiles:[{name:'Good',entries:[]},{name:'',entries:[]}]})]) a.ctx.importText(bad);
ok(Object.keys(a.get('store.profiles')).length===0&&!a.get('crashed'),'9 malformed files rejected (one bad astronaut rejects the whole file), nothing stored');
a.ctx.importText(JSON.stringify({app:APPID,version:1,profile:{id:'h1',name:'<img src=x onerror=1>',baselines:{hr:'x',mass:1e9},entries:[{date:'2026-02-31',values:{hr:60}},{date:'2026-11-14',values:{hr:'60',spo2:300,temp:null,mood:7,bp:120}},null,5]}}));
let h=a.P('h1'); ok(h.entries.length===1&&JSON.stringify(h.entries[0].values)==='{"bp":120}'&&Object.keys(h.baselines).length===0,'old single-astronaut file accepted; invalid dates/values/baselines dropped');
a.ctx.render(); ok(!a.html().includes('<img'),'name is HTML-escaped');

// 2. crew page
a=mk(false); a.ctx.importText(sample); a.ctx.render();
ok(Object.keys(a.get('store.profiles')).length===4,'crew file loads 4 astronauts');
ok(['Sam Okafor','Ana Ruiz','Kenji Mori','Lena Fischer'].every(n=>a.html().includes(n))&&a.html().includes('ACT NOW')&&a.html().includes('KEEP WATCH')&&a.html().includes('Check-in: ')&&a.html().includes('Check-in done'),'crew page shows every astronaut with status, action and check-in state');
ok(a.html().includes('grid-template-columns:repeat(2,1fr);grid-template-rows:repeat(2,1fr)'),'4 astronauts -> 2 x 2 grid');
ok(a.get('ui.pending.length')>0&&a.beeps.length===0&&a.html().includes('ALARM – ACT: Sam Okafor'),'before any key: alarm banner visible, no sound yet');
a.key('ArrowRight'); ok(a.beeps.length===6&&a.beeps.every(b=>b.type==='square')&&a.html().includes('Sound on'),'first key press turns sound on: Act = 6 square pulses');
a.tick(); ok(a.beeps.length===12,'Act repeats on the 8 s timer');
a.key('Enter'); ok(a.get('ui.screen')==='main'&&a.get('ui.activeId')===ANA&&a.html().includes('ALARM – ACT: Sam Okafor'),'inside Ana\'s profile the banner still shows Sam\'s alarm');
const np=a.get('ui.pending.length'); a.key('a'); a.tick(); ok(a.get('ui.pending.length')===0&&a.beeps.length===12&&!a.html().includes('ALARM'),'A acknowledges all '+np+' crew alerts and silences the sound');
a.beeps.length=0; a.ctx.playWatch(); ok(a.beeps.length===2&&a.beeps.every(b=>b.type==='sine')&&a.beeps[1].t-a.beeps[0].t>0.4,'Watch sound = 2 slow sine notes');
a.get('ui.prompt=null'); a.ctx.askNewAstronaut(); a.inputs['prompt-inp']={value:'Zoé Martin'}; a.key('Enter');
ok(a.html().includes('Personal baselines') && a.get('ui.baseline') !== null, 'new astronaut opens optional baseline form');
a.key('Escape'); a.key('0');
ok(a.html().includes('Zoé Martin')&&a.html().includes('grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,1fr)'),'adding a 5th astronaut re-arranges the grid to 3 x 2');

// 3. tabs and navigation
a.get('ui.sel=0'); a.key('Enter'); ok(a.get('ui.activeId')===SAM&&a.get('ui.view')==='overview','Enter opens the selected astronaut');
ok(a.html().includes('<kbd>0</kbd>Crew')&&!a.html().includes('CREW HEALTH<')&&a.html().includes('tab-w'),'top bar: Crew tab + one tab per astronaut, no app title');
a.key('3'); a.key('Tab'); ok(a.get('ui.activeId')===ANA&&a.get('ui.view')==='body','Tab switches astronaut and keeps the same view');
a.key('ShiftTab'); a.key('ShiftTab'); ok(a.get('ui.screen')==='home','Shift+Tab goes back through the tabs to the crew page');
a.key('Tab'); a.key('Tab'); a.key('Tab'); a.key('0'); ok(a.get('ui.screen')==='home'&&a.get('ui.sel')===2,'key 0 leaves the profile and selects that astronaut on the crew page');
a.key('Enter'); a.key('Escape'); ok(a.get('ui.screen')==='home','Esc at the top of a profile returns to the crew page');
a.key('Enter'); a.key('5'); a.key('6'); ok(a.get('ui.view')==='trends','key 6 no longer opens a view inside a profile');
a.key('0'); ok(a.html().includes('<kbd>B</kbd>Backup')&&a.html().includes('<kbd>S</kbd>Settings')&&a.html().includes('<kbd>D</kbd>Start demo'),'crew page footer keeps Backup, Settings and Start demo together');
a.key('s'); ok(a.get('ui.screen')==='settings'&&a.html().includes('<h1>Settings</h1>')&&a.html().includes('Set today’s date')&&a.html().includes('Remove an astronaut')&&!a.html().includes('backup file'),'S on the crew page opens Settings, with no backup items');
a.key('Escape'); ok(a.get('ui.screen')==='home','Esc leaves Settings');
a.key('b'); ok(a.get('ui.screen')==='backup'&&a.html().includes('<h1>Backup</h1>')&&a.html().includes('Make a backup file: whole crew (5)')&&a.html().includes('Load a backup file')&&a.html().includes('last backup')&&!a.html().includes('Set today’s date'),'B on the crew page opens Backup, with only backup items');
a.key('Escape'); ok(a.get('ui.screen')==='home','Esc leaves Backup');

// 3b. remove an astronaut: two confirmations, both default to Cancel
{ const d=mk(false); d.ctx.importText(sample); d.ctx.render(); d.key('s');
  const openRemove=()=>{ d.get('ui.sel='+d.get('ui.items.findIndex(function(x){return x.cmd==="remove"})')); d.key('Enter'); };
  openRemove(); ok(d.get('ui.modal.title')==='Remove an astronaut'&&d.get('ui.modal.sel')===0&&d.get('ui.modal.options.length')===5,'Remove opens a picker with Cancel first and one line per astronaut');
  d.key('ArrowUp'); ok(d.get('ui.modal.sel')===4,'ArrowUp in a dialog moves up (wraps to the last option)');
  d.key('Escape'); openRemove(); d.key('Enter'); ok(d.ctx.crew().length===4&&d.get('ui.modal')===null,'Cancel in the picker removes nobody');
  openRemove(); d.key('ArrowDown'); d.key('Enter'); ok(d.get('ui.modal.title')==='Remove Sam Okafor?'&&d.get('ui.modal.sel')===0&&d.get('ui.modal.text').includes('30 days'),'picking Sam asks again, says how many days are lost, default is Cancel');
  d.key('Enter'); ok(!!d.P(SAM),'Cancel on the second question keeps Sam');
  d.get('store.lastExport["'+SAM+'"]="2026-11-01"');
  openRemove(); d.key('ArrowDown'); d.key('Enter'); d.key('ArrowDown'); d.key('Enter');
  ok(!d.P(SAM)&&d.ctx.crew().length===3&&!d.get('store.lastExport["'+SAM+'"]')&&JSON.parse(d.mem['crewHealth.v1']).profiles[SAM]===undefined,'confirming removes Sam, his backup date, and saves');
  ok(!d.get('ui.pending').some(x=>x.p.id===SAM)&&!d.html().includes('tab-n">Sam Okafor')&&d.html().includes('Removed Sam Okafor'),'Sam’s alarms and tab are gone, message confirms');
  d.key('Escape'); ok(!d.html().includes('ACT NOW'),'crew page no longer shows Sam’s Act alarm'); }

// 4. check-in: choose any question
a.get('ui.sel=3'); a.key('Enter'); ok(a.get('ui.activeId')===LENA,'open Lena (check-in not done today)');
a.key('2'); const dueN=a.ctx.dueSteps(a.P(LENA)).length; ok(a.html().includes('Answer all '+dueN+' questions that are due')&&a.html().includes('To do')&&a.get('ui.items[0].kind')==='all','check-in opens on the question list');
const iTemp=a.get('ui.items.map(function(x){return x.id}).indexOf("temp")'); a.get('ui.sel='+iTemp); a.key('Enter');
ok(a.get('ui.ci.steps.join()')==='temp'&&a.html().includes('Question 1 of 1'),'choosing one question asks only that one');
a.inputs['ci-inp']={value:'abc'}; a.key('Enter'); ok(a.get('ui.ci.err').includes('does not look right'),'letters rejected with a message');
a.inputs['ci-inp']={value:'99'}; a.key('Enter'); ok(a.get('ui.ci.phase')==='ask','out-of-range rejected');
a.inputs['ci-inp']={value:''}; a.key('Enter'); ok(a.get('ui.ci.skipArmed'),'empty needs a second Enter');
a.inputs['ci-inp']={value:'38,0'}; a.key('Enter'); ok(a.get('ui.ci.phase')==='result'&&a.html().includes('Slight fever'),'38,0 accepted -> Watch result');
ok(JSON.parse(a.mem['crewHealth.v1']).profiles[LENA].entries.slice(-1)[0].values.temp===38,'value saved immediately');
a.key('Enter'); ok(a.get('ui.ci')===null&&a.get('ui.view')==='checkin'&&a.html().includes('Done today')&&a.ctx.dueSteps(a.P(LENA)).length===dueN-1,'after one question: back to the list, that question is Done today');
a.get('ui.sel='+iTemp); a.key('Enter'); a.key('Escape'); ok(a.get('ui.ci')===null&&a.get('ui.view')==='checkin','Esc during a question returns to the list');
a.get('ui.sel=0'); a.key('Enter'); ok(a.get('ui.ci.all')===true&&a.get('ui.ci.steps.length')===dueN-1,'"Answer all" asks every due question');
a.key('Escape');

// 5. cards, staleness, clock
a=mk(false); a.ctx.importText(sample); a.ctx.startSession(SAM);
a.P(SAM).entries[29].values.vision=2; a.key('a'); a.key('3'); a.key('ArrowDown'); a.key('Enter');
ok(a.html().includes('Earth is far away')&&a.html().includes('While you wait')&&a.html().includes('Flight surgeons on Earth'),'Earth card shows delay + while-waiting + owner');
a.key('4'); ok(a.html().includes('Do now:'),'after A: steady banner still says what to do on other views');
a.key('Escape'); a.get('store.dateOffset=3'); let all=a.ctx.assessAll(a.P(SAM)); ok(all.filter(x=>x.ind.every===1).every(x=>x.status==='nodata'),'3-day-old daily readings -> No data');
a.get('store.dateOffset=-5'); a.ctx.render(); ok(a.html().includes('clock looks wrong'),'clock-behind notice on the crew page');
all=a.ctx.assessAll(a.P(SAM)); ok(all.every(x=>x.status==='nodata'&&x.word==='Date is wrong'),'clock behind data -> every check is No data');
const before=JSON.stringify(a.P(SAM)); a.key('Enter'); a.key('2'); a.key('Enter'); ok(a.get('ui.ci')===null&&JSON.stringify(a.P(SAM))===before&&a.html().includes('date on this device is wrong'),'clock behind data -> check-in refused, nothing changed'); a.get('store.dateOffset=0');

// 6. radiation (real NASA values in the sample)
{ const d=mk(false); d.ctx.importText(sample); const P=()=>d.P(SAM), A=id=>d.A(SAM,id), I=d.I;
  let r=A('rad'); ok(r.status==='nominal'&&r.word==='Normal for you'&&Math.abs(r.baseline-0.65)<0.03,'rad: real ISS day judged against usual level ('+r.baseline.toFixed(2)+' mSv)');
  const T=P().entries[29].values, usual=r.baseline;
  T.rad=+(usual*1.21).toFixed(2); ok(A('rad').status==='nominal','rad: +21 % (the real location effect) stays Nominal');
  T.rad=+(usual*1.9).toFixed(2); ok(A('rad').status==='watch'&&A('rad').word==='Above your usual level','rad: 1.9x usual -> Watch');
  T.rad=+(usual*5).toFixed(2); ok(A('rad').status==='act'&&A('rad').word==='Far above your usual level','rad: 5x usual -> Act');
  for(let i=22;i<=29;i++) P().entries[i].values.rad=12; r=A('rad'); ok(r.baseline===12&&r.status==='act'&&r.word==='Solar storm level','rad: week-long storm shifts usual level but absolute backstop still says Act');
  ok(d.ctx.evaluate(I('rad'),3,null).word==='Elevated'&&d.ctx.evaluate(I('rad'),1,null).status==='nominal','rad: no usual level yet -> fixed limits');
  let c=d.ctx.cumulative(P(),I('rad')); const man=P().entries.reduce((x,e)=>x+e.values.rad,0); ok(Math.abs(c.sum-man)<1e-9&&c.days===30&&c.missing===0,'rad: mission total = sum of daily doses');
  delete P().entries[10].values.rad; c=d.ctx.cumulative(P(),I('rad')); ok(c.days===29&&c.missing===1,'rad: unmeasured day is counted as missing, not as zero');
  d.ctx.startSession(SAM); d.key('4'); d.key('Enter'); ok(d.html().includes('Mission total:')&&d.html().includes('1 days not measured')&&d.html().includes('Your usual level')&&d.html().includes('NASA reference, ISS dosimeter 2014'),'rad card shows usual level, mission total and the NASA reference'); }

// 7. spacewalks as events
{ const d=mk(false); d.ctx.importText(sample); const pid=SAM, P=()=>d.P(pid), A=id=>d.A(pid,id), I=d.I;
  ok(A('eva_hands').status==='nominal'&&A('eva_hands').note==='Last spacewalk: 9 days ago'&&A('eva_dur').word==='Usual length','eva: resolved symptom stays Nominal, linked to last sortie');
  ok(d.ctx.dueSteps(P()).length===0,'eva: nothing due when today is done');
  const T=P().entries[29].values; delete T.eva_done; ok(JSON.stringify(d.ctx.dueSteps(P()))==='["eva_done"]','eva: only the gate question is due each day');
  d.ctx.startSession(pid); d.key('2'); d.key('Enter'); d.key('Enter'); ok(d.get('ui.ci.steps.length')===1&&A('eva_air').status==='nominal','eva: answering No asks nothing more');
  delete T.eva_done; d.key('Escape'); d.key('2'); d.key('Enter'); d.key('2'); d.key('Enter'); ok(d.get('ui.ci.steps.join()')==='eva_done,eva_dur,eva_air,eva_eyes,eva_hands','eva: answering Yes inserts duration + 3 symptom questions');
  ok(A('eva_air').status==='nodata'&&A('eva_air').note.includes('Not answered after the spacewalk'),'eva: follow-ups are No data until answered after the new sortie');
  d.key('Enter'); d.inputs['ci-inp']={value:'8'}; d.key('Enter'); ok(A('eva_dur').status==='watch'&&d.html().includes('Very long sortie')&&d.html().includes('NASA reference, 368 timed spacewalks'),'eva: 8 h sortie -> Watch, NASA reference shown');
  d.key('Enter'); d.key('2'); d.key('Enter'); ok(A('eva_air').status==='watch','eva: headache after sortie -> Watch'); d.key('Enter'); d.key('Enter'); d.key('Enter'); d.key('3'); d.key('Enter'); ok(A('eva_hands').status==='act','eva: limiting injury -> Act');
  d.key('Escape'); d.get('store.dateOffset=1'); const du=d.ctx.dueSteps(P()); ok(du.includes('eva_air')&&du.includes('eva_hands')&&!du.includes('eva_dur')&&!du.includes('eva_eyes'),'eva: next day only the unresolved symptoms are asked again');
  d.ctx.setValue(P(),I('eva_done'),0); ok(A('eva_hands').status==='act'&&A('eva_dur').status==='watch','eva: yesterday\'s symptom still shown the day after');
  d.get('store.dateOffset=2'); d.ctx.setValue(P(),I('eva_done'),0); ok(A('eva_hands').status==='nodata'&&A('eva_hands').word==='No recent data'&&A('eva_dur').status==='nominal','eva: unanswered symptom goes to No data (never silently Nominal); duration expires'); d.get('store.dateOffset=0');
  d.ctx.importText(JSON.stringify({app:APPID,version:1,profile:{id:'old1',name:'Old',entries:[{date:'2026-01-01',values:{eva:2}},{date:'2026-01-02',values:{eva:0}}]}}));
  const o=d.get('store.profiles.old1.entries'); ok(o[0].values.eva_done===1&&o[0].values.eva_hands===2&&o[1].values.eva_done===0,'eva: old backup files are migrated');
  d.ctx.importText(JSON.stringify({app:APPID,version:1,profile:{id:'new1',name:'New',entries:[{date:d.ctx.isoOf(d.ctx.todayNum()),values:{eva_done:0}}]}}));
  ok(d.ctx.assess(d.get('store.profiles.new1'),I('eva_air')).word==='No spacewalk yet','eva: crew member with no sortie -> Nominal, "No spacewalk yet"'); }

// 8. backup round trip and replace confirmation
{ const d=mk(false); d.ctx.importText(sample); const snap=JSON.stringify(d.get('store.profiles'));
  const file=JSON.stringify({app:APPID,version:1,exportedAt:'2026-11-15',profiles:d.ctx.crew()});
  d.P(SAM).entries.pop(); const changed=JSON.stringify(d.get('store.profiles'));
  d.ctx.importText(file); ok(d.get('ui.modal')!==null&&d.get('ui.modal.sel')===0&&JSON.stringify(d.get('store.profiles'))===changed,'loading over existing astronauts asks first; default is Cancel');
  d.key('Enter'); ok(JSON.stringify(d.get('store.profiles'))===changed&&d.get('ui.modal')===null,'Cancel keeps the data on the device');
  d.ctx.importText(file); d.key('ArrowDown'); d.key('Enter'); ok(JSON.stringify(d.get('store.profiles'))===snap,'whole-crew backup -> load restores all 4 astronauts exactly'); }

// 9. storage failure
let b=mk(true); b.ctx.importText(sample); b.ctx.startSession(SAM); b.ctx.render(); ok(!b.get('crashed')&&b.html().includes('NOT saving'),'localStorage failure -> warning, no crash');

// 10. keyboard fuzz
let c=mk(false); c.ctx.importText(sample); const keys=['1','2','3','4','5','6','7','0','0','9','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter','Enter','Enter','Escape','a','A','s','S','b','B','Tab','Tab','ShiftTab','x','.',',','-','Backspace',' ','r','F5'];
let seed=7; const rnd=()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296; const vals=['','12','abc','-5','1e9','36.6','97',' 7,5 ','<b>','2031-04-09','Zoé'];
const seen={};
for(let i=0;i<20000;i++){ c.inputs['ci-inp']={value:vals[Math.floor(rnd()*vals.length)]}; c.inputs['prompt-inp']={value:vals[Math.floor(rnd()*vals.length)]}; c.key(keys[Math.floor(rnd()*keys.length)]); seen[c.get('ui.screen+"/"+ui.view+"/"+(ui.ci?ui.ci.phase:"")+(ui.card?"card":"")+(ui.modal?"modal":"")+(ui.prompt?"prompt":"")')]=1; if(i%997===0) c.ctx.importText(sample); if(c.get('crashed')) break; }
ok(!c.get('crashed'),'20000 random keys, '+Object.keys(seen).length+' distinct screen states reached: no crash'); ok(!/undefined|NaN|\[object/.test(c.html()),'no "undefined"/"NaN" leaked into the page');

console.log(process.exitCode?'\nSOME CHECKS FAILED':'\nAll '+passed+' behaviour checks passed');

