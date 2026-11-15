import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { rootReducer } from '../../../../../store/reducer.ts';
import { rootState } from '../../../../../store/state.ts';
import { createState } from './state.ts';
import { user } from '../../../common/domain/entities/user.ts';

describe('createReducer', () => {
  describe('SubmitAction', () => {
    const before = rootState({ 'users-create': createState({ name: 'Ada' }) });
    const { state, effects } = rootReducer(before, { scope: 'registration', type: 'SubmitAction' });
    test('sets loading without changing another scenario', () => {
      assert.equal(state['users-create'].status, 'loading');
      assert.equal(before['users-create'].status, 'idle');
      assert.equal(state['users-list'], before['users-list']);
    });
    test('describes request body and receiver actions', () => {
      const [effect] = effects;
      assert.ok(effect.type === 'ApiEffect' && effect.method === 'post');
      assert.deepEqual(effect.body, { name: 'Ada' });
      assert.ok(effect.onSuccess && effect.onError);
      assert.deepEqual(effect.onSuccess(user()), { scope: 'registration', type: 'CreatedAction', user: user() });
      const errors = [{ code: 'INVALID', message: 'Invalid name', path: ['name'] }];
      assert.deepEqual(effect.onError(errors, { kind: 'http', errors, status: 400 }),
        { scope: 'registration', type: 'FailedAction', errors });
    });
  });
  describe('SubmitAction with blank name', () => {
    const { state, effects } = rootReducer(rootState(), { scope: 'registration', type: 'SubmitAction' });
    test('reports validation error without API', () => {
      assert.equal(state['users-create'].status, 'error');
      assert.equal(state['users-create'].errors[0].code, 'NAME_REQUIRED');
      assert.deepEqual(effects, []);
    });
  });
  describe('CreatedAction', () => {
    const { state, effects } = rootReducer(rootState({ 'users-create': createState({ status: 'loading' }) }),
      { scope: 'registration', type: 'CreatedAction', user: user() });
    test('stores domain result and describes app navigation', () => {
      assert.equal(state['users-create'].status, 'ready');
      assert.deepEqual(state['users-create'].created, user());
      assert.deepEqual(effects, [{ type: 'NavigateEffect', to: 'list' }]);
    });
  });
  describe('FailedAction', () => {
    const errors = [{ code: 'INVALID', message: 'Invalid name', path: ['name'] }];
    const { state, effects } = rootReducer(rootState({ 'users-create': createState({ status: 'loading' }) }),
      { scope: 'registration', type: 'FailedAction', errors });
    test('stores API errors without navigation', () => {
      assert.equal(state['users-create'].status, 'error');
      assert.equal(state['users-create'].errors, errors);
      assert.deepEqual(effects, []);
    });
  });
});
