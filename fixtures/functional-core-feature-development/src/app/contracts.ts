import type { ScopedActions } from '@gost-kit/common';

// Existing synthetic application contracts; inputs to the skill evaluation.
// This is not a specification of the gost-kit ApiEffect API.
export type ApiError = { code: string; message: string; path: string[] };
export type StaffMember = { id: string; name: string };
export type Dependencies = { loadStaff: () => Promise<StaffMember[]> };
export type AppState = { preferences: { theme: string }; audit: { marker: string } };
export type AppAction = ScopedActions<{ root: { type: 'SetThemeAction'; theme: string } }>;
export type ApiEffect = {
  type: 'ApiEffect';
  url: '/staff';
  receiverSuccess: (rows: StaffMember[]) => AppAction;
  receiverError: (errors: ApiError[]) => AppAction;
};
export type AppEffect = ApiEffect | { type: 'AlertEffect'; message: string };
