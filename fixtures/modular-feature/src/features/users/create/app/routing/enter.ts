import type { DispatchAction } from '@gost-kit/common';
import type { RootAction } from '../../../../../store/contracts.ts';
export const enterCreate = (): DispatchAction<RootAction> => ({ action: 'registration/EnterAction' });
