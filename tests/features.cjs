const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'),'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const disk = new Map();
const element = {addEventListener(){},querySelector(){return null;},innerHTML:''};
const context = {console, Date, Math, JSON, isFinite, isNaN, setTimeout(){},setInterval(){return 1;},clearInterval(){},
 localStorage:{getItem:k=>disk.get(k)||null,setItem:(k,v)=>disk.set(k,v)},
 document:{getElementById:()=>element,addEventListener(){},activeElement:null},window:{addEventListener(){}}};
vm.createContext(context); vm.runInContext(source,context);
const c=context;
assert.equal(c.crashed,false);
let p={id:'real',name:'Real test profile',baselines:{hr:60,mass:75,grip:45},entries:[]};
c.store.profiles[p.id]=p;c.saveStore();const saved=disk.get(c.KEY);
for(let i=0;i<3;i++){
 c.startDemo(i);let d=c.active();let all=c.assessAll(d);
 assert.equal(c.worst(all),['nominal','watch','act'][i]);
 assert.equal(d.entries.length,30);
 assert.equal(disk.get(c.KEY),saved);
 c.setValue(d,c.indById('temp'),38.8);assert.equal(disk.get(c.KEY),saved);
}
c.exitDemo();assert.equal(c.store.profiles.real,p);assert.equal(disk.get(c.KEY),saved);
const before=JSON.stringify(p);
assert.ok(c.applyBaselines(p,{hr:'65',mass:'900',grip:''},c.isoOf(c.todayNum()),'Pre-flight'));
assert.equal(JSON.stringify(p),before,'invalid form is atomic');
assert.ok(c.applyBaselines(p,{hr:'65'},c.isoOf(c.todayNum()+1),'Pre-flight'));
assert.equal(c.applyBaselines(p,{hr:'65',mass:'74,5',grip:''},c.isoOf(c.todayNum()-10),'Pre-flight'), '');
assert.equal(p.baselines.hr,65);assert.equal(p.baselines.mass,74.5);assert.equal(p.baselines.grip,45);
assert.equal(c.sanitizeProfile(JSON.parse(JSON.stringify(p))).baselineMeta.hr.source,'Pre-flight');
assert.equal(c.sanitizeProfile({id:'old',name:'Old backup',baselines:{hr:58},entries:[]}).baselines.hr,58);
c.setValue(p,c.indById('hr'),76);let a=c.assess(p,c.indById('hr'));
assert.equal(a.status,'watch');assert.match(c.explainStatus(p,a),/\+11.0 bpm/);assert.match(c.explainStatus(p,a),/Pre-flight/);
for(const id of ['hr','mass','grip','temp','rad']) {
 const ind=c.indById(id),base=id==='rad'?1.8:p.baselines[id];
 const bands=ind.metric==='ratio'?ind.absBands:ind.bands;
 for(const band of bands.filter(b=>isFinite(b.max))){
  let value=ind.metric==='pct'?base*(1+band.max/100):ind.metric==='delta'?base+band.max:band.max;
  if(!c.validValue(ind,value))continue;
  let result=c.evaluate(ind,value,base);
  let msg=c.explainStatus(p,{ind,status:result.status,value,valueText:c.fmtValue(ind,value),baseline:base});
  assert.ok(msg.includes(c.STATUS[result.status].word),msg);
 }
}
c.startDemo(2);let rad=c.assess(c.active(),c.indById('rad'));assert.match(c.explainStatus(c.active(),rad),/absolute safety backstop/);
c.setValue(c.active(),c.indById('rad'),4);rad=c.assess(c.active(),c.indById('rad'));assert.match(c.explainStatus(c.active(),rad),/Ratio: 2.22/);
c.acknowledge();assert.equal(c.assess(c.active(),c.indById('rad')).status,'watch');
c.exitDemo();
console.log('PASS: scenarios, demo isolation/restoration, baseline validation/provenance/legacy import, alert explanations and acknowledgement.');
