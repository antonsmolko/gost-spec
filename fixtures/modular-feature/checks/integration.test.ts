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
  await app.dispatch({ scope: 'app', type: 'NavigateAction', to: 'create' });
  await app.dispatch({ scope: 'registration', type: 'NameChangedAction', name: 'Ada' });
  await app.dispatch({ scope: 'registration', type: 'SubmitAction' });
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
    await app.dispatch({ scope: 'directory', type: 'LoadAction' });
    assert.equal(app.state['users-list'].status, 'error');
    assert.equal(app.state['users-list'].errors[0].code, sample.code);
    assert.deepEqual(app.state['users-list'].rows, []);
    assert.deepEqual(app.errors, []);
  });
}

test('network failure uses the configured fallback', async () => {
  const app = createApplication(async () => { throw new Error('offline'); });
  await app.dispatch({ scope: 'registration', type: 'NameChangedAction', name: 'Ada' });
  await app.dispatch({ scope: 'registration', type: 'SubmitAction' });
  assert.equal(app.state['users-create'].status, 'error');
  assert.equal(app.state['users-create'].errors[0].code, 'CREATE_FAILED');
  assert.equal(app.state.navigation.page, 'list');
});
