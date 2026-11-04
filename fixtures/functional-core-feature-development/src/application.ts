import { createDispatch, define, reducing } from '@gost-kit/common';
import type { AppAction, AppEffect, AppState, Dependencies } from './app/contracts.js';
import { createAppEffector } from './app/effector.js';

const handlers = define.reducer<AppState, AppAction, AppEffect>()({
  SetThemeAction: ({ state, action }) => ({
    state: { ...state, preferences: { theme: action.theme } },
  }),
});
export const reducer = reducing<AppState, AppAction, AppEffect>({ root: handlers });

export const createApplication = (dependencies: Dependencies) => {
  let state: AppState = { preferences: { theme: 'dark' }, audit: { marker: 'keep' } };
  const alerts: string[] = [];
  const errors: unknown[] = [];
  const effector = createAppEffector(dependencies, alerts);
  const dispatch = createDispatch({
    readState: () => state,
    writeState: (next: AppState) => { state = next; },
    reducer,
    effector,
    onError: (error) => { errors.push(error); },
  });
  return { readState: () => state, dispatch, alerts, errors };
};
