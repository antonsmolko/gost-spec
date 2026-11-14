import { createApiClient, createApiEffector, define, effecting, guard, type AppError } from '@gost-kit/common';
import { enterList } from '../features/users/list/index.ts';
import { enterCreate } from '../features/users/create/index.ts';
import type { Paths } from '../shared/api/schema.ts';
import type { NavigateEffect } from '../shared/navigation/contracts.ts';
import type { RootAction, RootEffect, RootApiOperation } from './contracts.ts';

const mapErrors = (body: unknown): AppError[] => {
  if (!guard.record(body) || !guard.array(body.errors)) return [];
  return body.errors.filter((item): item is AppError => guard.record(item)
    && guard.string(item.code) && guard.string(item.message)
    && guard.array(item.path) && item.path.every(guard.string));
};
export const createRootEffector = (transport: typeof fetch) => {
  const api = createApiClient<Paths>({ baseUrl: 'https://api.example.invalid', fetch: transport, mapErrors });
  const apiHandlers = createApiEffector<Paths, RootAction, RootApiOperation>(api);
  // Synthetic application adapter. This is not a router/reset timing recipe.
  const navigation = define.effector<RootAction, NavigateEffect>({
    NavigateEffect: async ({ effect, dispatch }) => {
      await dispatch({ scope: 'app', type: 'PageOpenedAction', page: effect.to });
      await dispatch(effect.to === 'list' ? enterList() : enterCreate());
    },
  });
  return effecting<RootAction, RootEffect, readonly [typeof apiHandlers, typeof navigation]>(apiHandlers, navigation);
};
