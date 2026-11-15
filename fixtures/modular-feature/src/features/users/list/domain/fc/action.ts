import type { AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';
export type ListAction =
  | { type: 'EnterAction' }
  | { type: 'LoadAction' }
  | { type: 'QueryChangedAction'; query: string }
  | { type: 'LoadedAction'; rows: User[] }
  | { type: 'FailedAction'; errors: AppError[] };
