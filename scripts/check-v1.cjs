const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, file);
const { assembleVacation } = require('../app/lib/trip-engine.ts');
const search = { origin: 'Houston', budget: 2500, travelers: 2, days: 4, dateMode: 'Exact', startDate: '2026-10-10' };
const quotes = [
  { provider: 'demo', kind: 'flight', destination: 'Paris', amount: 500, currency: 'USD', live: false, startDate: search.startDate },
  { provider: 'demo', kind: 'stay', destination: 'Paris', amount: 600, currency: 'USD', live: false, startDate: search.startDate, endDate: '2026-10-13' }
];
assert(assembleVacation(search, 'Paris', quotes), 'Four days should match three lodging nights');
assert.equal(assembleVacation(search, 'Paris', [quotes[0], { ...quotes[1], endDate: '2026-10-14' }]), null, 'Reject a stay with the wrong checkout date');
const { POST } = require('../app/api/trips/route.ts');
async function post(payload) {
  return POST(new Request('http://localhost/api/trips', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }));
}
(async () => {
  let scenarios = 0;
  for (const origin of ['Houston', 'Los Angeles', 'Paris, France (CDG)', 'Seattle', 'Unknown city']) {
    for (const budget of [100, 2500, 10000]) {
      const response = await post({ origin, budget, travelers: 2, days: 4, vibe: 'Any', dateMode: 'Flexible' });
      assert.equal(response.status, 200);
      const data = await response.json();
      for (const trip of data.results) {
        assert.equal(trip.total, trip.transport + trip.stay + trip.food + trip.local + trip.activities + trip.buffer);
        assert(trip.total <= budget * 1.25, 'Results must remain within the stretch ceiling');
        if (origin.startsWith('Paris')) assert.notEqual(trip.destination, 'Paris');
      }
      for (const trip of data.roulette) assert(trip.total <= budget, 'Surprise Me must fit the budget');
      scenarios++;
    }
  }
  for (const budget of [0, -1, 100001]) assert.equal((await post({ ...search, budget })).status, 400);
  for (const payload of [{ ...search, startDate: {} }, { ...search, dateMode: 'invalid' }, null]) assert.equal((await post(payload)).status, 400);
  const malformed = await POST(new Request('http://localhost/api/trips', { method: 'POST', body: '{broken' }));
  assert.equal(malformed.status, 400);
  console.log(`Passed ${scenarios} search scenarios, budget validation, trip totals, Surprise Me bounds, and lodging date matching.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
