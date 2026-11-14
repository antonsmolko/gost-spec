import { define, reducing, scope } from '@gost-kit/common';
import { listReducer } from '../features/users/list/index.ts';
import { createReducer } from '../features/users/create/index.ts';
import type { AppAction, RootAction, RootEffect, RootState } from './contracts.ts';

const appReducer = define.reducer<RootState, AppAction, RootEffect>()({
  NavigateAction: ({ action }) => ({ effects: { type: 'NavigateEffect', to: action.to } }),
  PageOpenedAction: ({ state, action }) => ({ state: { ...state, navigation: { page: action.page } } }),
  SetThemeAction: ({ state, action }) => ({ state: { ...state, preferences: { theme: action.theme } } }),
});
export const rootReducer = reducing<RootState, RootAction, RootEffect>({
  directory: scope('users-list', listReducer),
  registration: scope('users-create', createReducer),
  app: appReducer,
});
