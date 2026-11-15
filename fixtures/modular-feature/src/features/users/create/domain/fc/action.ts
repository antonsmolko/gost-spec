import type { AppError } from '@gost-kit/common';
import type { User } from '../../../common/index.ts';
export type CreateAction =
  | { type: 'EnterAction' }
  | { type: 'NameChangedAction'; name: string }
  | { type: 'SubmitAction' }
  | { type: 'CreatedAction'; user: User }
  | { type: 'FailedAction'; errors: AppError[] };
