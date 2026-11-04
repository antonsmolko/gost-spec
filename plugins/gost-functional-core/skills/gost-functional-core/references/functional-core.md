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
      assert.equal(effect.url, '/user');
      assert.deepEqual(effect.body, { email: 'user@example.invalid' });
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
built-in Node runner. Check actual request/receiver/dispatch flow separately at
the application integration boundary.

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
