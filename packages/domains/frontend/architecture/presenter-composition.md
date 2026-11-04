# Compose pure presentation calculations

ID: FRONTEND-ARCH-002.

Status: proposed (draft; not approved). Level: required.

## Requirement

In projects applying this FC/presenter contract, presentation calculations MUST
live in pure functions with explicit inputs/context outside the component.
They MUST NOT mutate inputs, access stores through hidden dependencies, perform
effects or own an alternative mutable UI-store. The same inputs produce the
same result; pass relevant context such as locale explicitly.

Group calculations when they share meaningful work or form a cohesive result.
Independent calculations may remain separate, each receiving only its inputs.
A combining presenter calls the smaller functions; they MUST NOT depend on the
combining presenter or component. An entire screen is not itself a reason for
one monolithic presenter. No presenter API, object layout or file suffix is required.

A component MUST display ready values. If/else-if conditions MUST read a ready
boolean from view data or ready props; ordinary else is allowed. Comparisons,
logical combinations, ternaries, negation, function calls in conditions and
object/data truthiness MUST NOT replace that boolean. Formatting, filtering,
sorting, mapping and fallback presentation decisions belong in a presenter.
Renaming a component calculation to `isLoaded` does not move its ownership.

Read-only reactive feature selection, ready-field aliases and calls to pure
presenters are allowed. Presentation calculations inline in component derived
bindings MUST move to presenters. This is a project policy on responsibility,
not a claim that the framework forbids those expressions or that derived values
are intrinsically read-only.

Logical UI-state and intent handling follow
[state ownership](state-ownership.md). Stateless/shared components receiving ready
props and intent callbacks need no extra presenter when there is nothing to compute.

## Rationale

Pure functions make presentation decisions testable without mounting a UI.
Composition supports shared work and narrow independent dependencies. Precise
rendering boundaries keep calculations out of template expressions without
forbidding conditional blocks or necessary reactive/event wiring.

## Applicability

Frontend projects explicitly adopting this contract. Selecting Svelte or FSD
alone does not impose it. Inputs follow a documented application contract:
external data is checked before trusted state, domain validation/errors retain
their own FC/application boundaries, and presenters handle documented loading,
empty, error and nullable variants. They do not validate arbitrary unknown input
or conceal missing required inputs with type assertions or unagreed defaults.

| Component context | Allowed | Move or reject |
| --- | --- | --- |
| Text/attribute | Ready prop/view field, ready row field | Inline formatting, calculation or fallback selection |
| If/else-if | Ready boolean identifier or property, e.g. `isLoaded`, `viewState.isLoaded` | Comparisons, `&&`/`\|\|`, ternary, negation, function call, object/array truthiness |
| List | Iterate a ready array; read row fields and stable ready keys | Inline filter/sort/map or calculated row availability/key |
| Reactive binding | Select feature state, alias a ready field, call a pure presenter | Calculate presentation logic in component derived; override it as logical mutable state |
| Event | Forward stable value/checked/id payload through one logical intent | Choose business actions or chain dispatch; send a DOM node/event into FC |
| Browser plumbing | Refs, focus/text selection, lifecycle/widget wiring | Own a competing draft/selection/modal state or hide business decisions |

A simple variable name does not prove its type or provenance. Review where the
value is produced and which dependencies a called function actually uses. A DOM
event can be forwarded between UI handlers/adapters; FC receives the necessary
stable payload. Browser-only handlers may emit zero actions. No automatic
provenance/purity checker is supplied by this document.

## Example: independent and composed presenters

The following synthetic `catalog.presenter.ts` uses already-checked application
state. Its formatting choices illustrate this example, not a universal policy.

```ts
export type Item = { readonly id: string; readonly title: string };
export type CatalogState = {
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly items: readonly Item[];
  readonly error: string | null;
};

export const presentRows = (items: readonly Item[]) => items.map(({ id, title }) => ({
  id, title: title.trim(),
}));

export const presentStatus = ({ status, items, error }: CatalogState) => ({
  isLoading: status === 'loading',
  isError: status === 'error',
  isEmpty: status === 'ready' && items.length === 0,
  isLoaded: status === 'ready' && items.length > 0,
  errorMessage: error ?? '',
});

export const presentCatalog = (state: CatalogState) => ({
  ...presentStatus(state), rows: presentRows(state.items),
});
```

`presentStatus` groups related status outputs. `presentRows` needs only items.
They can be bound independently or combined as above. Neither needs component
access or mutable presenter state. `idle` has all display-state booleans false;
the component below uses ordinary else for its ready initial message.

## Component and browser examples

These complete Svelte 5 examples illustrate the framework-independent policy.
Use the project's existing contracts and shell, not a new store from an example.

### Catalog.svelte — valid reactive binding and rendering

```svelte
<script lang="ts">
  import { presentCatalog, type CatalogState } from './catalog.presenter.js';
  type Intent = { type: 'RefreshAction' };
  type Root = { readonly state: { readonly catalog: CatalogState }; dispatch: (action: Intent) => Promise<void> };
  let { root }: { root: Root } = $props();
  const catalog = $derived(root.state.catalog);
  const viewState = $derived(presentCatalog(catalog));
  const refresh = () => { void root.dispatch({ type: 'RefreshAction' }); };
</script>

{#if viewState.isLoading}
  <p>Loading</p>
{:else if viewState.isError}
  <p role="alert">{viewState.errorMessage}</p>
{:else if viewState.isEmpty}
  <p>No items</p>
{:else if viewState.isLoaded}
  {#each viewState.rows as row (row.id)}
    <p>{row.title}</p>
  {/each}
{:else}
  <p>Not requested</p>
{/if}
<button type="button" onclick={refresh} disabled={viewState.isLoading}>Refresh</button>
```

Selecting state and invoking a presenter through `$derived` preserves the
binding. There is no inline status comparison and no component-owned store.
The illustrative Root type describes the existing application API; it does not
implement it. A missing/incompatible contract is a missing input, not permission
to invent a new state manager.

### ReadyLabel.svelte — valid stateless/shared component

```svelte
<script lang="ts">
  let { title, isVisible, onActivate }: {
    title: string; isVisible: boolean; onActivate: () => void;
  } = $props();
</script>
{#if isVisible}
  <button type="button" onclick={onActivate}>{title}</button>
{/if}
```

The parent supplies ready props and the intent callback; this component needs
neither a presenter nor direct access to FC. Review the source of `isVisible`
in its caller; its name alone is not a guarantee.

### BrowserInput.svelte — valid zero-action focus and widget lifecycle

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  type MountWidget = (host: HTMLElement, callbacks: { onSelect: (id: string) => void }) => { destroy: () => void };
  let { value, onChange, onSelect, mountWidget }: {
    value: string; onChange: (value: string) => void; onSelect: (id: string) => void;
    mountWidget: MountWidget;
  } = $props();
  let input: HTMLInputElement | undefined = $state();
  let host: HTMLDivElement | undefined = $state();
  const focusInput = () => { input?.focus(); };
  onMount(() => {
    if (!host) return;
    const widget = mountWidget(host, { onSelect: (id) => onSelect(id) });
    return () => widget.destroy();
  });
</script>
<input aria-label="Query" bind:this={input} {value} oninput={(event) => onChange(event.currentTarget.value)} />
<button type="button" onclick={focusInput}>Focus query</button>
<div bind:this={host}></div>
```

The injected adapter describes an existing widget boundary, not a required
widget library/API. Focus and mount/cleanup emit no logical intent by themselves.
Refs are browser handles, not draft/selection state. The widget callback forwards
an intent; its logical selection must remain in application state. If a widget
also needs to reflect state changes, synchronize that display through its existing
adapter without making it another owner. The host guard is browser plumbing,
not a display condition or business branch.

### BadView.svelte — syntax-valid, policy-invalid calculations and local state

```svelte
<script lang="ts">
  import type { CatalogState } from './catalog.presenter.js';
  let { catalog }: { catalog: CatalogState } = $props();
  const isLoaded = $derived(catalog.status === 'ready' && catalog.items.length > 0);
  const hasItems = () => catalog.items.length > 0;
  let localDraft = $state('');
</script>
{#if catalog.items}<p>Object truthiness</p>{/if}
{#if catalog.status !== 'loading' && catalog.items.length}<p>Inline calculation</p>{/if}
{#if !isLoaded}<p>Negation</p>{/if}
{#if hasItems()}<p>Function call in condition</p>{/if}
{#if isLoaded}<p>Simple name hides a component calculation</p>{/if}
{#each catalog.items.filter((item) => item.title) as item (item.id)}
  <p>{item.title.trim()}</p>
{/each}
<input aria-label="Draft" bind:value={localDraft} />
```

Each construct violates a stated boundary: truthiness/calculation/negation/call
conditions, a derived calculation hidden by a name, inline collection/formatting
work, or a second owner of logical draft state. Moving the same calculation to
a component helper is not a fix. Move view calculations to pure presenters and
logical draft state to FC, preserving controlled value/event wiring.

### BadEditor.svelte — syntax-valid, policy-invalid business selection and dispatch chain

```svelte
<script lang="ts">
  import type { RootState, Action } from './editor-core.js';
  let { root }: { root: { readonly state: RootState; dispatch: (action: Action) => Promise<void> } } = $props();
  const chooseInUI = () => {
    if (root.state.editor.mode === 'view') void root.dispatch({ type: 'StartEditingAction' });
    else void root.dispatch({ type: 'ConfirmAction' });
  };
  const chainInUI = async () => {
    await root.dispatch({ type: 'StartEditingAction' });
    await root.dispatch({ type: 'ConfirmAction' });
  };
</script>
<button type="button" onclick={chooseInUI}>Toggle editor</button>
<button type="button" onclick={chainInUI}>Run workflow</button>
```

`editor-core.ts` is the complete state-only example in
[state ownership](state-ownership.md#example-one-intent-current-state-decision).
For this toggle intent the valid UI sends one `ToggleEditorAction`; its reducer
decides from current state. A browser/widget callback that hides either business
selection or a competing logical store has the same violation; lifecycle setup
does not exempt it. Domain workflows with I/O use existing application effects,
not these UI dispatch chains.

### BadBrowser.svelte — syntax-valid, policy-invalid browser callbacks

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { RootState, Action } from './editor-core.js';
  type MountWidget = (host: HTMLElement, callbacks: { onSelect: (id: string) => void }) => { destroy: () => void };
  let { root, mountWidget }: {
    root: { readonly state: RootState & { selectedId: string }; dispatch: (action: Action) => Promise<void> };
    mountWidget: MountWidget;
  } = $props();
  let host: HTMLDivElement | undefined = $state();
  const focusAndChoose = () => {
    if (root.state.editor.mode === 'view') void root.dispatch({ type: 'StartEditingAction' });
    else void root.dispatch({ type: 'ConfirmAction' });
  };
  onMount(() => {
    if (!host) return;
    const widget = mountWidget(host, { onSelect: (id) => { root.state.selectedId = id; } });
    return () => widget.destroy();
  });
</script>
<input aria-label="Editor" onfocus={focusAndChoose} />
<div bind:this={host}></div>
```

The ref guard and cleanup are legitimate plumbing, but they do not excuse the
focus handler's business selection or the widget callback's direct logical-state
write. A browser-only focus helper needs no action. If focus represents a logical
feature intent, send that one intent and let FC decide. A widget selection likewise
forwards its stable id through the application's existing intent boundary.

## Verification

Test pure calculations with explicit state/context and documented variants;
assert related outputs together and narrow calculations independently. Use the
project's existing state factories for FC reducer cases and test state/effect
descriptions without dispatch or effect execution. Check input preservation.

Separately verify component binding: changing relevant inputs updates displayed
values/ready booleans, events forward one logical intent, browser-only focus sends
none, and widget lifecycle cleans up. Review valid and invalid cases against the
contract, including missing/invalid inputs and local UI-state ownership.

Compiler/type checks establish syntax and compatibility, not policy compliance.
Both BadView and BadEditor may compile successfully. A linter, helper name or
simple boolean identifier does not establish arbitrary function purity or source
provenance. Record manual checks and unavailable evidence explicitly; do not
claim reactive integration from pure-function tests.

## References

[Presentation Model](https://martinfowler.com/eaaDev/PresentationModel.html)
motivates separating presentation behavior from controls. Pure functions and the
ownership/rendering boundaries here are this standard's proposed policy.
[Svelte derived](https://svelte.dev/docs/svelte/$derived),
[if](https://svelte.dev/docs/svelte/if) and
[bindings](https://svelte.dev/docs/svelte/bind) describe framework capabilities;
this contract deliberately narrows some allowed expressions for adopting projects.
