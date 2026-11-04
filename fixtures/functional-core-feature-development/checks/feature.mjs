import assert from 'node:assert/strict';
import { createApplication, reducer } from '../dist/application.js';

const freeze = (value) => {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
};
const rows = [{ id: 'one', name: 'Ada' }];
let calls = 0;
let resolveLoad;
const app = createApplication({ loadStaff: () => { calls++; return new Promise((resolve) => { resolveLoad = resolve; }); } });
const before = freeze(app.readState());
assert.ok(before.staff, 'requested staff feature is missing');
assert.equal(before.staff.status, 'idle');
const commit = reducer(before, { scope: 'directory', type: 'LoadStaffAction' });
assert.equal(calls, 0, 'pure reducer must not perform I/O');
assert.equal(commit.state.staff.status, 'loading');
assert.deepEqual(commit.state.staff.rows, []);
assert.deepEqual(commit.state.preferences, before.preferences);
assert.deepEqual(commit.state.audit, before.audit);
assert.equal(commit.effects.length, 1);
assert.equal(before.staff.status, 'idle');
const pending = app.dispatch({ scope: 'directory', type: 'LoadStaffAction' });
assert.equal(app.readState().staff.status, 'loading');
assert.equal(calls, 1);
resolveLoad(rows);
await pending;
assert.equal(app.readState().staff.status, 'ready');
assert.deepEqual(app.readState().staff.rows, rows);
assert.deepEqual(app.errors, []);
await app.dispatch({ type: 'SetThemeAction', theme: 'light' });
assert.equal(app.readState().preferences.theme, 'light');
assert.deepEqual(app.readState().staff.rows, rows);
assert.deepEqual(app.readState().audit, { marker: 'keep' });
const failed = createApplication({ loadStaff: async () => { throw new Error('offline'); } });
await failed.dispatch({ scope: 'directory', type: 'LoadStaffAction' });
assert.equal(failed.readState().staff.status, 'error');
assert.equal(failed.readState().staff.error, 'offline');
assert.deepEqual(failed.alerts, ['offline']);
assert.deepEqual(failed.errors, []);
console.log('FC feature probes passed: pure transitions, full state, scoped routing, effects/results, existing global handler and neighbours');
