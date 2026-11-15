import { define, type AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';

export type CreateState = {
  status: 'idle' | 'loading' | 'ready' | 'error'; name: string; created?: User; errors: AppError[];
};
export const createState = define.state<CreateState>((options = {}) => ({
  status: 'idle', name: '', errors: [], ...options,
}));
