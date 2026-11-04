# Public API recipe

Verified against a real `@gost-kit/common@0.1.0` tarball built from public
[gost-kit fbf8a518](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/packages/common/src/fc).
This development evidence does not establish registry availability. Inspect the
consumer's actual exports/types before adapting this recipe. The maintained
[functional-core example](https://github.com/antonsmolko/gost-kit/tree/fbf8a5182a87fd279ce541edff098d5ec3135e6d/examples/functional-core)
is an additional public source; its project layout is not required.

## Contracts that affect feature code

`define.reducer<State, LocalAction, RootEffect, RootState>()(handlers)` creates
a checked handler table. Handlers receive `{ state, action }` and root state as
their second argument. They return a draft with optional `state` and `effects`.
A supplied state replaces that level completely; it is not a partial patch.
An omitted state preserves it. Effects may be one description or an array.
`reducing` normalizes the draft into `{ state, effects: [] }`.

Action types end in `Action`, effect types in `Effect`. `ScopedActions` adds
routing scope to local declarations; do not declare `scope` on those local
types. `reducing` selects the action namespace (default `root`), while
`scope('user', table)` adapts the table to a state property. These names are
independent, as `people`/`user` below demonstrate.

`define.state` accepts an initial value or initializer. A value initializer
only makes a shallow copy; use a factory when fresh nested mutable data matters.
The example uses a factory directly. `effecting` composes static typed handler
tables with unique owners and full effect coverage. Its third generic is the
tuple of those actual tables; do not hide coverage errors with `any` or casts.

## Small complete example

Adapt these contracts to the existing root; the `connectExample` boundary is
only an executable demonstration, not an instruction to replace an app's store.
An existing global alert/modal effect belongs in that app's existing handler.

```ts
import { createDispatch, define, effecting, reducing, scope, type ScopedActions } from '@gost-kit/common';

type UserState = { status: 'idle' | 'loading' | 'ready' | 'error'; name: string; error?: string };
type UserAction =
  | { type: 'LoadUserAction'; id: string }
  | { type: 'UserLoadedAction'; name: string }
  | { type: 'UserFailedAction'; message: string };
type Effect = { type: 'FetchUserEffect'; id: string };
type State = { user: UserState; preferences: { theme: string } };
type Action = ScopedActions<{ people: UserAction }>;

const userHandlers = define.reducer<UserState, UserAction, Effect, State>()({
  LoadUserAction: ({ state, action }) => ({
    state: { status: 'loading', name: state.name },
    effects: { type: 'FetchUserEffect', id: action.id },
  }),
  UserLoadedAction: ({ action }) => ({ state: { status: 'ready', name: action.name } }),
  UserFailedAction: ({ state, action }) => ({
    state: { status: 'error', name: state.name, error: action.message },
  }),
});
export const reducer = reducing<State, Action, Effect>({ people: scope('user', userHandlers) });

export const connectExample = (loadName: (id: string) => Promise<string>) => {
  let state: State = { user: { status: 'idle', name: '' }, preferences: { theme: 'dark' } };
  const errors: unknown[] = [];
  const userEffects = define.effector<Action, Effect>({
    FetchUserEffect: async ({ effect, dispatch }) => {
      let name: string;
      try { name = await loadName(effect.id); }
      catch (error) {
        await dispatch({ scope: 'people', type: 'UserFailedAction', message: String(error) });
        return;
      }
      await dispatch({ scope: 'people', type: 'UserLoadedAction', name });
    },
  });
  const effector = effecting<Action, Effect, [typeof userEffects]>(userEffects);
  const dispatch = createDispatch({
    readState: () => state,
    writeState: (next: State) => { state = next; },
    reducer, effector,
    onError: (error) => { errors.push(error); },
  });
  return { dispatch, readState: () => state, errors };
};
```

Validate untrusted external responses at the imperative boundary using the
project's actual contract. TypeScript types alone do not validate API payloads.
This example's typed `loadName` dependency represents an already validated input.

## Dispatch and verification

`createDispatch` reads state, reduces and commits synchronously before starting
effects. Effects run through `Promise.allSettled`; dispatch waits for its own
effects, including nested dispatches that their handlers await. It catches and
reports execution failures through `onError`; a resolved promise is not a
business-success result. Assert the resulting domain state/actions. There is
no implied cancellation, stale-response ordering or transactional rollback.

Freeze input state when checking reducer purity; assert the complete feature
state, effect descriptions and untouched root properties. Exercise successful
and failed I/O through the real dispatcher and verify result actions. Keep
unavailable artifact/composition checks separate from runnable feature proof.
