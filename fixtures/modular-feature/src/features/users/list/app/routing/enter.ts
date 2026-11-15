import type { DispatchAction } from '@gost-kit/common';
import type { RootAction } from '../../../../../store/contracts.ts';
export const enterList = (): DispatchAction<RootAction> => ({ action: 'directory/EnterAction' });
