import { defineApiOperation } from '@gost-kit/common';
import type { Paths } from '../../../../../shared/api/schema.ts';
import { mapUser } from '../../../common/index.ts';

export const createUser = defineApiOperation<Paths>()({
  method: 'post', url: '/users', mapResponse: mapUser,
});
