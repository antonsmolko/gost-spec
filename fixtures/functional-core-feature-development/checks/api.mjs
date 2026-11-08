import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createApiEffect } from '@gost-kit/common';
import { defaultError, handlers, loadTotal, makeTotalEffect, makeUserEffect, userOperation } from '../dist/checks/api.js';

const execute = async (effect, fetch) => {
  const actions = [];
  await handlers(fetch).ApiEffect({ effect, dispatch: async (action) => { actions.push(action); } });
  return actions;
};

test('construction is pure; async mapper runs after request and yields domain action', async () => {
  const events = [];
  const operation = userOperation(async (dto) => {
    events.push('map');
    await Promise.resolve();
    return { id: String(dto.user_id), name: dto.full_name };
  });
  const effect = makeUserEffect(operation);
  assert.deepEqual(events, []);
  assert.equal(effect.operation, operation);
  const actions = await execute(effect, async (request) => {
    events.push('request');
    assert.equal(request.method, 'POST');
    assert.equal(request.url, 'https://api.example.invalid/user');
    assert.deepEqual(await request.json(), { email: 'user@example.invalid' });
    return Response.json({ user_id: 7, full_name: 'Ada' });
  });
  assert.deepEqual(events, ['request', 'map']);
  assert.deepEqual(actions, [{ type: 'UserLoadedAction', user: { id: '7', name: 'Ada' } }]);
});

test('same global handler executes another operation and distinct result type', async () => {
  const actions = await execute(makeTotalEffect(), async (request) => {
    assert.equal(request.method, 'GET');
    assert.equal(request.url, 'https://api.example.invalid/total');
    return Response.json(42);
  });
  assert.deepEqual(actions, [{ type: 'TotalLoadedAction', total: 42 }]);
});

for (const [kind, fetch] of [
  ['http', async () => Response.json({}, { status: 503 })],
  ['network', async () => { throw new Error('offline'); }],
  ['aborted', async () => { throw new DOMException('stopped', 'AbortError'); }],
  ['contract', async () => new Response('not JSON', { headers: { 'content-type': 'text/plain' } })],
]) {
  test(`${kind} request failure skips mapper and dispatches only error action`, async () => {
    let mappings = 0;
    const effect = makeUserEffect(userOperation(() => { mappings++; throw new Error('must not map'); }));
    const actions = await execute(effect, fetch);
    assert.equal(mappings, 0);
    assert.equal(actions.length, 1);
    assert.equal(actions[0].type, 'LoadFailedAction');
    assert.deepEqual(actions[0].errors, [defaultError]);
    assert.equal(actions[0].failure.kind, kind);
  });
}
for (const [name, mapper] of [
  ['throw', () => { throw new Error('bad DTO'); }],
  ['rejection', async () => { throw new Error('bad DTO'); }],
]) {
  test(`mapper ${name} becomes contract failure with default error`, async () => {
    const actions = await execute(makeUserEffect(userOperation(mapper)), async () => Response.json({}));
    assert.deepEqual(actions, [{
      type: 'LoadFailedAction', errors: [defaultError], failure: { kind: 'contract', errors: [] },
    }]);
  });
}

test('callback exception propagates unchanged rather than becoming API error action', async () => {
  const error = new Error('callback failure');
  let errorCalls = 0;
  const effect = createApiEffect(loadTotal, {
    defaultError, onSuccess: () => { throw error; },
    onError: () => { errorCalls++; return { type: 'LoadFailedAction' }; },
  });
  await assert.rejects(execute(effect, async () => Response.json(1)), (actual) => actual === error);
  assert.equal(errorCalls, 0);
});
test('dispatch exception propagates unchanged', async () => {
  const error = new Error('dispatch failure');
  await assert.rejects(handlers(async () => Response.json(2)).ApiEffect({
    effect: makeTotalEffect(), dispatch: async () => { throw error; },
  }), (actual) => actual === error);
});
test('omitted onSuccess skips dispatch but still runs mapper', async () => {
  let mappings = 0;
  const operation = userOperation((dto) => { mappings++; return { id: String(dto.user_id), name: dto.full_name }; });
  const effect = createApiEffect(operation, { body: { email: 'x' }, defaultError });
  assert.deepEqual(await execute(effect, async () => Response.json({ user_id: 8, full_name: 'Grace' })), []);
  assert.equal(mappings, 1);
});
test('omitted onError rejects with ApiFailure for the store reporter', async () => {
  const effect = createApiEffect(loadTotal, { defaultError });
  await assert.rejects(execute(effect, async () => Response.json({}, { status: 500 })),
    (failure) => failure.kind === 'http' && failure.status === 500 && failure.errors.length === 0);
});
