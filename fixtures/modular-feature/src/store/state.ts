import { define } from '@gost-kit/common';
import { listState } from '../features/users/list/index.ts';
import { createState } from '../features/users/create/index.ts';
import type { RootState } from './contracts.ts';

export const rootState = define.state<RootState>((options = {}) => ({
  'users-list': listState(), 'users-create': createState(),
  navigation: { page: 'list' }, preferences: { theme: 'dark' }, ...options,
}));
