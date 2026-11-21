import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { listState } from '../../domain/fc/state.ts';
import { user } from '../../../common/index.ts';
import { usersPresenter } from './users.presenter.ts';
const labels = { loading: 'Loading users', empty: 'No users' };

describe('usersPresenter', () => {
  describe('display flags', () => {
    for (const [status, expected] of [
      ['idle', { loading: true, empty: false, failed: false }],
      ['loading', { loading: true, empty: false, failed: false }],
      ['ready', { loading: false, empty: true, failed: false }],
      ['error', { loading: false, empty: false, failed: true }],
    ] as const) {
      test(`selects the display state for ${status}`, () => {
        const { loading, empty, failed } = usersPresenter({
          input: listState({ status, errors: [{ code: 'E', message: 'Failed', path: [] }] }),
          labels,
        });

        assert.deepEqual({ loading, empty, failed }, expected);
      });
    }
  });

  test('returns the complete ready view and preserves its input', () => {
    const input = listState({ status: 'ready', query: 'GR', rows: [user(), user({ id: '2', name: 'Grace' })] });
    const before = structuredClone(input);
    assert.deepEqual(usersPresenter({ input, labels }), {
      query: 'GR', loading: false, empty: false, failed: false, message: '',
      rows: [{ key: '2', label: 'Grace' }],
    });
    assert.deepEqual(input, before);
  });
});
