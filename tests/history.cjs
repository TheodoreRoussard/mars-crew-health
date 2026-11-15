const fs = require('fs'), path = require('path'), vm = require('vm'), assert = require('assert/strict');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const code = html.split('<script>')[1].split('</script>')[0];
let count = 0;
function make(memory = {}) {
  const listeners = {}, el = {innerHTML:'', addEventListener(){}, querySelector(){return null;}};
  const c = {console, Date, Math, JSON, setTimeout(){},setInterval(){return 1;},clearInterval(){},
    document:{getElementById(){return el;},addEventListener(k,f){listeners[k]=f;},activeElement:null},
    localStorage:{getItem:k=>memory[k]||null,setItem:(k,v)=>memory[k]=v},window:{addEventListener(){}}};
  vm.createContext(c);vm.runInContext(code,c);
  return {c,memory,el};
}
function check(name,fn){fn();count++;console.log('ok  ',name);}
const {c,memory,el} = make();
const day = c.isoOf(c.todayNum()), yesterday = c.isoOf(c.todayNum()-1);
let p = c.sanitizeProfile({id:'test',name:'Test astronaut',baselines:{hr:60},entries:[{date:day,values:{temp:36.6,hr:60}}]});
c.store.profiles[p.id]=p;c.openProfile(p.id);
const temp=c.indById('temp');
check('same-day remeasurement preserves legacy value and creates timestamped readings',()=>{
 c.setValue(p,temp,38.7);c.setValue(p,temp,37.9);
 const rs=p.entries[0].readings.filter(r=>r.indicator==='temp');
 assert.deepEqual(Array.from(rs,r=>r.value),[36.6,38.7,37.9]);assert.equal(rs[0].recordedAt,null);
 assert.ok(rs.slice(1).every(r=>c.validTimestamp(r.recordedAt)));
 assert.equal(c.assess(p,temp).value,37.9);assert.equal(c.series(p,temp,c.todayNum(),30).length,1);
});
check('history exposes per-reading remove buttons and unknown legacy times',()=>{
 c.openHistory('temp');c.render();
 assert.ok(el.innerHTML.includes('History · Body temperature'));
 assert.ok(el.innerHTML.includes('Time not recorded'));assert.ok(el.innerHTML.includes('>Remove</button>'));
 assert.equal(c.ui.items.length,3);
});
check('remove confirmation defaults to Cancel and Escape changes nothing',()=>{
 c.askRemoveReading(c.ui.items[0]);assert.equal(c.ui.modal.sel,0);
 c.handleKey('Escape',false);assert.equal(c.assess(p,temp).value,37.9);
});
check('removing latest reading uses the previous value and recalculates alert',()=>{
 c.askRemoveReading(c.ui.items[0]);c.handleKey('ArrowDown',false);c.handleKey('Enter',false);
 assert.equal(c.assess(p,temp).value,38.7);assert.equal(c.assess(p,temp).status,'act');
 assert.equal(p.entries[0].readings.filter(r=>r.indicator==='temp').length,3);
 assert.ok(c.historyItems(p,'temp')[0].reading.removedAt);
});
check('removal and restore reannounce effective alerts even if previously acknowledged',()=>{
 c.acknowledge();assert.equal(c.ui.pending.length,0);
 const old=c.historyItems(p,'temp')[1];c.changeReading(p,old.date,old.id,true);
 assert.equal(c.assess(p,temp).value,36.6);
 c.changeReading(p,old.date,old.id,false);assert.equal(c.assess(p,temp).value,38.7);
 assert.ok(c.ui.pending.some(x=>x.a.ind.id==='temp'));
});
check('restoring an earlier reading preserves capture order; newest active remains authoritative',()=>{
 let newest=c.historyItems(p,'temp')[0];c.changeReading(p,newest.date,newest.id,false);
 const older=c.historyItems(p,'temp')[1];c.changeReading(p,older.date,older.id,true);c.changeReading(p,older.date,older.id,false);
 assert.equal(c.assess(p,temp).value,37.9);
});
check('all removed means No data, other indicators are untouched, check becomes due',()=>{
 c.historyItems(p,'temp').forEach(x=>c.changeReading(p,x.date,x.id,true));
 assert.equal(c.assess(p,temp).status,'nodata');assert.equal(p.entries[0].values.hr,60);
 assert.ok(c.dueSteps(p).includes('temp'));
});
check('JSON backup round trip preserves timestamps and removal markers',()=>{
 const copy=c.sanitizeProfile(JSON.parse(JSON.stringify(p)));
 assert.equal(JSON.stringify(copy),JSON.stringify(p));
 assert.equal(c.assess(copy,temp).status,'nodata');
});
check('browser reload restores complete journal from storage',()=>{
 const reloaded=make(memory).c;
 assert.equal(JSON.stringify(reloaded.store.profiles.test),JSON.stringify(p));
});
check('legacy version 1 backups are accepted without inventing a measurement time',()=>{
 c.importText(JSON.stringify({app:c.APP,version:1,profile:{id:'legacy',name:'Legacy',entries:[{date:day,values:{temp:36.5}}]}}));
 const legacy=c.store.profiles.legacy;assert.ok(legacy);
 assert.equal(c.historyItems(legacy,'temp')[0].reading.recordedAt,null);
 assert.equal(c.VERSION,2);
});
check('version 1 browser storage migrates without overwriting the old copy',()=>{
 const old=JSON.stringify({app:c.APP,version:1,profiles:{legacy:{id:'legacy',name:'Old profile',baselines:{},entries:[{date:day,values:{temp:36.5}}]}},lastExport:{},dateOffset:0});
 const storage={'crewHealth.v1':old}, migrated=make(storage).c;
 assert.ok(migrated.store.profiles.legacy);
 migrated.setValue(migrated.store.profiles.legacy,migrated.indById('temp'),37);
 assert.equal(storage['crewHealth.v1'],old);assert.ok(storage['crewHealth.v2']);
 assert.equal(migrated.historyItems(migrated.store.profiles.legacy,'temp').length,2);
});
check('daily radiation total uses latest daily dose, not the sum of remeasurements',()=>{
 const rad=c.indById('rad');c.setValue(p,rad,1.8);c.setValue(p,rad,2.1);
 assert.equal(c.cumulative(p,rad).sum,2.1);
});
check('multiple checks in a day do not count as multiple baseline days',()=>{
 const q={id:'base',name:'Baseline',baselines:{},entries:[]};
 for(let i=0;i<5;i++)c.setValue(q,c.indById('hr'),60+i);
 assert.equal(c.baselineOf(q,c.indById('hr')),null);
});
check('capture order survives matching timestamps and untrusted cached daily values',()=>{
 const stamp=new Date().toISOString();
 const q=c.sanitizeProfile({id:'tie',name:'Tie',entries:[{date:day,values:{temp:99},readings:[
 {id:'one',indicator:'temp',value:37,recordedAt:stamp},{id:'two',indicator:'temp',value:38,recordedAt:stamp}]}]});
 assert.equal(q.entries[0].values.temp,38);assert.equal(c.lastReading(q,temp,c.todayNum()).id,'two');
});
check('invalid journal values and times do not become trusted readings',()=>{
 const q=c.sanitizeProfile({name:'Bad input',entries:[{date:day,values:{temp:38},readings:[
 {id:'bad',indicator:'temp',value:100},{id:'valid',indicator:'temp',value:36.6,recordedAt:'not a time'}]}]});
 assert.equal(q.entries[0].readings.length,1);assert.equal(q.entries[0].readings[0].recordedAt,null);
 assert.equal(q.entries[0].values.temp,36.6);
});
check('earlier day can become current after deleting today; no freshness is invented',()=>{
 const q=c.sanitizeProfile({id:'past',name:'Past',entries:[{date:yesterday,values:{temp:37}},{date:day,values:{temp:38}}]});
 const latest=c.historyItems(q,'temp')[0];c.changeReading(q,latest.date,latest.id,true);
 assert.equal(c.assess(q,temp).age,1);
});
check('demo journal changes never modify saved crew data',()=>{
 const saved=memory[c.KEY];c.startDemo(0);const d=c.active();c.setValue(d,temp,39);
 const r=c.historyItems(d,'temp')[0];c.changeReading(d,r.date,r.id,true);
 assert.equal(memory[c.KEY],saved);c.exitDemo();assert.equal(c.store.profiles.test,p);
});
assert.equal(c.crashed,false);
console.log(`All ${count} history checks passed`);
