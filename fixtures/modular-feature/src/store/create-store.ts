import { createStore } from '@gost-kit/svelte';
import type { StoreError } from '@gost-kit/common';
import type { RootAction, RootEffect } from './contracts.ts';
import { rootState } from './state.ts';
import { rootReducer } from './reducer.ts';
import { createRootEffector } from './effector.ts';

export const reportStoreError = (failure: StoreError<RootAction, RootEffect>): void => {
  console.error('Store execution failed', failure.kind, failure.error);
};
export const createApplicationStore = (transport: typeof fetch,
  onError: (failure: StoreError<RootAction, RootEffect>) => void = reportStoreError) => createStore({
  initState: rootState, reducer: rootReducer, effector: createRootEffector(transport), onError,
});
