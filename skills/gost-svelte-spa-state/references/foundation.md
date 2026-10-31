# Public API recipe

## Verified compatibility

This recipe was checked against gost-kit development commit
`7eca0ea447843e1ae97d4e63b0ca3c273a430d1e`: `@gost-kit/common@0.0.0` and
`@gost-kit/svelte@0.0.0`, installed as real tarballs. The Svelte peer is
`^5.57.2`; evaluation used Svelte `5.57.2`, TypeScript `5.9.3` and Vite `8.3.5`
with `@sveltejs/vite-plugin-svelte@7.3.1`. These development version numbers alone
do not identify an available registry release or a unique artifact. Check actual
package metadata, exported declarations and installation source for the target
project. [gost-kit source](https://github.com/antonsmolko/gost-kit) is a discovery
link; this recipe does not promise that the commit or version is published.

Use ordinary package-manager installation of verified artifacts. Supply both
common and shell tarballs together when testing a development build: shell has
a common dependency and a Svelte peer. Avoid source-path imports or workspace
links as evidence of external consumption. Stop dependent steps if installation
or compatibility checks fail; report which input or check is missing.

## Empty application composition

The module paths below illustrate roles, not a mandatory directory tree. All
imports from gost-kit use package roots.

```ts
// app/state/core.ts — ordinary TypeScript, no Svelte imports
import { effecting, reducing, type Effector, type Reducer } from '@gost-kit/common';

export type AppState = Record<string, never>;
export type AppAction = never;
export type AppEffect = never;

export const initialState = (): AppState => ({});
export const reducer: Reducer<AppState, AppAction, AppEffect> = reducing({});
export const effector: Effector<AppAction, AppEffect> = effecting();
```

```ts
// app/state/application.ts — application composition point
import { createStore } from '@gost-kit/svelte';
import { initialState, reducer, effector, type AppState, type AppAction, type AppEffect } from './core';

export const createApplication = () => createStore<AppState, AppAction, AppEffect>({
  initState: initialState(),
  reducer,
  effector,
});
```

Choose the project's access convention. For example, with Svelte context:

```ts
// app/state/context.ts
import { createContext } from 'svelte';
import type { createApplication } from './application';

export const [useApplication, provideApplication] =
  createContext<ReturnType<typeof createApplication>>();
```

During the existing root component's initialization, call
`provideApplication(createApplication())` once. Descendants call
`const app = useApplication()` during initialization and read
`app.state` in their reactive UI. This empty root has nothing to render yet;
existing features are not moved into it. A SPA module accessor is also valid
when consistent with the consumer; do not add a second provider alongside an
existing shared store. This recipe covers client SPAs, not SSR lifecycle design.

The shell stores raw immutable snapshots and replaces complete state. Reading
`const { state } = app` once loses the live getter. Select a feature with
`$derived(app.state.feature)` and then derive its presentation separately.
Shell compilation uses normal Svelte tooling; importing its runes in an
uncompiled Node process is not a valid client smoke test.

## Extending the composition

State contains the combined application snapshot. Global UI modules and feature
modules may be separate parts of that state; names such as root/app/main do not
imply one monolithic business reducer. Use public helpers when adding a module:

| Role | API and boundary |
| --- | --- |
| State initializer | Plain fresh factory or `define.state`; avoid shared mutable nested defaults |
| Feature transitions | `define.reducer<State, Action, Effect, RootState>()({...})` |
| Attach a state property | `scope('property', handlers)` adapts complete feature state to the root |
| Route actions | `reducing({ namespace: handlers })`; routing scope and state property name are independent |
| Root action union | `ScopedActions<{ namespace: LocalAction }>`; local action types do not declare routing `scope` |
| Effect execution | `define.effector` handler tables composed with `effecting(...)`; one owner per declared effect type |

Each action/effect type ends in `Action`/`Effect` as required by the library's
`Trigger` contract. Reducers return a full state when changing it, not a patch.
They can return effect descriptions without changing state. The application
effector receives the effect and dispatches ordinary result actions. Composition
uses statically known handler maps/tables with coverage checks; inspect the
selected version's declarations when extending them.

## Disposable browser probe

Copy the integrated project to a temporary evaluation directory. In that copy,
add a synthetic root state such as `{ count: 0, completed: false }`,
`IncrementAction`, `RunProbeAction`, `ProbeCompletedAction` and `ProbeEffect`.
Connect them through the existing root reducer and effector composition.
Increment returns a fresh state; RunProbe emits ProbeEffect; its handler awaits
dispatch of ProbeCompletedAction, which changes completed to true.

Render count and completed in a temporary probe component using the same shared
application access as ordinary descendants. Drive buttons in Chromium, checking
the count update and the completed result. Also verify two descendants receive
the same store and the original consumer behavior still works. Run the consumer's
type/Svelte checks and build with the probe. Keep the final consumer integration
free of this synthetic state/UI, with its checks rerun after verification.

Dispatch commits state synchronously before starting effects and returns a
`Promise<void>` that awaits effects and their awaited nested dispatches. Execution
failures are reported through the configured synchronous `onError` callback
(default reporting is provided by the library); a resolved dispatch promise is
not proof of business success. Assert the resulting state/UI rather than only
awaiting dispatch. Do not add error swallows, cancellation or ordering guarantees
that the selected library does not provide.

Only this state foundation is mandatory for the initial connection. Additional
shared modules and updates to an already connected app require explicit scope
and compatible versions; this recipe does not install speculative future APIs.
