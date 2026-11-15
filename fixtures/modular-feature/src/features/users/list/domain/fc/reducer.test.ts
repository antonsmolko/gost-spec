import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { rootReducer } from '../../../../../store/reducer.ts';
import { rootState } from '../../../../../store/state.ts';
import { listState } from './state.ts';
import { user } from '../../../common/domain/entities/user.ts';

describe('listReducer', () => {
  describe('EnterAction', () => {
    const { state, effects } = rootReducer(rootState({ 'users-list': listState({ query: 'old', rows: [user()] }) }),
      { scope: 'directory', type: 'EnterAction' });
    test('starts a fresh opening with loading and initial query', () => {
      assert.equal(state['users-list'].status, 'loading');
      assert.equal(state['users-list'].query, '');
      assert.deepEqual(state['users-list'].rows, []);
      assert.equal(effects.length, 1);
    });
  });
  describe('LoadAction', () => {
    const before = rootState({ 'users-list': listState({ query: 'Ada', rows: [user()] }) });
    const { state, effects } = rootReducer(before, { scope: 'directory', type: 'LoadAction' });
    test('sets loading and preserves query', () => {
      assert.equal(state['users-list'].status, 'loading');
      assert.equal(state['users-list'].query, 'Ada');
      assert.deepEqual(state['users-list'].rows, []);
    });
    test('describes API operation and result actions without execution', () => {
      assert.equal(effects.length, 1);
      const [effect] = effects;
      assert.ok(effect.type === 'ApiEffect' && effect.method === 'get');
      assert.equal(effect.url, '/users');
      assert.ok(effect.onSuccess && effect.onError);
      assert.deepEqual(effect.onSuccess([user()]), { scope: 'directory', type: 'LoadedAction', rows: [user()] });
      const errors = [{ code: 'OFFLINE', message: 'offline', path: [] }];
      assert.deepEqual(effect.onError(errors, { kind: 'network', errors: [] }), { scope: 'directory', type: 'FailedAction', errors });
    });
    test('preserves input and neighbouring slices', () => {
      assert.equal(before['users-list'].status, 'idle');
      assert.equal(before['users-list'].rows.length, 1);
      assert.equal(state['users-create'], before['users-create']);
      assert.equal(state.preferences, before.preferences);
    });
  });
  describe('LoadedAction', () => {
    const { state, effects } = rootReducer(rootState({ 'users-list': listState({ status: 'loading' }) }),
      { scope: 'directory', type: 'LoadedAction', rows: [user()] });
    test('stores domain rows and returns no effects', () => {
      assert.equal(state['users-list'].status, 'ready');
      assert.deepEqual(state['users-list'].rows, [user()]);
      assert.deepEqual(effects, []);
    });
  });
  describe('FailedAction', () => {
    const errors = [{ code: 'FAILED', message: 'Could not load', path: [] }];
    const { state } = rootReducer(rootState({ 'users-list': listState({ status: 'loading' }) }),
      { scope: 'directory', type: 'FailedAction', errors });
    test('stores errors unchanged', () => {
      assert.equal(state['users-list'].status, 'error');
      assert.equal(state['users-list'].errors, errors);
    });
  });
});
