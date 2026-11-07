const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const labels = [];
const ctx = new Proxy({}, {
  get(target, key) {
    if (key === 'measureText') return text => ({ width: String(text).length * 7 });
    if (key === 'fillText') return text => { labels.push(String(text)); };
    if (!(key in target)) target[key] = () => {};
    return target[key];
  },
  set(target, key, value) { target[key] = value; return true; }
});
const sandbox = { window: {}, Math, document: {}, requestAnimationFrame: () => 1, cancelAnimationFrame: () => {} };
vm.createContext(sandbox);
for (const file of ['js/chapters/chapters-data.js', 'js/simulations/sim-ch1.js', 'js/simulations/sim-ch2.js', 'js/simulations/sim-ch3.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), sandbox, { filename: file });
}

const chapters = sandbox.window.CHAPTERS_DATA;
assert.equal(chapters.length, 13);
assert.equal(chapters.filter(c => c.status === 'active').length, 3);
assert.equal(chapters[2].resources.find(r => r.title.startsWith('PhET')).url,
  'https://phet.colorado.edu/en/simulations/semiconductor');

const ch1 = sandbox.window.SimulatorCh1;
ch1.ctx = ctx; ch1.canvas = { width: 720, height: 400 };
ch1.draw();

const ch2 = sandbox.window.SimulatorCh2;
ch2.ctx = ctx; ch2.canvas = { width: 720, height: 400 };
ch2.initParticles();
ch2.mode = 'pn-junction'; ch2.draw();
ch2.biasVoltage = -2; ch2.draw();
ch2.biasVoltage = 0.7; ch2.draw();
ch2.mode = 'band-gap';
for (const material of ['conductor', 'semiconductor', 'insulator']) {
  ch2.material = material; ch2.draw();
}

const ch3 = sandbox.window.SimulatorCh3;
ch3.ctx = ctx; ch3.canvas = { width: 720, height: 400 };
ch3.mode = 'bridge'; ch3.time = Math.PI / 2; ch3.draw();
ch3.time = 3 * Math.PI / 2; ch3.hasFilterCap = true; ch3.draw();
ch3.mode = 'iv-curve';
for (const type of ['silicon', 'germanium', 'schottky']) {
  ch3.diodeType = type;
  for (const voltage of [-2, 0, 0.7, 0.85]) {
    ch3.diodeVoltage = voltage; ch3.draw();
  }
}
assert(labels.includes('AC A') && labels.includes('AC B'));
assert(labels.some(x => x.includes('0.70 V, 10.00 mA')));
console.log('Phase 1 data and Canvas smoke checks passed');
