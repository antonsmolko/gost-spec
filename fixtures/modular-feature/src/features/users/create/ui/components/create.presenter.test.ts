import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { createState } from '../../domain/fc/state.ts';
import { createPresenter } from './create.presenter.ts';

describe('createPresenter', () => {
  describe('button', () => {
    test('shows the saving label while loading', () => {
      const { button } = createPresenter({ input: createState({ status: 'loading' }) });

      assert.equal(button, 'Saving');
    });

    test('shows the save label after an error', () => {
      const { button } = createPresenter({ input: createState({ status: 'error' }) });

      assert.equal(button, 'Save user');
    });
  });

  describe('name', () => {
    test('keeps the default empty name after an error', () => {
      const { name } = createPresenter({ input: createState({ status: 'error' }) });

      assert.equal(name, '');
    });
  });

  describe('error', () => {
    test('shows the message from a failed request', () => {
      const input = createState({
        status: 'error', errors: [{ code: 'E', message: 'Invalid name', path: ['name'] }],
      });
      const { error } = createPresenter({ input });

      assert.equal(error, 'Invalid name');
    });
  });

  test('returns the complete loading view and preserves its input', () => {
    const input = createState({ name: ' Ada ', status: 'loading' });
    const before = structuredClone(input);

    assert.deepEqual(createPresenter({ input }), {
      name: ' Ada ', disabled: true, failed: false, error: '', button: 'Saving',
    });
    assert.deepEqual(input, before);
  });

  test('marks the form as failed and editable after an error', () => {
    const { failed, disabled } = createPresenter({ input: createState({ status: 'error' }) });

    assert.equal(failed, true);
    assert.equal(disabled, false);
  });
});
