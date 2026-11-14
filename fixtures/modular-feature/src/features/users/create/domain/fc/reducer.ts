import { createApiEffect, define } from '@gost-kit/common';
import type { RootEffect, RootState } from '../../../../../store/contracts.ts';
import { createUser } from '../../data/api/create-user.ts';
import type { CreateAction } from './action.ts';
import { createState, type CreateState } from './state.ts';

export const createReducer = define.reducer<CreateState, CreateAction, RootEffect, RootState>()({
  EnterAction: () => ({ state: createState() }),
  NameChangedAction: ({ state, action }) => ({ state: { ...state, name: action.name } }),
  SubmitAction: ({ state }) => {
    const name = state.name.trim();
    if (!name) return { state: { ...state, status: 'error', errors: [
      { code: 'NAME_REQUIRED', message: 'Name is required', path: ['name'] },
    ] } };
    return {
      state: { ...state, status: 'loading', errors: [] },
      effects: createApiEffect(createUser, {
        body: { name },
        defaultError: { code: 'CREATE_FAILED', message: 'Could not create user', path: [] },
        onSuccess: (user) => ({ scope: 'registration', type: 'CreatedAction', user }),
        onError: (errors) => ({ scope: 'registration', type: 'FailedAction', errors }),
      }),
    };
  },
  CreatedAction: ({ state, action }) => ({
    state: { ...state, status: 'ready', created: action.user, errors: [] },
    effects: { type: 'NavigateEffect', to: 'list' },
  }),
  FailedAction: ({ state, action }) => ({ state: { ...state, status: 'error', errors: action.errors } }),
});
