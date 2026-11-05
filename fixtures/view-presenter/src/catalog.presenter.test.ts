import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { presentCatalog, presentRows, presentStatus } from './catalog.presenter.ts';
import type { CatalogInput } from './catalog.ts';

const labels = { untitled: 'Untitled', errorFallback: 'Please retry' };
const input = (overrides: Partial<CatalogInput> = {}): CatalogInput => ({
  status: 'idle', items: [], error: null, ...overrides,
});

describe('catalog presenter', () => {
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
      const result = presentStatus(input({ status, items }), labels);
      assert.deepEqual([result.isLoading, result.isError, result.isEmpty, result.isLoaded], flags);
    });
  }
  test('prepares rows independently with supplied nullable/blank fallback', () => {
    assert.deepEqual(presentRows([
      { id: 'a', title: '  Alpha  ' }, { id: 'b', title: null }, { id: 'c', title: ' ' },
    ], labels), [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Untitled' }, { id: 'c', title: 'Untitled' }]);
  });
  test('uses explicit context and error text', () => {
    assert.equal(presentStatus(input({ status: 'error', error: ' Offline ' }), labels).errorMessage, 'Offline');
    assert.equal(presentStatus(input({ status: 'error' }), { ...labels, errorFallback: 'Try again' }).errorMessage, 'Try again');
    assert.equal(presentRows([{ id: 'a', title: null }], { untitled: 'Unnamed' })[0].title, 'Unnamed');
  });
  test('composes independent results and preserves frozen inputs', () => {
    const before = Object.freeze(input({ status: 'ready', items: Object.freeze([
      Object.freeze({ id: 'a', title: ' Alpha ' }),
    ]) }));
    const context = Object.freeze({ ...labels });
    const result = presentCatalog(before, context);
    assert.deepEqual(result, { ...presentStatus(before, context), rows: presentRows(before.items, context) });
    assert.deepEqual(result.rows, [{ id: 'a', title: 'Alpha' }]);
    assert.equal(before.items[0].title, ' Alpha ');
    assert.deepEqual(presentCatalog(before, context), result);
    assert.notEqual(result.rows, before.items);
  });
});
