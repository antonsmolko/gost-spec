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
const app = createApplication({ fetch: async (request) => {
  calls++;
  assert.equal(request.method, 'GET');
  assert.equal(request.url, 'https://api.example.invalid/staff');
  return new Promise((resolve) => { resolveLoad = resolve; });
} });
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
assert.equal(commit.effects[0].type, 'ApiEffect', 'feature must reuse the application API effect');
assert.equal(commit.effects[0].method, 'get');
assert.equal(commit.effects[0].url, '/staff');
assert.deepEqual(commit.effects[0].onSuccess(rows), {
  scope: 'directory', type: 'StaffLoadedAction', rows,
});
const apiErrors = [{ code: 'OFFLINE', message: 'offline', path: ['staff'] }];
assert.deepEqual(commit.effects[0].onError(apiErrors, { kind: 'http', status: 422, errors: apiErrors }), {
  scope: 'directory', type: 'StaffFailedAction', errors: apiErrors,
});
assert.equal(before.staff.status, 'idle');
const pending = app.dispatch({ scope: 'directory', type: 'LoadStaffAction' });
assert.equal(app.readState().staff.status, 'loading');
assert.equal(calls, 1);
resolveLoad(Response.json(rows));
await pending;
assert.equal(app.readState().staff.status, 'ready');
assert.deepEqual(app.readState().staff.rows, rows);
assert.deepEqual(app.errors, []);
await app.dispatch({ type: 'SetThemeAction', theme: 'light' });
assert.equal(app.readState().preferences.theme, 'light');
assert.deepEqual(app.readState().staff.rows, rows);
assert.deepEqual(app.readState().audit, { marker: 'keep' });
const failed = createApplication({ fetch: async () => Response.json({ errors: apiErrors }, { status: 422 }) });
await failed.dispatch({ scope: 'directory', type: 'LoadStaffAction' });
assert.equal(failed.readState().staff.status, 'error');
assert.deepEqual(failed.readState().staff.errors, apiErrors);
assert.deepEqual(failed.alerts, ['offline']);
assert.deepEqual(failed.errors, []);
for (const fetch of [
  async () => { throw new Error('offline'); },
  async () => Response.json({}, { status: 500 }),
]) {
  const fallback = createApplication({ fetch });
  await fallback.dispatch({ scope: 'directory', type: 'LoadStaffAction' });
  assert.equal(fallback.readState().staff.status, 'error');
  assert.deepEqual(fallback.readState().staff.errors, [commit.effects[0].defaultError]);
  assert.deepEqual(fallback.alerts, [commit.effects[0].defaultError.message]);
  assert.deepEqual(fallback.errors, []);
}
console.log('FC feature probes passed: pure transitions, full state, scoped routing, effects/results, existing global handler and neighbours');
