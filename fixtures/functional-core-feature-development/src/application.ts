import { createDispatch, define, effecting, reducing } from '@gost-kit/common';

export type StaffMember = { id: string; name: string };
export type Dependencies = { loadStaff: () => Promise<StaffMember[]> };
export type AppState = { preferences: { theme: string }; audit: { marker: string } };
export type AppAction = { type: 'SetThemeAction'; theme: string };
export type AppEffect = { type: 'AlertEffect'; message: string };

const handlers = define.reducer<AppState, AppAction, AppEffect>()({
  SetThemeAction: ({ state, action }) => ({
    state: { ...state, preferences: { theme: action.theme } },
  }),
});
export const reducer = reducing<AppState, AppAction, AppEffect>({ root: handlers });

export const createApplication = (_dependencies: Dependencies) => {
  let state: AppState = { preferences: { theme: 'dark' }, audit: { marker: 'keep' } };
  const alerts: string[] = [];
  const errors: unknown[] = [];
  const globalEffects = define.effector<AppAction, AppEffect>({
    AlertEffect: async ({ effect }) => { alerts.push(effect.message); },
  });
  const effector = effecting<AppAction, AppEffect, [typeof globalEffects]>(globalEffects);
  const dispatch = createDispatch({
    readState: () => state,
    writeState: (next: AppState) => { state = next; },
    reducer,
    effector,
    onError: (error) => { errors.push(error); },
  });
  return { readState: () => state, dispatch, alerts, errors };
};
