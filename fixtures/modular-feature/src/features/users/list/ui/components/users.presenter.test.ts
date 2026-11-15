import assert from 'node:assert/strict';
import test from 'node:test';
import { listState } from '../../domain/fc/state.ts';
import { user } from '../../../common/index.ts';
import { usersPresenter } from './users.presenter.ts';
const labels = { loading: 'Loading users', empty: 'No users' };

test('list presenter produces complete ready data and preserves its inputs', () => {
  const input = listState({ status: 'ready', query: 'GR', rows: [user(), user({ id: '2', name: 'Grace' })] });
  const before = structuredClone(input);
  assert.deepEqual(usersPresenter({ input, labels }), {
    query: 'GR', loading: false, empty: false, failed: false, message: '',
    rows: [{ key: '2', label: 'Grace' }],
  });
  assert.deepEqual(input, before);
});
for (const status of ['idle', 'loading', 'ready', 'error'] as const) {
  test('list presenter handles ' + status, () => {
    const result = usersPresenter({ input: listState({ status, errors: [{ code: 'E', message: 'Failed', path: [] }] }), labels });
    assert.equal(result.loading, status === 'idle' || status === 'loading');
    assert.equal(result.empty, status === 'ready');
    assert.equal(result.failed, status === 'error');
  });
}
