import type { ApiEffect as CommonApiEffect, ScopedActions } from '@gost-kit/common';
import type { AppApiOperation } from './api.js';

// Existing synthetic application contracts; inputs to the skill evaluation.
// The effect itself is the real published library contract.
export type { AppError as ApiError } from '@gost-kit/common';
export type StaffMember = { id: string; name: string };
export type Dependencies = { fetch: typeof globalThis.fetch };
export type AppState = { preferences: { theme: string }; audit: { marker: string } };
export type AppAction = ScopedActions<{ root: { type: 'SetThemeAction'; theme: string } }>;
export type ApiEffect = CommonApiEffect<AppApiOperation, AppAction, AppAction>;
export type AppEffect = ApiEffect | { type: 'AlertEffect'; message: string };
