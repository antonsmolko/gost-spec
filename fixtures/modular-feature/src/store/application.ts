// Non-Svelte integration harness: real common dispatch + existing app handlers.
import { createDispatch } from '@gost-kit/common';
import { rootState } from './state.ts';
import { rootReducer } from './reducer.ts';
import { createRootEffector } from './effector.ts';
import type { RootState } from './contracts.ts';

export const createApplication = (transport: typeof fetch) => {
  let state = rootState();
  const errors: unknown[] = [];
  const dispatch = createDispatch({
    readState: () => state, writeState: (next: RootState) => { state = next; },
    reducer: rootReducer, effector: createRootEffector(transport), onError: (error) => { errors.push(error); },
  });
  return { get state() { return state; }, dispatch, errors };
};
