import type { AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';
export type CreateAction =
  | { type: 'EnterAction' }
  | { type: 'NameChangedAction'; payload: { name: string } }
  | { type: 'SubmitAction' }
  | { type: 'CreatedAction'; payload: { user: User } }
  | { type: 'FailedAction'; payload: { errors: AppError[] } };
