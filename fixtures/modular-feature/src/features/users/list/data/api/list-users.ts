import { defineApiOperation } from '@gost-kit/common';
import type { Paths } from '../../../../../shared/api/schema.ts';
import { mapUser } from '../../../common/index.ts';

export const listUsers = defineApiOperation<Paths>()({
  method: 'get', url: '/users',
  mapResponse: (rows) => {
    if (!Array.isArray(rows)) throw new Error('Invalid user collection');
    return rows.map(mapUser);
  },
});
