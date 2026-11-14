import type { ApiEffect, ScopedActions } from '@gost-kit/common';
import type { ListState, ListAction, listUsers } from '../features/users/list/index.ts';
import type { CreateState, CreateAction, createUser } from '../features/users/create/index.ts';
import type { NavigateEffect, Page } from '../shared/navigation/contracts.ts';

export type RootState = {
  'users-list': ListState; 'users-create': CreateState;
  navigation: { page: Page }; preferences: { theme: 'dark' | 'light' };
};
export type AppAction =
  | { type: 'NavigateAction'; to: Page }
  | { type: 'PageOpenedAction'; page: Page }
  | { type: 'SetThemeAction'; theme: 'dark' | 'light' };
export type RootAction = ScopedActions<{ directory: ListAction; registration: CreateAction; app: AppAction }>;
export type RootApiOperation = typeof listUsers | typeof createUser;
export type RootEffect = ApiEffect<RootApiOperation, RootAction, RootAction> | NavigateEffect;
