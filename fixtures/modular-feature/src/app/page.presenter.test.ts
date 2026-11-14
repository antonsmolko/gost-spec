import assert from 'node:assert/strict';
import test from 'node:test';
import { pagePresenter } from './page.presenter.ts';

test('page presenter selects independent ready flags', () => {
  assert.deepEqual(pagePresenter({ page: 'list' }), { list: true, create: false });
  assert.deepEqual(pagePresenter({ page: 'create' }), { list: false, create: true });
});
