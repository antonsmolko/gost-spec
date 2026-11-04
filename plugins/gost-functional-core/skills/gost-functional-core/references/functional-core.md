# Public API recipe

The public FC API was checked with a real `@gost-kit/common@0.1.0` tarball from
[gost-kit fbf8a518](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/packages/common/src/fc).
This does not establish registry availability. Inspect the project's installed
exports/types before adapting code. The maintained
[functional-core example](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/examples/functional-core)
keeps feature state/actions/reducers separate from the application effector.

## Ownership and prerequisites

A feature's FC consists of `state.ts`, `action.ts`, `reducer.ts` and
`reducer.test.ts`. Keep the surrounding project layout. Import the application's
existing root contracts; do not add feature effect types or a feature effector.
`AppEffector`/`RootEffector` owns the shared handlers. For example, a reducer
returns an existing `ApiEffect` whose receivers produce result actions; the
application handler performs the request and dispatches those returned actions.

The example assumes an existing app contract exposing `RootState`, `RootAction`,
`RootEffect`, `ApiError` and the response entity `User`. Its existing API effect
accepts the request fields used below and success/error receivers. Existing
`ApiError` has `code: string`, `message: string`, `path: string[]`.
These are application prerequisites, not exports added to common by this skill.
The actual `ApiEffect` API, transport and execution are a separate gost-kit/app
concern. This recipe neither defines nor implements them. If the target contract
differs, inspect it and adapt the feature; if unavailable, report incomplete
integration instead of creating `FetchUserEffect` or a transport handler.

## Feature example

Illustrative location: `src/features/user/fc/`. The already existing application
contracts are at `src/app/contracts.ts`; adjust import paths to the project.

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
export const createUserState = define.state<UserState>(() => ({
  email: '', status: 'idle', errors: [],
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
import { define } from '@gost-kit/common';
import type { RootEffect, RootState } from '../../../app/contracts.js';
import type { UserAction } from './action.js';
import type { UserState } from './state.js';

export const userReducer = define.reducer<UserState, UserAction, RootEffect, RootState>()({
  LoadAction: ({ state }) => ({
    state: { ...state, status: 'loading', errors: [] },
    effects: {
      type: 'ApiEffect',
      url: '/user',
      body: { email: state.email },
      defaultError: { code: 'USER_LOAD_FAILED', message: 'Could not load user', path: [] },
      receiverSuccess: (response) => ({ scope: 'users', type: 'SuccessReceiveAction', response }),
      receiverError: (errors) => ({ scope: 'users', type: 'ErrorReceiveAction', errors }),
    },
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
import { test } from 'node:test';
import { reducing, scope } from '@gost-kit/common';
import type { RootAction, RootEffect, RootState } from '../../../app/contracts.js';
import { userReducer } from './reducer.js';
import { createUserState } from './state.js';

test('user transitions use the existing API effect and pure receivers', () => {
  const reducer = reducing<RootState, RootAction, RootEffect>({ users: scope('user', userReducer) });
  const before: RootState = {
    user: createUserState(), preferences: { theme: 'dark' },
  };
  Object.freeze(before.user.errors);
  Object.freeze(before.user);
  Object.freeze(before.preferences);
  Object.freeze(before);
  const pending = reducer(before, { scope: 'users', type: 'LoadAction' });
  assert.equal(pending.state.user.status, 'loading');
  assert.equal(pending.state.user.email, before.user.email);
  assert.equal(pending.state.preferences, before.preferences);
  assert.equal(before.user.status, 'idle');
  assert.equal(pending.effects.length, 1);
  const effect = pending.effects[0];
  assert.ok(effect.type === 'ApiEffect');

  const response = { id: 'one', name: 'Ada' };
  const success = effect.receiverSuccess(response);
  assert.deepEqual(success, { scope: 'users', type: 'SuccessReceiveAction', response });
  const ready = reducer(pending.state, success);
  assert.equal(ready.state.user.status, 'ready');
  assert.deepEqual(ready.state.user.data, response);
  assert.deepEqual(ready.state.user.errors, []);

  const errors = [{ code: 'OFFLINE', message: 'offline', path: ['email'] }];
  const failure = effect.receiverError(errors);
  assert.deepEqual(failure, { scope: 'users', type: 'ErrorReceiveAction', errors });
  const failed = reducer(pending.state, failure);
  assert.equal(failed.state.user.status, 'error');
  assert.deepEqual(failed.state.user.errors, errors);
  assert.equal(failed.state.preferences, before.preferences);
});
```

The test invokes the receivers and resulting transitions directly. It performs
no request and implements no effector. The application already composes the
`users` namespace with `scope('user', userReducer)` and its shared effector.
Check actual request/result flow through that existing composition separately.

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
