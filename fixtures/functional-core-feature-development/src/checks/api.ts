// Standalone published API consumer checks, not feature reducer tests.
import {
  createApiClient, createApiEffect, createApiEffector, defineApiOperation,
  type ApiEffect, type ApiFailure, type AppError,
} from '@gost-kit/common';

type Dto = { user_id: number; full_name: string };
type User = { id: string; name: string };
type Paths = {
  '/user': { post: {
    requestBody: { content: { 'application/json': { email: string } } };
    responses: { 200: { content: { 'application/json': Dto } } };
  } };
  '/total': { get: { responses: { 200: { content: { 'application/json': number } } } } };
};
export const userOperation = (mapResponse: (dto: Dto) => User | Promise<User>) =>
  defineApiOperation<Paths>()({ method: 'post', url: '/user', mapResponse });
export const loadUser = userOperation((dto) => ({ id: String(dto.user_id), name: dto.full_name }));
export const loadTotal = defineApiOperation<Paths>()({ method: 'get', url: '/total' });
type Operation = typeof loadUser | typeof loadTotal;
type Success = { type: 'UserLoadedAction'; user: User } | { type: 'TotalLoadedAction'; total: number };
type Failure = { type: 'LoadFailedAction'; errors: AppError[]; failure: ApiFailure };
type Action = Success | Failure;
type Effect = ApiEffect<Operation, Success, Failure>;
export const defaultError: AppError = { code: 'LOAD_FAILED', message: 'Could not load', path: [] };
export const makeUserEffect = (operation = loadUser): Effect => createApiEffect(operation, {
  body: { email: 'user@example.invalid' }, defaultError,
  onSuccess: (user) => ({ type: 'UserLoadedAction', user }),
  onError: (errors, failure) => ({ type: 'LoadFailedAction', errors, failure }),
});
export const makeTotalEffect = (): Effect => createApiEffect(loadTotal, {
  defaultError,
  onSuccess: (total) => ({ type: 'TotalLoadedAction', total }),
  onError: (errors, failure) => ({ type: 'LoadFailedAction', errors, failure }),
});
export const handlers = (fetch: typeof globalThis.fetch) => createApiEffector<Paths, Action, Operation>(
  createApiClient<Paths>({ baseUrl: 'https://api.example.invalid', fetch }),
);

// Compiled negative cases: route/options, mapped result and action roles remain correlated.
const typeChecks = (operation: Operation) => {
  createApiEffect(loadUser, {
    defaultError,
    // @ts-expect-error POST body email is a string, not number
    body: { email: 1 },
  });
  createApiEffect(loadUser, {
    body: { email: 'x' }, defaultError,
    // @ts-expect-error callback receives mapped User, not raw Dto
    onSuccess: (dto: Dto) => ({ type: 'UserLoadedAction', user: dto }),
  });
  createApiEffect<typeof loadUser, Extract<Success, { type: 'UserLoadedAction' }>, Failure>(loadUser, {
    body: { email: 'x' }, defaultError,
    // @ts-expect-error success callback cannot return the failure action role
    onSuccess: () => ({ type: 'LoadFailedAction', errors: [], failure: { kind: 'contract', errors: [] } }),
  });
  // @ts-expect-error unresolved operation union cannot prove route/options correlation
  createApiEffect(operation, { body: { email: 'x' }, defaultError });
};
void typeChecks;
