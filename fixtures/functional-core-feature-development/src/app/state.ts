import { define } from '@gost-kit/common';
import type { AppState } from './contracts.js';

export const rootState = define.state<AppState>((options = {}) => ({
  preferences: { theme: 'dark' }, audit: { marker: 'keep' }, ...options,
}));
