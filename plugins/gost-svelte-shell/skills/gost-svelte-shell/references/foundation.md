# Public API recipe

## Verified published baseline

Checked with registry-installed `@gost-kit/common@0.3.0` and
`@gost-kit/svelte@0.2.0`, using their public package roots. Both packages declare
Node `^26.0.0`; the shell depends on common `^0.3.0` and peers on Svelte `^5.57.2`.
The checked consumer used Node `26.11.1`, Svelte `5.57.2`, TypeScript `5.9.3`,
Vite `8.3.5` and `@sveltejs/vite-plugin-svelte@7.3.1`.

```sh
npm install --save-exact @gost-kit/common@0.3.0 @gost-kit/svelte@0.2.0
```

Use the consumer's package manager. Confirm installed versions, public exports,
engines and peer range before changing integration. An incompatible Node/Svelte
version or unavailable artifact makes dependent integration incomplete; report
the mismatch instead of silently upgrading the environment. Supplied development
tarballs remain valid inputs when their actual metadata and compatibility are
checked; development version numbers alone do not identify published releases.

[Published common](https://www.npmjs.com/package/@gost-kit/common/v/0.3.0) and
[published shell](https://www.npmjs.com/package/@gost-kit/svelte/v/0.2.0) identify
the baseline. Other versions require their own verification. Do not use
workspace/source imports as evidence of external consumption.

## Empty application composition

Keep root contracts, composition, store construction and context in `src/store`.
The application bootstrap owns provider installation. Reuse the existing root
component: its file may already be `src/App.svelte` rather than `src/app/`.
The paths below illustrate roles; preserve an existing compatible connection.

```ts
// src/store/core.ts
import { effecting, reducing, type Effector, type Reducer } from '@gost-kit/common';

export type RootState = Record<string, never>;
export type RootAction = never;
export type RootEffect = never;

export const rootState = (): RootState => ({});
export const rootReducer: Reducer<RootState, RootAction, RootEffect> = reducing({});
export const rootEffector: Effector<RootAction, RootEffect> = effecting();
```

```ts
// src/store/create-store.ts
import { createStore } from '@gost-kit/svelte';
import type { StoreError } from '@gost-kit/common';
import type { RootAction, RootEffect } from './core';
import { rootState, rootReducer, rootEffector } from './core';

// Synchronous infrastructure reporting; connect the application's logger here.
export const reportStoreError = (failure: StoreError<RootAction, RootEffect>): void => {
  if (failure.kind === 'reset') {
    console.error('Store reset failed', failure.error);
  } else {
    console.error('Store dispatch failed', failure.kind, failure.action, failure.error);
  }
};

export const createApplicationStore = () => createStore({
  initState: rootState,
  reducer: rootReducer,
  effector: rootEffector,
  onError: reportStoreError,
});
```

## Typed public access

The context module imports root contracts as types. It does not import the store
factory or feature UI at runtime. Its module-level context key is shared; each
application root provides its own store value.

```ts
// src/store/context.ts
import { createContext } from 'svelte';
import type { Store } from '@gost-kit/common';
import type { RootState, RootAction } from './core';

export const [useStore, provideStore] = createContext<Store<RootState, RootAction>>();
```

```ts
// src/store/index.ts
export { useStore } from './context';
```

Bootstrap imports the factory and provider directly and calls them once during
root component initialization, before descendants initialize. For example, this
existing synthetic root retains its greeting:

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import Greeting from './legacy/Greeting.svelte';
  import { createApplicationStore } from './store/create-store';
  import { provideStore } from './store/context';

  provideStore(createApplicationStore());
</script>

<main>
  <h1>Existing SPA</h1>
  <Greeting />
</main>
```

A business component imports the public accessor and calls it during component
initialization:

```ts
import { useStore } from '../../../store';
const store = useStore();
```

It reads the full typed `store.state` and uses the same `store.dispatch`; there
is no separate store per feature. The empty example has `never` actions/effects.
[The disposable probe](#disposable-context-probe) demonstrates two slices and dispatch.
Without a provider, the context getter reports Svelte's missing-context error;
do not construct a fallback store in the accessor.

## Module boundaries and reactivity

Business components can import the store accessor; the bootstrap and root
composition remain private to their owners. The accessor entrypoint exports
neither the factory, reducers nor feature UI. Root composition imports only
business core entrypoints. Inspect actual imports, including aliases, to avoid
runtime cycles. Keep root contracts in store rather than moving the assembled
feature graph into shared. Shared UI receives ready props and callbacks.

This is an explicit adaptation for projects choosing a common root store;
[standard FSD import direction](https://feature-sliced.design/docs/reference/layers)
does not grant it automatically. Respect the consumer's architecture decisions;
record the exception when that profile applies. Other compatible project layouts
and access conventions remain valid.

The shell keeps immutable snapshots behind a reactive getter and replaces state.
Keep the store object: `const { state } = store` captures one snapshot. Select a
slice through `$derived(store.state.feature)` and derive presentation separately.
Use normal Svelte compilation; importing rune code in uncompiled Node is not a
client smoke test. Context access happens during component initialization, not
inside arbitrary effect handlers or router callbacks. Pass store explicitly to
such infrastructure. This recipe covers client SPAs, not SSR lifecycle design.

## Factories, explicit reset and errors

Pass the zero-argument synchronous factory itself as `initState`, not its result.
Every call must allocate fresh nested defaults; compose scope factories rather
than reusing an object containing mutable arrays or objects. `define.state`
with a factory can help; its object form shares nested defaults. Caller-supplied
overrides are shallow replacements used by reference, not deep clones.

`store.reset()` replaces the complete root with fresh defaults. For a fixed
object root, `store.reset({ excluded: ['auth'] })` preserves the current `auth`
reference and resets other scopes. Exclusions are readonly root keys, independent
of action routing namespaces. An absent or empty list performs a full reset.
Primitive, array, function and union roots support full reset only in the public
types; a union inside an individual scope is permitted. Do not erase those
restrictions with assertions or widening. Runtime cannot detect TypeScript unions.

The root factory runs once per reset, including for excluded scopes, before one
state publication. An exclusion preserves a key only when it is an own property
of both the current and initial roots. Missing, inherited or deleted optional
scopes take their presence/value from the fresh root. The store and dispatch
identities stay the same. Both descendants must observe the replacement through
the same store; keep reactive access rather than destructuring a snapshot.

Configure the shared synchronous `onError` reporter at store creation. Its
`StoreError` discriminant `kind: 'reset'` has no action; dispatch failures carry
an action and kinds such as `reducer` or `effect`. This infrastructure reporter
is different from an API effect's `onError` callback, which maps an API failure
to an ordinary action. Do not make the reporter an asynchronous recovery flow.

If the factory throws during initial creation, creation throws and returns no
store. During reset, factory/validation failures are reported as reset failures
and leave the current state unchanged. Reset returns void and reports failures
instead of throwing outward. Without a custom reporter the library logs them.
The store captures its factory/reporter at creation; editing the original config
does not replace them.

Reset is an explicit application operation, separate from routing. It does not
cancel pending effects or suppress late result actions, and promises no flicker
or navigation ordering guarantees. Call reset from an explicitly chosen handler;
do not add automatic reset on navigation or store exclusion configuration in the
shell. The exclusion list belongs to each reset call.

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

## Disposable browser verification

Use [the complete two-slice probe](#disposable-context-probe) in an isolated copy of the
connected consumer. Verify shared state, effect result actions, two independent
roots, missing provider and existing behavior. Keep its demonstration modules
out of the final application connection. Repeat the skill against the empty
connection to check reuse without a second store/provider. Missing artifact
checks must report incomplete integration, rather than substituting a store.

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

## Disposable context probe

Use this only in a temporary copy after connecting the empty foundation from
[the API recipe](#empty-application-composition). Replace its `src/store/core.ts` with the probe
below; keep the verified factory/context/accessor modules. Run the consumer's
checks/build and Chromium tests. Retain `reuseExistingServer: false` so an old
Vite server cannot supply evidence for a new copy.

The two slices are synthetic and unrelated to production business features.
The root owns composition; this single file is a probe, not the feature layout.

```ts
// src/store/core.ts
import {
  define, effecting, reducing, scope,
  type Effector, type Reducer, type ScopedActions,
} from '@gost-kit/common';

type CounterState = { value: number };
type CompletionState = { completed: boolean };
type CounterAction = { type: 'IncrementAction' } | { type: 'FailAction' };
type CompletionAction = { type: 'RunProbeAction' } | { type: 'ProbeCompletedAction' };
export type RootState = { counter: CounterState; completion: CompletionState };
export type RootAction = ScopedActions<{ counter: CounterAction; completion: CompletionAction }>;
export type RootEffect = { type: 'ProbeEffect' };

export const rootState = (): RootState => ({
  counter: { value: 0 }, completion: { completed: false },
});
const counter = define.reducer<CounterState, CounterAction, RootEffect, RootState>()({
  IncrementAction: ({ state }) => ({ state: { value: state.value + 1 } }),
  FailAction: () => { throw new Error('probe reducer failure'); },
});
const completion = define.reducer<CompletionState, CompletionAction, RootEffect, RootState>()({
  RunProbeAction: () => ({ effects: { type: 'ProbeEffect' } }),
  ProbeCompletedAction: () => ({ state: { completed: true } }),
});
export const rootReducer: Reducer<RootState, RootAction, RootEffect> = reducing({
  counter: scope('counter', counter),
  completion: scope('completion', completion),
});
const handlers = define.effector<RootAction, RootEffect>({
  ProbeEffect: async ({ dispatch }) => {
    await dispatch({ scope: 'completion', type: 'ProbeCompletedAction' });
  },
});
export const rootEffector: Effector<RootAction, RootEffect> = effecting(handlers);
```

The consumer reads both slices through the public accessor:

```svelte
<!-- src/features/probe/ui/Consumer.svelte -->
<script lang="ts">
  import { useStore } from '../../../store';
  const store = useStore();
  const count = $derived(store.state.counter.value);
  const completed = $derived(store.state.completion.completed);
</script>

<span data-testid="count">{count}</span>
<span data-testid="completed">{String(completed)}</span>
<button onclick={() => store.dispatch({ scope: 'counter', type: 'IncrementAction' })}>Increment</button>
<button onclick={() => store.dispatch({ scope: 'completion', type: 'RunProbeAction' })}>Run effect</button>
<button onclick={() => store.reset()}>Reset all</button>
<button onclick={() => store.reset({ excluded: ['counter'] })}>Keep counter</button>
<button onclick={() => store.dispatch({ scope: 'counter', type: 'FailAction' })}>Fail dispatch</button>
```

Each probe root provides once and renders two consumers. The following
instrumented construction replaces the ordinary factory only in this disposable
harness, to observe factory calls, fresh references and reporter behavior. The
empty connection continues to use the factory module above.

```svelte
<!-- src/app/ProbeRoot.svelte -->
<script lang="ts">
  import { createStore } from '@gost-kit/svelte';
  import type { StoreError } from '@gost-kit/common';
  import { rootState, rootReducer, rootEffector, type RootAction, type RootEffect } from '../store/core';
  import { provideStore } from '../store/context';
  import Consumer from '../features/probe/ui/Consumer.svelte';
  let { id }: { id: string } = $props();
  let calls = $state(0);
  let lastFailure = $state('none');
  let invariant = $state('unchecked');
  let failFactory = false;
  const factory = () => {
    calls += 1;
    if (failFactory) throw new Error('probe factory failure');
    return rootState();
  };
  const report = (failure: StoreError<RootAction, RootEffect>): void => {
    lastFailure = failure.kind;
  };
  const store = createStore({
    initState: factory, reducer: rootReducer, effector: rootEffector, onError: report,
  });
  const originalStore = store;
  const dispatch = store.dispatch;
  provideStore(store);

  function verifyReset(excluded: boolean) {
    const before = store.state;
    const beforeCalls = calls;
    store.reset(excluded ? { excluded: ['counter'] } : undefined);
    invariant = String(store === originalStore && store.dispatch === dispatch
      && calls === beforeCalls + 1 && store.state !== before
      && store.state.completion !== before.completion
      && (excluded ? store.state.counter === before.counter : store.state.counter !== before.counter));
  }
  function failedReset() {
    const before = store.state;
    failFactory = true;
    store.reset();
    failFactory = false;
    invariant = String(store.state === before && lastFailure === 'reset');
  }
  function failedCreation() {
    try {
      createStore({ initState: () => { throw new Error('initial failure'); }, reducer: rootReducer, effector: rootEffector });
      invariant = 'false';
    } catch (error) {
      invariant = String(error instanceof Error && error.message === 'initial failure');
    }
  }
</script>

<section data-testid={id}>
  <Consumer />
  <Consumer />
  <span data-testid="calls">{calls}</span>
  <span data-testid="failure">{lastFailure}</span>
  <span data-testid="invariant">{invariant}</span>
  <button onclick={() => verifyReset(false)}>Verify full reset</button>
  <button onclick={() => verifyReset(true)}>Verify partial reset</button>
  <button onclick={failedReset}>Fail reset</button>
  <button onclick={failedCreation}>Fail creation</button>
</section>
```

Mount two roots to test isolation. The missing-provider case intentionally
renders a consumer outside either root. This synthetic harness uses the browser
query string rather than adding a router to the consumer:

```svelte
<!-- src/App.svelte -->
<script lang="ts">
  import Greeting from './legacy/Greeting.svelte';
  import ProbeRoot from './app/ProbeRoot.svelte';
  import Consumer from './features/probe/ui/Consumer.svelte';
  const missing = new URLSearchParams(window.location.search).has('missing');
</script>

<main>
  <h1>Existing SPA</h1>
  <Greeting />
  {#if missing}
    <Consumer />
  {:else}
    <ProbeRoot id="root-a" />
    <ProbeRoot id="root-b" />
  {/if}
</main>
```

With Playwright and the existing fixture server configuration:

```ts
// checks/foundation.pw.ts
import { test, expect } from '@playwright/test';

test('two descendants share state and dispatch within one provider', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('root-a');
  await expect(root.getByTestId('count')).toHaveText(['0', '0']);
  await root.getByRole('button', { name: 'Increment' }).first().click();
  await expect(root.getByTestId('count')).toHaveText(['1', '1']);
});

test('application roots have independent stores', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('root-a').getByRole('button', { name: 'Increment' }).first().click();
  await expect(page.getByTestId('root-b').getByTestId('count')).toHaveText(['0', '0']);
});

test('effect dispatch updates both consumers of the same store', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('root-a');
  await root.getByRole('button', { name: 'Run effect' }).first().click();
  await expect(root.getByTestId('completed')).toHaveText(['true', 'true']);
  await expect(page.getByTestId('root-b').getByTestId('completed')).toHaveText(['false', 'false']);
});

test('full and excluded resets replace the root reactively and retain store identities', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('root-a');
  await root.getByRole('button', { name: 'Increment', exact: true }).first().click();
  await root.getByRole('button', { name: 'Run effect', exact: true }).first().click();
  await root.getByRole('button', { name: 'Verify partial reset', exact: true }).click();
  await expect(root.getByTestId('count')).toHaveText(['1', '1']);
  await expect(root.getByTestId('completed')).toHaveText(['false', 'false']);
  await expect(root.getByTestId('invariant')).toHaveText('true');
  await expect(root.getByTestId('calls')).toHaveText('2');
  await root.getByRole('button', { name: 'Verify full reset', exact: true }).click();
  await expect(root.getByTestId('count')).toHaveText(['0', '0']);
  await expect(root.getByTestId('invariant')).toHaveText('true');
  await expect(root.getByTestId('calls')).toHaveText('3');
  await expect(page.getByTestId('root-b').getByTestId('calls')).toHaveText('1');
});

test('initial factory throws; failed reset retains state and reports separately from dispatch', async ({ page }) => {
  await page.goto('/');
  const root = page.getByTestId('root-a');
  await root.getByRole('button', { name: 'Increment', exact: true }).first().click();
  await root.getByRole('button', { name: 'Fail reset', exact: true }).click();
  await expect(root.getByTestId('failure')).toHaveText('reset');
  await expect(root.getByTestId('count')).toHaveText(['1', '1']);
  await expect(root.getByTestId('invariant')).toHaveText('true');
  await expect(root.getByTestId('calls')).toHaveText('2');
  await root.getByRole('button', { name: 'Fail dispatch', exact: true }).first().click();
  await expect(root.getByTestId('failure')).toHaveText('reducer');
  await root.getByRole('button', { name: 'Fail creation', exact: true }).click();
  await expect(root.getByTestId('invariant')).toHaveText('true');
});

test('missing provider reports context failure without a fallback store', async ({ page }) => {
  const failure = page.waitForEvent('pageerror');
  await page.goto('/?missing');
  expect((await failure).message).toMatch(/missing_context|Context was not set/);
  await expect(page.getByTestId('count')).toHaveCount(0);
});
```

Also compile this file without executing it. `@ts-expect-error` must remain
satisfied by the selected public declarations, including primitive and union
roots. It is a type probe, not application code.

```ts
// src/store/contracts.ts
import type { Store, StoreConfig } from '@gost-kit/common';
import type { RootState, RootAction, RootEffect } from './core';
import { rootState, rootReducer, rootEffector } from './core';
function check(store: Store<RootState, RootAction>, primitive: Store<number, never>, union: Store<{ a: number } | { b: number }, never>) {
  store.reset();
  store.reset({ excluded: ['counter'] as const });
  // @ts-expect-error exclusions name root scopes
  store.reset({ excluded: ['absent'] });
  primitive.reset();
  primitive.reset({ excluded: [] }); // empty exclusions still mean full reset
  // @ts-expect-error primitive roots permit full reset only
  primitive.reset({ excluded: ['value'] });
  union.reset();
  // @ts-expect-error union roots permit full reset only
  union.reset({ excluded: ['a'] });
}
const invalid: StoreConfig<RootState, RootAction, RootEffect> = {
  // @ts-expect-error initState requires a zero-argument factory
  initState: rootState(), reducer: rootReducer, effector: rootEffector,
};
void check;
void invalid;
```

Run type/Svelte checks, build and browser checks. Verify both descendants change
together, another root stays unchanged, and the effect result action updates
state. A missing-provider error is expected only in that negative case; it must
not silently create a store. The original greeting check must still pass.

An occupied Vite URL must stop the run, not reuse a server. Record real package
versions/source and limitations alongside the results. Remove the probe from
the final consumer result and recheck the empty connection and existing behavior.
