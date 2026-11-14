import type { CreateState } from '../../domain/fc/state.ts';
export type CreateView = { name: string; disabled: boolean; failed: boolean; error: string; button: string };
export const createPresenter = ({ input }: { input: CreateState }): CreateView => ({
  name: input.name, disabled: input.status === 'loading', failed: input.status === 'error',
  error: input.errors.map((e) => e.message).join('; '), button: input.status === 'loading' ? 'Saving' : 'Save user',
});
