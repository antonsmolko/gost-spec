import { createApiEffect, define } from '@gost-kit/common';
import type { RootEffect, RootState } from '../../../../../store/contracts.ts';
import { listUsers } from '../../data/api/list-users.ts';
import type { ListAction } from './action.ts';
import { listState, type ListState } from './state.ts';

const loadEffect = () => createApiEffect(listUsers, {
      defaultError: { code: 'LIST_FAILED', message: 'Could not load users', path: [] },
      onSuccess: (rows) => ({ scope: 'directory', type: 'LoadedAction', rows }),
      onError: (errors) => ({ scope: 'directory', type: 'FailedAction', errors }),
    });

export const listReducer = define.reducer<ListState, ListAction, RootEffect, RootState>()({
  EnterAction: () => ({ state: { ...listState(), status: 'loading' }, effects: loadEffect() }),
  LoadAction: ({ state }) => ({
    state: { ...state, status: 'loading', rows: [], errors: [] },
    effects: loadEffect(),
  }),
  QueryChangedAction: ({ state, action }) => ({ state: { ...state, query: action.query } }),
  LoadedAction: ({ state, action }) => ({ state: { ...state, status: 'ready', rows: action.rows, errors: [] } }),
  FailedAction: ({ state, action }) => ({ state: { ...state, status: 'error', rows: [], errors: action.errors } }),
});
