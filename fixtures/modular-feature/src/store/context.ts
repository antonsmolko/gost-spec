import { createContext } from 'svelte';
import type { Store } from '@gost-kit/common';
import type { RootAction, RootState } from './contracts.ts';
export const [useStore, provideStore] = createContext<Store<RootState, RootAction>>();
