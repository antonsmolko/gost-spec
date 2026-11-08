# Public API recipe

Checked against registry-installed `@gost-kit/common@0.3.0` on Node `26.11.1`,
TypeScript `5.9.3` and `@types/node@26.6.5`. The package requires Node `^26.0.0`.
The [published package](https://www.npmjs.com/package/@gost-kit/common/v/0.3.0)
is the verified baseline; inspect the consumer's installed exports/types and
environment before adapting code. Other versions require their own checks.
Do not silently upgrade a consumer to match this example.

## Ownership and prerequisites

A feature's FC consists of `state.ts`, `action.ts`, `reducer.ts` and
`reducer.test.ts`. Keep the surrounding project layout. Import the application's
existing root contracts; do not add feature effect types or a feature effector.
`AppEffector`/`RootEffector` owns the shared handlers. For example, a reducer
returns an existing `ApiEffect` whose callbacks produce result actions; the
application handler performs the request and dispatches those returned actions.

The example assumes an existing app contract exposing `RootState`, `RootAction`,
`RootEffect`, `ApiError` and the response entity `User`. Reuse the public
`ApiEffect<RootApiOperation, RootAction, RootAction>`. Each operation binds the
application's OpenAPI route/method to its response mapper.
Here `ApiError` aliases public `AppError`, whose `path` is `readonly string[]`.
The application owns the client, operation definitions, backend error mapping and `createApiEffector`.
If those prerequisites are unavailable, report incomplete integration rather
than creating a feature effect or transport handler.

For this synthetic POST `/user` example, the existing API operations and contracts are:

```ts
// src/app/api.ts
import { defineApiOperation } from '@gost-kit/common';
import type { User } from './contracts.js';

type UserDto = { user_id: number; full_name: string };
export type Paths = {
  '/staff': { get: { responses: { 200: { content: { 'application/json': UserDto[] } } } } };
  '/user': {
    post: {
      requestBody: { content: { 'application/json': { email: string } } };
      responses: { 200: { content: { 'application/json': UserDto } } };
    };
  };
};
const mapUser = (dto: UserDto): User => ({ id: String(dto.user_id), name: dto.full_name });
export const loadUser = defineApiOperation<Paths>()({
  method: 'post', url: '/user', mapResponse: mapUser,
});
export const loadStaff = defineApiOperation<Paths>()({
  method: 'get', url: '/staff', mapResponse: (rows) => rows.map(mapUser),
});
export type RootApiOperation = typeof loadUser | typeof loadStaff;
```

```ts
// src/app/contracts.ts
import type { ApiEffect, ScopedActions } from '@gost-kit/common';
import type { RootApiOperation } from './api.js';
import type { UserAction } from '../features/user/fc/action.js';
import type { UserState } from '../features/user/fc/state.js';

export type { AppError as ApiError } from '@gost-kit/common';
export type User = { id: string; name: string };
export type RootState = { user: UserState; preferences: { theme: string } };
export type RootAction = ScopedActions<{ users: UserAction }>;
export type RootEffect = ApiEffect<RootApiOperation, RootAction, RootAction>;
```

Use generated API types in a real app. This small handwritten schema makes the
example checkable; schema-derived types do not validate response shapes at runtime.
The POST returns a DTO with `user_id`/`full_name`; its operation mapper produces
`User` before `onSuccess` receives it. GET `/staff` maps a different response
shape (an array). Keep DTOs/mappers/operations in the application's existing data
or API layer; the app paths here illustrate existing prerequisites, not a required
feature layout. Data definitions import domain types only; do not import reducers
or actions into an operation. Cross-file imports between these app contract
modules are type-only. The feature reducer imports its existing operation as a runtime value; unit tests
import the existing state factories as runtime values.

The existing app-level handler uses the public library implementation:

```ts
// src/app/effector.ts
import {
  createApiClient, createApiEffector, effecting, guard,
  type ApiClientOptions, type AppError,
} from '@gost-kit/common';
import type { Paths, RootApiOperation } from './api.js';
import type { RootAction, RootEffect } from './contracts.js';

// This example backend returns { errors: [{ code, message, path }] }.
const mapErrors = (body: unknown): AppError[] => {
  if (!guard.record(body) || !guard.array(body.errors)) return [];
  return body.errors.filter((error): error is AppError =>
    guard.record(error) && guard.string(error.code) && guard.string(error.message)
    && guard.array(error.path) && error.path.every(guard.string));
};

export const createRootEffector = (options: ApiClientOptions) => {
  const api = createApiClient<Paths>({
    ...options,
    mapErrors: options.mapErrors ?? mapErrors,
  });
  const apiHandlers = createApiEffector<Paths, RootAction, RootApiOperation>(api);
  return effecting<RootAction, RootEffect, readonly [typeof apiHandlers]>(apiHandlers);
};
```

Use the application's actual base URL and keep its existing client configuration,
backend error mapper and other global handlers. The mapper above validates only
the illustrated error envelope; adapt it to the backend contract. Without a
configured mapper, the library reports HTTP failures with an empty errors array.
For tests, pass a fake `fetch` in `options` when constructing the effector, before
any dispatch. Replacing `globalThis.fetch` after client construction does not
replace that client's captured transport. `https://api.example.invalid` is an
illustrative URL, not a service to call. No request, response mapper or callback
runs when `createApiEffect` constructs the effect description. The callbacks are
`onSuccess(data)` and `onError(errors, failure)`; both return result actions.
The first error argument is `AppError[]`, and the second is `ApiFailure` with
kind `http`, `network`, `contract` or `aborted`. Nonempty backend errors are
passed through after `mapErrors` adapts the backend response; an empty error
array becomes `[defaultError]`.
The handler awaits dispatch of the returned action. Omitting `onSuccess` skips
success dispatch; omitting `onError` reports the failure through the existing
store error reporter. Callback/dispatch exceptions are execution failures,
not API business errors. A mapper throw/rejection becomes a `contract` failure with empty library errors,
so the callback receives `[defaultError]`; request failures skip the mapper.
These differ from callback/dispatch exceptions, which propagate to the existing
store reporter. An async mapper is awaited; even an absent success callback does
not skip mapping. A direct `api.request` still returns the raw DTO.

## Feature example

Illustrative location: `src/features/user/fc/`. The already existing application
contracts are at `src/app/contracts.ts`, and its ready-made root-state factory
`rootState` is at `src/app/state.ts`. Adjust names/paths to the project; use its
existing state factories with overrides rather than hand-building root state.

### state.ts

```ts
import { define } from '@gost-kit/common';
import type { ApiError, User } from '../../../app/contracts.js';

export type UserState = {
  email: string;
  status: 'idle' | 'loading' | 'ready' | 'error';
  data?: User;
  errors: ApiError[];
};
export const createUserState = define.state<UserState>((options = {}) => ({
  email: '', status: 'idle', errors: [], ...options,
}));
```

### action.ts

```ts
import type { ApiError, User } from '../../../app/contracts.js';

export type UserAction =
  | { type: 'LoadAction' }
  | { type: 'SuccessReceiveAction'; response: User }
  | { type: 'ErrorReceiveAction'; errors: ApiError[] };
```

### reducer.ts

```ts
import { createApiEffect, define } from '@gost-kit/common';
import { loadUser } from '../../../app/api.js';
import type { RootEffect, RootState } from '../../../app/contracts.js';
import type { UserAction } from './action.js';
import type { UserState } from './state.js';

export const userReducer = define.reducer<UserState, UserAction, RootEffect, RootState>()({
  LoadAction: ({ state }) => ({
    state: { ...state, status: 'loading', errors: [] },
    effects: createApiEffect(loadUser, {
      body: { email: state.email },
      defaultError: { code: 'USER_LOAD_FAILED', message: 'Could not load user', path: [] },
      onSuccess: (response) => ({ scope: 'users', type: 'SuccessReceiveAction', response }),
      onError: (errors) => ({ scope: 'users', type: 'ErrorReceiveAction', errors }),
    }),
  }),
  SuccessReceiveAction: ({ state, action }) => ({
    state: { ...state, status: 'ready', data: action.response, errors: [] },
  }),
  ErrorReceiveAction: ({ state, action }) => ({
    state: { ...state, status: 'error', errors: action.errors },
  }),
});
```

### reducer.test.ts

```ts
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { reducing, scope } from '@gost-kit/common';
import type { RootAction, RootEffect, RootState } from '../../../app/contracts.js';
import { rootState } from '../../../app/state.js';
import { userReducer } from './reducer.js';
import { createUserState } from './state.js';

const reducer = reducing<RootState, RootAction, RootEffect>({ users: scope('user', userReducer) });

describe('userReducer', () => {
  describe('LoadAction', () => {
    const before = rootState({ user: createUserState({ email: 'user@example.invalid' }) });
    const { state, effects } = reducer(before, { scope: 'users', type: 'LoadAction' });

    test('sets loading status', () => {
      assert.equal(state.user.status, 'loading');
    });
    test('returns the existing API effect with request parameters', () => {
      assert.equal(effects.length, 1);
      const [effect] = effects;
      assert.ok(effect.type === 'ApiEffect');
      assert.equal(effect.method, 'post');
      assert.equal(effect.url, '/user');
      assert.deepEqual(effect.body, { email: 'user@example.invalid' });
      assert.deepEqual(effect.defaultError, {
        code: 'USER_LOAD_FAILED', message: 'Could not load user', path: [],
      });
    });
    test('callbacks describe result actions without executing the request', () => {
      const [effect] = effects;
      assert.ok(effect.type === 'ApiEffect' && effect.method === 'post' && effect.url === '/user');
      assert.ok(effect.onSuccess && effect.onError);
      const response = { id: 'one', name: 'Ada' };
      const errors = [{ code: 'OFFLINE', message: 'offline', path: [] }];
      assert.deepEqual(effect.onSuccess(response), {
        scope: 'users', type: 'SuccessReceiveAction', response,
      });
      assert.deepEqual(effect.onError(errors, { kind: 'network', errors: [] }), {
        scope: 'users', type: 'ErrorReceiveAction', errors,
      });
    });
    test('preserves the input and neighbouring state', () => {
      assert.equal(before.user.status, 'idle');
      assert.equal(state.user.email, before.user.email);
      assert.equal(state.preferences, before.preferences);
    });
  });

  describe('SuccessReceiveAction', () => {
    const response = { id: 'one', name: 'Ada' };
    const { state, effects } = reducer(
      rootState({ user: createUserState({ status: 'loading' }) }),
      { scope: 'users', type: 'SuccessReceiveAction', response },
    );
    test('sets ready status', () => {
      assert.equal(state.user.status, 'ready');
    });
    test('stores the response', () => {
      assert.deepEqual(state.user.data, response);
    });
    test('clears errors and returns no effects', () => {
      assert.deepEqual(state.user.errors, []);
      assert.deepEqual(effects, []);
    });
  });

  describe('ErrorReceiveAction', () => {
    const cases = [
      { code: 'OFFLINE', message: 'offline', path: [] },
      { code: 'INVALID_EMAIL', message: 'invalid email', path: ['email'] },
    ];
    for (const error of cases) {
      describe(error.code, () => {
        const errors = [error];
        const { state, effects } = reducer(
          rootState({ user: createUserState({ status: 'loading' }) }),
          { scope: 'users', type: 'ErrorReceiveAction', errors },
        );
        test('sets error status', () => {
          assert.equal(state.user.status, 'error');
        });
        test('stores API errors unchanged', () => {
          assert.deepEqual(state.user.errors, errors);
        });
        test('returns no effects for this transition', () => {
          assert.deepEqual(effects, []);
        });
      });
    }
  });
});
```

Each scenario independently calls the pure reducer with a factory-built input
and an action, then checks returned state/effect descriptions. Result actions
are supplied directly, without chaining a request and its response. There is no
store, dispatcher, request or effect execution in these unit tests. Use the
project's test runner (`describe.each` when available); the loop above uses the
built-in Node runner. Check actual request/callback/dispatch flow separately at
the application integration boundary.

Before calling an API callback in a test, narrow its effect by `method` and
`url`, as above. `type === 'ApiEffect'` alone does not select one response type
when root operations contain several response types; their callback signatures
form a union. Pass one concrete operation to `createApiEffect`; narrow a union
before construction rather than hiding its route/parameter correlation with a cast.

## FC contracts that matter

`define.reducer<State, LocalAction, RootEffect, RootState>()(handlers)` creates
a checked table. Handlers receive `{ state, action }` and root state as their
second argument. Their draft may omit `state` or `effects`. A supplied state
replaces that level completely, not a partial patch; omitted state preserves
it. `reducing` normalizes a single effect or array into `{ state, effects: [] }`.

`ScopedActions` adds routing scope to local actions. Local declarations have no
`scope`. Action types end in `Action`, effect types in `Effect`. Namespace
`users` and state property `user` are independent. `define.state` accepts a value
or initializer; a value is shallow-copied, while the factory above creates a
fresh errors array per state. Do not hide compatibility errors with `any`/casts.

`createDispatch` commits state before executing effects and awaits its effects
and nested dispatches that handlers await. Execution failures are reported via
`onError`; a resolved promise does not establish business success. Check result
actions/state. No automatic cancellation, ordering protection or rollback is
implied. Response validation/error normalization belongs to the existing
application boundary, outside feature reducers and this skill's API definition.
