// Generate a disposable browser smoke test beside index.html; CI opens it in Chromium.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const script = `
(function () {
  var result = document.createElement('pre'); result.id = 'history-test-result';
  var count = 0;
  function assert(ok, text) { if (!ok) throw new Error(text); count++; }
  function key(target, key) { target.dispatchEvent(new KeyboardEvent('keydown', {key:key, bubbles:true, cancelable:true})); }
  function enterValue(value) {
    setView('checkin'); startCheckin(['temp'], false); render();
    var input = document.getElementById('ci-inp'); input.value = value; key(input, 'Enter');
  }
  try {
    // This file is a disposable test origin, and no real profile is modified.
    store = {app:APP,version:VERSION,profiles:{browser:{id:'browser',name:'Browser test',baselines:{},entries:[]}},lastExport:{},dateOffset:0};
    demoSession = {store:store,guide:'Browser test'}; // suppress persistence
    openProfile('browser'); render();
    enterValue('38.7'); enterValue('36.7');
    assert(active().entries[0].readings.length === 2, 'Repeated entry lost a reading');
    assert(document.querySelectorAll('.chart-reading').length === 2, 'Chart omitted a same-day reading');
    Array.from(document.querySelectorAll('.chart-reading')).forEach(function (point) {
      var box = point.getBBox();
      assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= 640 && box.y + box.height <= 240, 'Chart point clipped');
      assert(point.querySelector('title').textContent.indexOf('202') >= 0, 'Chart point missing timestamp label');
    });
    document.querySelector('[data-click="history:temp"]').click();
    assert(document.querySelectorAll('.history-row').length === 2, 'History rows missing');
    assert(document.querySelector('.history-row time').textContent.indexOf('Time not recorded') < 0, 'Timestamp missing');
    document.querySelector('[data-click="reading:0"]').click();
    assert(document.querySelector('.dialog .row.sel').textContent.indexOf('Cancel') >= 0, 'Cancel is not default');
    key(document.body, 'Escape');
    assert(assess(active(),indById('temp')).value === 36.7, 'Cancel changed value');
    document.querySelector('[data-click="reading:0"]').click();
    document.querySelector('.dialog [data-click="pick:1"]').click();
    assert(assess(active(),indById('temp')).value === 38.7, 'Previous reading not restored');
    assert(document.querySelector('.history-row button').textContent === 'Restore', 'Restore button missing');
    document.querySelector('[data-click="reading:0"]').click();
    document.querySelector('.dialog [data-click="pick:1"]').click();
    assert(assess(active(),indById('temp')).value === 36.7, 'Restore changed capture order');
    key(document.body, 'Escape');
    assert(!ui.history && ui.ci.phase === 'result', 'Back did not return to check-in result');
    key(document.body, 'h');
    assert(ui.history.indicator === 'temp', 'H did not open current indicator history');
    assert(!crashed, 'Crash screen active');
    var extremes = {id:'extremes',name:'Extremes',baselines:{},entries:[]};
    setValue(extremes, indById('hr'), 25); setValue(extremes, indById('hr'), 220);
    var chart = document.createElement('div'); chart.className = 'chart';
    chart.innerHTML = chartSvg(extremes, indById('hr')); document.body.appendChild(chart);
    assert(chart.querySelectorAll('.chart-reading').length === 2, 'Extreme reading omitted');
    Array.from(chart.querySelectorAll('.chart-reading')).forEach(function (point) {
      var box = point.getBBox();
      assert(box.x >= 0 && box.y >= 0 && box.x + box.width <= 640 && box.y + box.height <= 240, 'Extreme point clipped');
    });
    chart.remove();
    result.textContent = 'PASS browser history: ' + count + ' assertions';
  } catch (error) { result.textContent = 'FAIL browser history: ' + error.message; }
  stopActLoop(); document.body.appendChild(result);
})();`;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replace('</body>', '<script>' + script + '</script></body>');
fs.writeFileSync(path.join(root, '.history-browser.html'), html);
console.log('Generated .history-browser.html');
