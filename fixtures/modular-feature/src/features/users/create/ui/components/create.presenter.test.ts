import assert from 'node:assert/strict';
import test from 'node:test';
import { createState } from '../../domain/fc/state.ts';
import { createPresenter } from './create.presenter.ts';

test('create presenter produces full form data without changing state', () => {
  const input = createState({ name: ' Ada ', status: 'loading' });
  assert.deepEqual(createPresenter({ input }), { name: ' Ada ', disabled: true, failed: false, error: '', button: 'Saving' });
  assert.equal(input.name, ' Ada ');
});
test('create presenter exposes errors and editable input', () => {
  const input = createState({ status: 'error', errors: [{ code: 'E', message: 'Invalid name', path: ['name'] }] });
  assert.deepEqual(createPresenter({ input }), { name: '', disabled: false, failed: true, error: 'Invalid name', button: 'Save user' });
});
