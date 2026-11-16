import assert from 'node:assert/strict';
import test from 'node:test';
import { createApplication } from '../src/store/application.ts';

const response = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'content-type': 'application/json' },
});

test('create maps DTO, navigates through app and list fetches fresh rows', async () => {
  const calls: string[] = [];
  const app = createApplication(async (request) => {
    const req = new Request(request);
    calls.push(req.method);
    if (req.method === 'POST') {
      assert.deepEqual(await req.json(), { name: 'Ada' });
      return response({ user_id: '1', full_name: 'Ada' });
    }
    return response([{ user_id: '1', full_name: 'Ada' }]);
  });
  await app.dispatch('app/NavigateAction', { to: 'create' });
  await app.dispatch('registration/NameChangedAction', { name: 'Ada' });
  await app.dispatch('registration/SubmitAction');
  assert.deepEqual(calls, ['POST', 'GET']);
  assert.equal(app.state.navigation.page, 'list');
  assert.equal(app.state['users-list'].status, 'ready');
  assert.deepEqual(app.state['users-list'].rows, [{ id: '1', name: 'Ada' }]);
  assert.equal(app.state.preferences.theme, 'dark');
  assert.deepEqual(app.errors, []);
});

for (const sample of [
  { name: 'HTTP', body: { errors: [{ code: 'DENIED', message: 'Denied', path: [] }] }, status: 403, code: 'DENIED' },
  { name: 'malformed DTO', body: [{ invalid: true }], status: 200, code: 'LIST_FAILED' },
  { name: 'invalid collection', body: { users: [] }, status: 200, code: 'LIST_FAILED' },
]) {
  test(sample.name + ' becomes error state without success', async () => {
    const app = createApplication(async () => response(sample.body, sample.status));
    await app.dispatch('directory/LoadAction');
    assert.equal(app.state['users-list'].status, 'error');
    assert.equal(app.state['users-list'].errors[0].code, sample.code);
    assert.deepEqual(app.state['users-list'].rows, []);
    assert.deepEqual(app.errors, []);
  });
}

test('network failure uses the configured fallback', async () => {
  const app = createApplication(async () => { throw new Error('offline'); });
  await app.dispatch('registration/NameChangedAction', { name: 'Ada' });
  await app.dispatch('registration/SubmitAction');
  assert.equal(app.state['users-create'].status, 'error');
  assert.equal(app.state['users-create'].errors[0].code, 'CREATE_FAILED');
  assert.equal(app.state.navigation.page, 'list');
});

test('both dispatch forms feed payload to reducers and invalid paths report without changing state', async () => {
  const app = createApplication(async () => response([]));
  await app.dispatch('directory/QueryChangedAction', { query: 'Ada' });
  assert.equal(app.state['users-list'].query, 'Ada');
  await app.dispatch({ action: 'directory/QueryChangedAction', payload: { query: 'Grace' } });
  assert.equal(app.state['users-list'].query, 'Grace');
  const before = app.state;
  // Simulate untyped external input at the runtime boundary, not ordinary application code.
  await Reflect.apply(app.dispatch, undefined, ['invalid-path']);
  assert.equal(app.state, before);
  assert.equal(app.errors.length, 1);
  assert.ok(typeof app.errors[0] === 'object' && app.errors[0] !== null);
  assert.ok('kind' in app.errors[0] && app.errors[0].kind === 'dispatch');
});
