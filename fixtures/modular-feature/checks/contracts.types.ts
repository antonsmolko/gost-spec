import { createApiEffect } from '@gost-kit/common';
import { listUsers } from '../src/features/users/list/index.ts';
import { createUser } from '../src/features/users/create/index.ts';
import type { RootAction } from '../src/store/contracts.ts';

createApiEffect(createUser, {
  // @ts-expect-error operation parameters must match the selected operation
  body: { full_name: 'Ada' },
  defaultError: { code: 'FAILED', message: 'failed', path: [] },
});
createApiEffect(listUsers, {
  defaultError: { code: 'FAILED', message: 'failed', path: [] },
  onSuccess: (rows) => {
    // @ts-expect-error mapped domain data does not expose wire fields
    rows[0].user_id;
    return { type: 'ReceivedAction', rows };
  },
});
// @ts-expect-error namespace and action membership are checked
const invalid: RootAction = { scope: 'directory', type: 'CreatedAction', user: { id: '1', name: 'Ada' } };
void invalid;
