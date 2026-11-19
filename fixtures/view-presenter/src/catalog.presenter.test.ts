import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { catalogPresenter } from './catalog.presenter.ts';
import type { CatalogInput } from './catalog.ts';

const labels = { untitled: 'Untitled', errorFallback: 'Please retry' };
const input = (overrides: Partial<CatalogInput> = {}): CatalogInput => ({
  status: 'idle', items: [], error: null, ...overrides,
});

describe('catalogPresenter', () => {
  describe('display flags', () => {
    for (const [status, items, flags] of [
      ['idle', [], [false, false, false, false]],
      ['loading', [], [true, false, false, false]],
      ['loading', [{ id: 'a', title: ' Old ' }], [true, false, false, false]],
      ['ready', [], [false, false, true, false]],
      ['ready', [{ id: 'a', title: ' New ' }], [false, false, false, true]],
      ['error', [], [false, true, false, false]],
      ['error', [{ id: 'a', title: ' Old ' }], [false, true, false, false]],
    ] as const) {
      test(`${status}, ${items.length} rows: ready display flags`, () => {
        const result = catalogPresenter({ input: input({ status, items }), labels });
        assert.deepEqual([result.isLoading, result.isError, result.isEmpty, result.isLoaded], flags);
      });
    }
  });
  describe('rows', () => {
    test('trims titles and uses the supplied fallback for null and blank titles', () => {
      const { rows } = catalogPresenter({
        input: input({ status: 'ready', items: [
          { id: 'a', title: '  Alpha  ' }, { id: 'b', title: null }, { id: 'c', title: ' ' },
        ] }),
        labels,
      });

      assert.deepEqual(rows, [
        { id: 'a', title: 'Alpha' }, { id: 'b', title: 'Untitled' }, { id: 'c', title: 'Untitled' },
      ]);
    });
  });

  describe('errorMessage', () => {
    test('trims the supplied message', () => {
      const { errorMessage } = catalogPresenter({
        input: input({ status: 'error', error: ' Offline ' }), labels,
      });

      assert.equal(errorMessage, 'Offline');
    });

    test('uses the supplied fallback when the message is absent', () => {
      const { errorMessage } = catalogPresenter({
        input: input({ status: 'error' }), labels: { ...labels, errorFallback: 'Try again' },
      });

      assert.equal(errorMessage, 'Try again');
    });
  });

  test('returns the complete view state and preserves frozen inputs', () => {
    const before = Object.freeze(input({ status: 'ready', items: Object.freeze([
      Object.freeze({ id: 'a', title: ' Alpha ' }),
      Object.freeze({ id: 'b', title: null }),
    ]) }));
    const context = Object.freeze({ ...labels, untitled: 'Unnamed' });
    const result = catalogPresenter({ input: before, labels: context });
    assert.deepEqual(result, { isLoading: false, isError: false, isEmpty: false, isLoaded: true, errorMessage: 'Please retry', rows: [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Unnamed' }] });
    assert.equal(before.items[0].title, ' Alpha ');
    assert.deepEqual(catalogPresenter({ input: before, labels: context }), result);
    assert.notEqual(result.rows, before.items);
  });
});
