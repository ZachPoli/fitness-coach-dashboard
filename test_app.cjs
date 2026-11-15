// Run in the public dashboard repository: node test_app.cjs
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const dataText = fs.readFileSync(path.join(__dirname, 'data.js'), 'utf8');
const original = JSON.parse(dataText.slice(dataText.indexOf('=') + 1).trim().replace(/;$/, ''));
const clone = x => JSON.parse(JSON.stringify(x));
function boot(data) {
  const nodes = new Map();
  const context = vm.createContext({URL, location: {href: 'https://example.test/#overview', hash: '#overview'},
    document: {querySelectorAll: () => [], querySelector: selector => {
      if (!nodes.has(selector)) nodes.set(selector, {innerHTML: '', textContent: '', addEventListener() {}});
      return nodes.get(selector);
    }}, window: {addEventListener() {}, scrollTo() {}, print() {}}, navigator: {}});
  vm.runInContext('const DATA=' + JSON.stringify(data) + ';', context);
  vm.runInContext(source, context);
  return expression => vm.runInContext(expression, context);
}
let cases = 0;
function test(name, fn) { fn(); cases++; console.log('PASS ' + name); }
test('current dataset renders explicitly verified bench and excluded assisted attempt', () => {
  const run = boot(original);
  for (const view of ['overview()', 'coachView()', 'coachText()']) {
    const text = run(view);
    assert.match(text, /245 lb/);
    assert.match(text, /255 lb attempt required spotter assistance and is excluded/);
    assert.doesNotMatch(text, /No (verified bench|approved tested barbell)|tested barbell PRs are pending/);
  }
  assert.match(run('overview()'), /Estimated, not tested/);
  assert.match(run('coachText()'), /These are estimates, not tested PRs/);
});
test('all existing views render with current dataset', () => {
  const run = boot(original);
  for (const view of ['overview', 'strengthView', 'runningView', 'workloadView', 'planView', 'peakView', 'coachView', 'historyView']) {
    assert.ok(run(view + '()').length > 100);
  }
});
test('unique Block 3 counts exclude peak sessions and duplicate records', () => {
  const data = clone(original);
  data.sessions.push(clone(data.sessions.find(s => s[1] === 6 && s[2] === 'Tuesday')));
  data.sessions.push(['2026-11-13', 0, 'Recovery', 'Logged', 'Synthetic recovery']);
  data.sessions.push(['2026-11-14', 7, 'Tuesday', 'Logged', 'Different block']);
  const run = boot(data);
  assert.equal(run('blockCount()'), 24);
  assert.equal(run('fullRotations()'), 6);
  assert.equal(run('rotation().next'), null);
  assert.equal(run('rotation().logged'), 4);
  assert.match(run('overview()'), /24 \/ 24/);
  assert.match(run('historyView()'), /24 \/ 24/);
  assert.match(run('coachText()'), /24\/24 unique lifting visits logged/);
  assert.doesNotMatch(run('peakView()'), /5\/4|6\/4/);
});
test('peak labels do not invent rotation zero', () => {
  const data = clone(original);
  data.sessions.push(['2099-01-01', 0, 'Recovery', 'Logged', 'Synthetic peak visit']);
  const run = boot(data);
  assert.match(run('overview()'), /Peak · Recovery/);
  assert.match(run('historyView()'), /Peak · Recovery/);
  assert.doesNotMatch(run('overview()') + run('historyView()') + run('coachText()'), /R0\b|Rotation 0\b/);
});
test('duplicate session presentation prefers reviewed Complete entry', () => {
  const data = clone(original);
  const complete = data.sessions.find(s => s[1] === 6 && s[2] === 'Tuesday' && s[3] === 'Complete');
  assert.ok(complete);
  data.sessions.push([complete[0], 6, 'Tuesday', 'Logged', 'Synthetic generic duplicate']);
  const run = boot(data);
  assert.equal(run("uniqueSessions().filter(s=>s[0]==='2026-11-10'&&s[1]===6&&s[2]==='Tuesday').length"), 1);
  assert.equal(run("blockSessions().find(s=>s[1]===6&&s[2]==='Tuesday')[3]"), 'Complete');
  assert.doesNotMatch(run('historyView()'), /Synthetic generic duplicate/);
});
test('missing and empty verified tests remain explicitly unverified', () => {
  for (const tests of [undefined, []]) {
    const data = clone(original); data.verifiedTests = tests;
    const run = boot(data);
    assert.match(run('overview()'), /No approved successful test is recorded/);
    assert.match(run('coachText()'), /No approved successful test is recorded/);
    assert.equal(run('verifiedTests().length'), 0);
  }
});
test('failed, estimated and invalid test declarations are not promoted', () => {
  const data = clone(original);
  data.verifiedTests = [{test:'Failed marker',result:255,unit:'lb',date:'2026-11-12',status:'assisted'},
    {test:'Estimate marker',result:250,unit:'lb',date:'2026-11-12',status:'estimated'},
    {test:'Invalid marker',result:'245',unit:'lb',date:'2026-11-12',status:'verified-success'}];
  const run = boot(data);
  assert.equal(run('verifiedTests().length'), 0);
  assert.doesNotMatch(run('testedPanel()'), /Failed marker|Estimate marker|Invalid marker/);
});
test('only complete four-day rotations count as full', () => {
  const data = clone(original);
  data.sessions = data.sessions.filter(s => !(s[1] === 2 && s[2] === 'Friday'));
  const run = boot(data);
  assert.equal(run('blockCount()'), 23);
  assert.equal(run('fullRotations()'), 5);
  assert.equal(run('rotation().number'), 2);
  assert.equal(run('rotation().next'), 'Friday');
});
test('reviewed test text is escaped in HTML but remains usable in plain coach text', () => {
  const data = clone(original);
  data.verifiedTests = [{test:'Bench <example>',result:245,unit:'lb',date:'2026-11-12',status:'verified-success',note:'Excluded <255>'}];
  const run = boot(data);
  assert.match(run('testedPanel()'), /Bench &lt;example&gt;/);
  assert.match(run('testedPanel()'), /Excluded &lt;255&gt;/);
  assert.match(run('coachText()'), /Bench <example>/);
});
console.log(`${cases} dashboard display tests passed.`);
