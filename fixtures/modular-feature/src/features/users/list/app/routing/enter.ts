import type { RootAction } from '../../../../../store/contracts.ts';
export const enterList = (): RootAction => ({ scope: 'directory', type: 'EnterAction' });
