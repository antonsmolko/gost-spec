import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { pagePresenter } from './page.presenter.ts';

describe('pagePresenter', () => {
  describe('list', () => {
    test('selects the list page when it is current', () => {
      const { list } = pagePresenter({ page: 'list' });
      assert.equal(list, true);
    });

    test('clears the list flag when the create page is current', () => {
      const { list } = pagePresenter({ page: 'create' });
      assert.equal(list, false);
    });
  });

  describe('create', () => {
    test('selects the create page when it is current', () => {
      const { create } = pagePresenter({ page: 'create' });
      assert.equal(create, true);
    });

    test('clears the create flag when the list page is current', () => {
      const { create } = pagePresenter({ page: 'list' });
      assert.equal(create, false);
    });
  });
});
