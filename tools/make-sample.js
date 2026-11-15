// Builds sample-data.json (a crew of four) and checks it with the real rules from index.html.
//   node tools/make-sample.js          rewrite sample-data.json
//   node tools/make-sample.js --check  fail if sample-data.json is not what this script produces
// Radiation values are REAL: ISS TEPC daily dose equivalent, 16 Oct - 14 Nov 2014 (tools/nasa-iss-tepc-daily-dose-2014.json).
// Spacewalk durations are REAL: EVA 227 (30 Aug 2012, 8.3 h) and EVA 231 (9 Jul 2013, 6.1 h) from NASA's EVA log.
const fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), target = path.join(root, 'sample-data.json');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const core = html.split('/*==CORE-BEGIN==')[1].split('/*==CORE-END==*/')[0].replace(/^[^\n]*\n/, '');
const { INDICATORS, evaluate, validValue, APP, VERSION } = new Function(core + ';return {INDICATORS,evaluate,validValue,APP,VERSION};')();
const REAL = JSON.parse(fs.readFileSync(path.join(__dirname, 'nasa-iss-tepc-daily-dose-2014.json'), 'utf8')).radiation.map(x => x.mSv);
let seed = 20261114; const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296;
const n = (m, sd) => m + sd * ((rnd() + rnd() + rnd()) * 2 - 3);
const r = (v, d) => Math.round(v * 10 ** d) / 10 ** d;
const end = Date.UTC(2026, 10, 14) / 864e5, iso = d => new Date(d * 864e5).toISOString().slice(0, 10);
function make(id, name, role, b, days, story) {
  const entries = [];
  for (let i = 0; i < days; i++) {
    const left = 29 - i, v = {};
    v.spo2 = r(Math.min(99, n(97, 0.7)), 0); v.hr = r(n(b.hr + 1, 2), 0); v.bp = r(n(b.bp, 4), 0); v.temp = r(n(36.7, 0.12), 1);
    v.mass = r(b.mass - i * b.loss + n(0, 0.1), 1); v.exercise = r(n(125, 15), 0); v.sleep = r(n(7.1, 0.4), 1);
    v.dizzy = 0; v.mood = 0; v.immune = 0; v.gut = 0; v.dcs = 0; v.eva_done = 0;
    v.rad = REAL[i];                                     // same ship, same real series for everyone
    v.co2 = r(n(2.9, 0.3), 1);
    if (i % 7 === 1) { v.vision = 0; v.grip = r(n(b.grip - 1, 1), 0); v.ucal = 0; v.medkit = 0; }
    story(left, v);
    entries.push({ date: iso(end - left), values: v });
  }
  return { id, name, role, baselines: { hr: b.hr, mass: b.mass, grip: b.grip }, entries };
}
const profiles = [
  make('sample-okafor', 'Sam Okafor', 'Flight engineer', { hr: 58, bp: 119, mass: 74.0, grip: 46, loss: 0.075 }, 30, (left, v) => {
    if (left === 20) v.exercise = 40;
    if (left === 16) { v.eva_done = 1; v.eva_dur = 8.3; v.eva_air = 1; v.eva_eyes = 0; v.eva_hands = 0; }
    if (left === 15) v.eva_air = 0;
    if (left === 12) v.sleep = 5.4;
    if (left === 9) { v.eva_done = 1; v.eva_dur = 6.1; v.eva_air = 0; v.eva_eyes = 0; v.eva_hands = 1; }
    if (left === 8) v.eva_hands = 1;
    if (left === 7) v.eva_hands = 0;
    if (left === 6) v.co2 = 4.7;
    if (left === 2) { v.temp = 37.4; v.hr = 64; v.immune = 1; }
    if (left === 1) { v.temp = 37.9; v.hr = 70; v.sleep = 5.6; v.immune = 1; v.mood = 1; }
    if (left === 0) { v.temp = 38.7; v.hr = 74; v.sleep = 5.2; v.immune = 1; v.mood = 1; v.exercise = 30; v.vision = 0; v.grip = 44; v.ucal = 1; v.medkit = 0; }
  }),
  make('sample-ruiz', 'Ana Ruiz', 'Commander', { hr: 62, bp: 112, mass: 61.5, grip: 34, loss: 0.01 }, 30, (left, v) => {
    if (left === 16) { v.eva_done = 1; v.eva_dur = 8.3; v.eva_air = 0; v.eva_eyes = 0; v.eva_hands = 0; }
    if (left === 0) { v.vision = 0; v.grip = 34; v.ucal = 0; v.medkit = 0; }
  }),
  make('sample-mori', 'Kenji Mori', 'Pilot', { hr: 55, bp: 124, mass: 79.2, grip: 50, loss: 0.02 }, 30, (left, v) => {
    if (left <= 3) v.sleep = r(5.9 - (3 - left) * 0.15, 1);
    if (left === 1) v.bp = 137;
    if (left === 0) { v.bp = 141; v.mood = 1; v.vision = 0; v.grip = 49; v.ucal = 0; v.medkit = 0; }
  }),
  make('sample-fischer', 'Lena Fischer', 'Mission specialist', { hr: 60, bp: 115, mass: 66.8, grip: 38, loss: 0.015 }, 29, (left, v) => {
    if (left === 1) { v.vision = 0; v.grip = 38; v.ucal = 0; v.medkit = 0; }       // today's check-in is not done yet
  }),
];
const out = { app: APP, version: VERSION, exportedAt: iso(end), sample: true,
  note: 'Sample crew for demonstration. Because "sample" is true, the tool moves the dates on load so the last day is today. Radiation doses are real NASA measurements (ISS TEPC dosimeter, daily dose equivalent, 16 Oct to 14 Nov 2014). Spacewalk durations are real (EVA 227 of 30 Aug 2012 and EVA 231 of 9 Jul 2013, NASA EVA log). All other values are invented, and all thresholds are illustrative.',
  profiles };
const text = JSON.stringify(out, null, 1);
if (process.argv.includes('--check')) {
  if (fs.readFileSync(target, 'utf8') !== text) { console.error('sample-data.json is out of date: run node tools/make-sample.js'); process.exit(1); }
} else fs.writeFileSync(target, text);
for (const p of profiles) {
  const counts = {}, events = [];
  for (const e of p.entries) for (const ind of INDICATORS) {
    const val = e.values[ind.id]; if (val === undefined) continue;
    if (!validValue(ind, val)) throw new Error('invalid sample value ' + ind.id + ' ' + val);
    const s = evaluate(ind, val, p.baselines[ind.id]);
    counts[s.status] = (counts[s.status] || 0) + 1;
    if (s.status !== 'nominal') events.push(e.date.slice(5) + ' ' + ind.id + '=' + val + '>' + s.status);
  }
  console.log(p.name, JSON.stringify(counts), events.slice(-8).join(' | '));
}
const bad = [undefined, null, NaN, '97', Infinity, -1, 1e9, {}, []];
for (const ind of INDICATORS) for (const b of bad) { const s = evaluate(ind, b, b); if (s.status !== 'nodata') throw new Error('unsafe ' + ind.id + ' ' + String(b)); }
for (const ind of INDICATORS) { if (!ind.why || !ind.how || !ind.risk || !(ind.region || ind.hazard) || !ind.actions.watch) throw new Error('incomplete ' + ind.id);
  for (const k in ind.actions) if (ind.actions[k].who === 'earth' && !ind.actions[k].wait) throw new Error('no wait ' + ind.id); }
console.log('fail-safe ok; indicators', INDICATORS.length);
