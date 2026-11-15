const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..');
const script=`
(function () {
 var result=document.createElement('pre');result.id='crew-test-result';var count=0;
 function assert(ok,text){if(!ok)throw Error(text);count++;}
 function key(k){document.body.dispatchEvent(new KeyboardEvent('keydown',{key:k,bubbles:true,cancelable:true}));}
 try {
  stopActLoop();acked={};announced={};crewPulse={act:null,watch:null};
  store={app:APP,version:VERSION,profiles:{},lastExport:{},dateOffset:0};
  demoSession={store:store,guide:'Browser test'};
  function add(id,values){var p=sanitizeProfile({id:id,name:id,entries:[{date:isoOf(todayNum()),values:values}]});store.profiles[id]=p;return p;}
  var red=add('Red',{temp:39,bp:180,spo2:85,rad:20}),yellow=add('Yellow',{temp:38});
  add('Green',{temp:37});add('Empty',{});goHome();refreshAlarms();render();
  assert(!document.querySelector('.alarm'),'Global banner remains');
  assert(document.querySelectorAll('.crew-card.alert-live').length===2,'Wrong astronaut cards highlighted');
  assert(document.querySelectorAll('.crew-card.alert-act').length===1,'Red card missing');
  assert(document.querySelectorAll('.crew-card.alert-watch').length===1,'Yellow card missing');
  assert(document.querySelectorAll('.cc-acts li').length===4,'Multiple Act alerts hidden');
  var box=document.querySelector('.crew-card.alert-act');
  assert(box.scrollHeight<=box.clientHeight+1,'Crew card overflows');
  pulseCrew('act');
  assert(box.getAnimations().length===1,'Act pulse missing');
  assert(box.getAnimations()[0].effect.getTiming().duration===1400,'Wrong Act pulse duration');
  var media=window.matchMedia;window.matchMedia=function(){return {matches:true};};syncCrewPulses();
  assert(box.getAnimations().length===0,'Reduced motion did not stop flashing');window.matchMedia=media;
  key('a');assert(!document.querySelector('.crew-card.alert-live'),'Acknowledged cards still pulse');
  assert(document.querySelector('.crew-card.st-act'),'Acknowledgement removed clinical status');
  setValue(red,indById('temp'),40);refreshAlarms();render();
  assert(document.querySelectorAll('.crew-card.alert-live').length===1,'New reading did not re-alert only its astronaut');
  openProfile('Red');setView('trends');render();
  assert(ui.items[0].id==='spo2','Trends did not start with alphabetically first Act');
  key('Enter');assert(ui.card.ids[ui.card.i]==='spo2','Opened indicator differs from selected trend');
  key('3');assert(Array.from(document.querySelectorAll('.grp')).every(function(e){return !e.querySelector('svg');}),'Body header icons remain');
  assert(document.querySelector('.list .row svg'),'Body measurement icons removed');
  assert(!document.querySelector('.alarm'),'Banner returned in profile');
  assert(!crashed,'Crash screen active');
  result.textContent='PASS browser crew: '+count+' assertions';
 } catch(error){result.textContent='FAIL browser crew: '+error.message;}
 stopActLoop();document.body.appendChild(result);
})();`;
fs.writeFileSync(path.join(root,'.crew-browser.html'),fs.readFileSync(path.join(root,'index.html'),'utf8').replace('</body>','<script>'+script+'</script></body>'));
console.log('Generated .crew-browser.html');
