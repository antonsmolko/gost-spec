import type { ApiEffect as CommonApiEffect, ScopedActions } from '@gost-kit/common';

// Existing synthetic application contracts; inputs to the skill evaluation.
// The effect itself is the real published library contract.
export type { AppError as ApiError } from '@gost-kit/common';
export type StaffMember = { id: string; name: string };
export type Dependencies = { fetch: typeof globalThis.fetch };
export type Paths = {
  '/staff': { get: { responses: { 200: { content: { 'application/json': StaffMember[] } } } } };
};
export type AppState = { preferences: { theme: string }; audit: { marker: string } };
export type AppAction = ScopedActions<{ root: { type: 'SetThemeAction'; theme: string } }>;
export type ApiEffect = CommonApiEffect<Paths, AppAction>;
export type AppEffect = ApiEffect | { type: 'AlertEffect'; message: string };
