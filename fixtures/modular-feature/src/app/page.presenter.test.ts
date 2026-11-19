import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { pagePresenter } from './page.presenter.ts';

describe('pagePresenter', () => {
  for (const [page, expected] of [
    ['list', { list: true, create: false }],
    ['create', { list: false, create: true }],
  ] as const) {
    test(`selects only the ${page} page`, () => {
      assert.deepEqual(pagePresenter({ page }), expected);
    });
  }
});
