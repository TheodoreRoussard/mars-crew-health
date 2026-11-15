// Static checks on the deliverable: the brief's hard constraints, coverage of every NASA risk and hazard,
// and the sample file. No dependencies. Run: node tests/static.js
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
let passed = 0;
const ok = (c, m) => { if (!c) { console.log('FAIL', m); process.exitCode = 1; } else { passed++; console.log('ok  ', m); } };

// 1. One self-contained file that opens from file:// with no network.
const scripts = html.match(/<script\b[^>]*>/gi) || [];
ok(scripts.length === 1 && !/\bsrc\s*=/i.test(scripts[0]), 'exactly one inline <script>, no external script');
ok(!/<link\b/i.test(html) && !/@import/i.test(html), 'no <link> and no @import');
ok(!/https?:\/\//i.test(html), 'no http(s) URL anywhere in the file (no CDN, no web font, no remote image)');
ok(!/\bfetch\s*\(|XMLHttpRequest|WebSocket|navigator\.sendBeacon|\bimport\s*\(/.test(html), 'no network or dynamic-import call');
ok(!/\beval\s*\(|new Function\s*\(|document\.write/.test(html), 'no eval, new Function or document.write');
const kb = fs.statSync(path.join(root, 'index.html')).size / 1024;
ok(kb < 200, 'index.html is ' + kb.toFixed(0) + ' KB (budget 200 KB for a Raspberry Pi 4)');
ok(/<meta charset="utf-8">/i.test(html) && /<html lang="en">/.test(html), 'charset and language declared');
ok(!/animation:[^;}]*infinite/.test(html.replace(/\.alarm\.live\.st-act\{[^}]*\}/, '')), 'no continuous animation except the Act alarm border');

// 2. The rules table.
const core = html.split('/*==CORE-BEGIN==')[1].split('/*==CORE-END==*/')[0].replace(/^[^\n]*\n/, '');
const C = new Function(core + ';return {INDICATORS,evaluate,validValue,APP,VERSION,STATUS,OWNERS,REGIONS,HAZARDS};')();
ok(Object.keys(C.STATUS).sort().join() === 'act,nodata,nominal,watch', 'exactly four statuses');
const RISKS = ['Altered immune system', 'Altered sensorimotor and vestibular function', 'Cardiovascular adaptation', 'Decompression sickness',
  'Host–microorganism interactions', 'Hypoxia', 'Inadequate food and nutrition', 'spacewalks (EVA)',
  'Cardiorespiratory and musculoskeletal fitness', 'Neuro-ocular Syndrome (SANS)', 'bone changes'];
const missing = RISKS.filter(r => !C.INDICATORS.some(i => i.risk.includes(r)));
ok(missing.length === 0, 'all 11 NASA risks have at least one indicator' + (missing.length ? ' (missing: ' + missing.join(', ') + ')' : ''));
const hz = ['radiation', 'closed', 'isolation', 'distance', 'gravity'].filter(h => !C.INDICATORS.some(i => i.hazard === h));
ok(hz.length === 0, 'all 5 NASA hazards have at least one indicator');
const ids = C.INDICATORS.map(i => i.id);
ok(new Set(ids).size === ids.length, 'indicator ids are unique');
let bad = [];
for (const i of C.INDICATORS) {
  if (!i.label || !i.how || !i.why || !i.risk || !(i.region || i.hazard)) bad.push(i.id + ': missing text or group');
  if (i.region && !C.REGIONS.some(r => r.id === i.region)) bad.push(i.id + ': unknown region');
  if (i.hazard && !C.HAZARDS.some(h => h.id === i.hazard)) bad.push(i.id + ': unknown hazard');
  if (i.after && !ids.includes(i.after)) bad.push(i.id + ': unknown gate');
  if (!/[.?]$/.test(i.why) || (i.why.match(/[.!?](\s|$)/g) || []).length !== 1) bad.push(i.id + ': "why" must be one sentence');
  const levels = i.type === 'choice' ? i.options.map(o => o.s) : i.bands.concat(i.absBands || []).map(b => b.s);
  for (const st of ['watch', 'act']) {
    if (!levels.includes(st)) continue;
    const act = i.actions[st];
    if (!act) { bad.push(i.id + ': no action for ' + st); continue; }
    if (!C.OWNERS[act.who]) bad.push(i.id + ': unknown owner');
    if (!/^[A-Z][a-z]+[ ,]/.test(act.t) || !/[.]$/.test(act.t)) bad.push(i.id + ': action must be one imperative sentence');
    if (act.who === 'earth' && !act.wait) bad.push(i.id + ': Earth escalation without "while waiting" text');
  }
  if (i.type === 'number') {
    if (!(i.min < i.max) || typeof i.dec !== 'number' || !i.unit) bad.push(i.id + ': bad numeric definition');
    if (i.bands[i.bands.length - 1].max !== Infinity) bad.push(i.id + ': last band must be open-ended');
  }
}
ok(bad.length === 0, 'every indicator is complete: texts, groups, one action per alert level, Earth wait text' + (bad.length ? '\n     ' + bad.join('\n     ') : ''));
let unsafe = 0;
for (const i of C.INDICATORS) for (const v of [undefined, null, NaN, '97', Infinity, -Infinity, -1, 1e9, {}, [], true]) if (C.evaluate(i, v, v).status !== 'nodata') unsafe++;
ok(unsafe === 0 && C.evaluate(null, 1, 1).status === 'nodata', 'evaluate() fails safe: every invalid input gives "No data"');

// 3. The sample file.
const sample = JSON.parse(fs.readFileSync(path.join(root, 'sample-data.json'), 'utf8'));
ok(sample.app === C.APP && sample.version === C.VERSION && Array.isArray(sample.profiles) && sample.profiles.length >= 1, 'sample-data.json has the backup format of this version');
const st = { watch: 0, act: 0 }; let invalid = 0, days = Infinity;
for (const p of sample.profiles) {
  days = Math.min(days, p.entries.length);
  for (const e of p.entries) for (const i of C.INDICATORS) {
    const v = e.values[i.id]; if (v === undefined) continue;
    if (!C.validValue(i, v)) invalid++;
    const s = C.evaluate(i, v, p.baselines[i.id]).status; if (st[s] !== undefined) st[s]++;
  }
}
ok(invalid === 0, 'every sample value is valid for its indicator');
ok(sample.profiles.some(p => p.entries.length >= 30), 'sample holds 30 days for at least one astronaut');
ok(st.watch >= 1 && st.act >= 1, 'sample contains Watch (' + st.watch + ') and Act (' + st.act + ') readings');
console.log(process.exitCode ? '\nSOME CHECKS FAILED' : '\nAll ' + passed + ' static checks passed');
