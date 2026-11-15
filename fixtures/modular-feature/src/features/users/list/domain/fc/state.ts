import { define, type AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';

export type ListState = {
  status: 'idle' | 'loading' | 'ready' | 'error'; query: string; rows: User[]; errors: AppError[];
};
export const listState = define.state<ListState>((options = {}) => ({
  status: 'idle', query: '', rows: [], errors: [], ...options,
}));
