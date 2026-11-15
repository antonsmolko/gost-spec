import type { AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';
export type ListAction =
  | { type: 'EnterAction' }
  | { type: 'LoadAction' }
  | { type: 'QueryChangedAction'; payload: { query: string } }
  | { type: 'LoadedAction'; payload: { rows: User[] } }
  | { type: 'FailedAction'; payload: { errors: AppError[] } };
