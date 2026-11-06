# View presenter example

Prepare catalog text, display flags and rows from ordinary input data. The labels
are explicit application policy: a null/blank title uses `untitled`; a null/blank
error uses `errorFallback`. These defaults are specified inputs, not universal
validation or a convention to invent for other applications.

## Source and applicability

The [pure/rendering guidance](https://github.com/antonsmolko/gost-spec/blob/f0a936c36458225dd58a896e7f5f6257dcf99821/packages/domains/frontend/architecture/presenter-composition.md#requirement)
is FRONTEND-ARCH-002, revision f0a936c, proposed/Pending. Read its Requirement,
Applicability and Verification sections for those
responsibilities. The broader document also discusses project-specific state/event
architecture; retain the target project's already-adopted applicability. The source permits broader function composition; this skill uses independent
component-level presenters. The recipe illustrates the selected convention and
does not accept or redefine the standard.
If the pinned source is unavailable, use a verified copy of that revision or
report the dependent policy verification incomplete.

## Before: calculations inside the component

`BeforeCatalog.svelte` compiles and preserves the desired behaviour, but display
conditions and formatting are coupled to the component.

### BeforeCatalog.svelte

```svelte
<script lang="ts">
  import type { CatalogInput, CatalogLabels } from './catalog.js';
  let { input, labels, onRefresh }: {
    input: CatalogInput; labels: CatalogLabels; onRefresh: () => void;
  } = $props();
</script>

<section aria-label="Catalog">
  {#if input.status === 'loading'}
    <p>Loading</p>
  {:else if input.status === 'error'}
    <p role="alert">{input.error?.trim() || labels.errorFallback}</p>
  {:else if input.status === 'ready' && input.items.length === 0}
    <p>No items</p>
  {:else if input.status === 'ready'}
    <ul>{#each input.items as item (item.id)}<li>{item.title?.trim() || labels.untitled}</li>{/each}</ul>
  {:else}
    <p>Not requested</p>
  {/if}
  <button type="button" onclick={onRefresh} disabled={input.status === 'loading'}>Refresh</button>
</section>
```

## Explicit input contract

### catalog.ts

```ts
export type CatalogInput = {
  readonly status: 'idle' | 'loading' | 'ready' | 'error';
  readonly items: readonly { readonly id: string; readonly title: string | null }[];
  readonly error: string | null;
};

export type CatalogLabels = { readonly untitled: string; readonly errorFallback: string };
```

## One presenter prepares the view

`catalogPresenter` receives a named parameter object and returns the explicit
`ViewState`. It prepares flags, text and rows directly. Other presenters, when
needed, are called independently by the component. A presenter does not call
other presenters.

### catalog.presenter.ts

```ts
import type { CatalogInput, CatalogLabels } from './catalog.ts';

type Params = {
  input: CatalogInput;
  labels: CatalogLabels;
};

export type ViewState = {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  isLoaded: boolean;
  errorMessage: string;
  rows: { id: string; title: string }[];
};

export const catalogPresenter = ({ input, labels }: Params): ViewState => ({
  isLoading: input.status === 'loading',
  isError: input.status === 'error',
  isEmpty: input.status === 'ready' && input.items.length === 0,
  isLoaded: input.status === 'ready' && input.items.length > 0,
  errorMessage: input.error?.trim() || labels.errorFallback,
  rows: input.items.map(({ id, title }) => ({ id, title: title?.trim() || labels.untitled })),
});
```

## Colocated unit tests

Run these tests with Node 26 using `node --test src/catalog.presenter.test.ts`,
or adapt to the project's existing runner. They call functions directly and
check a static table of expected flags, explicit context and frozen inputs.

### catalog.presenter.test.ts

```ts
import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { catalogPresenter } from './catalog.presenter.ts';
import type { CatalogInput } from './catalog.ts';

const labels = { untitled: 'Untitled', errorFallback: 'Please retry' };
const input = (overrides: Partial<CatalogInput> = {}): CatalogInput => ({
  status: 'idle', items: [], error: null, ...overrides,
});

describe('catalog presenter', () => {
  for (const [status, items, flags] of [
    ['idle', [], [false, false, false, false]],
    ['loading', [], [true, false, false, false]],
    ['loading', [{ id: 'a', title: ' Old ' }], [true, false, false, false]],
    ['ready', [], [false, false, true, false]],
    ['ready', [{ id: 'a', title: ' New ' }], [false, false, false, true]],
    ['error', [], [false, true, false, false]],
    ['error', [{ id: 'a', title: ' Old ' }], [false, true, false, false]],
  ] as const) {
    test(`${status}, ${items.length} rows: ready display flags`, () => {
      const result = catalogPresenter({ input: input({ status, items }), labels });
      assert.deepEqual([result.isLoading, result.isError, result.isEmpty, result.isLoaded], flags);
    });
  }
  test('prepares rows with supplied nullable/blank fallback', () => {
    assert.deepEqual(catalogPresenter({ input: input({ status: 'ready', items: [
      { id: 'a', title: '  Alpha  ' }, { id: 'b', title: null }, { id: 'c', title: ' ' },
    ] }), labels }).rows, [{ id: 'a', title: 'Alpha' }, { id: 'b', title: 'Untitled' }, { id: 'c', title: 'Untitled' }]);
  });
  test('uses explicit context and error text', () => {
    assert.equal(catalogPresenter({ input: input({ status: 'error', error: ' Offline ' }), labels }).errorMessage, 'Offline');
    assert.equal(catalogPresenter({ input: input({ status: 'error' }), labels: { ...labels, errorFallback: 'Try again' } }).errorMessage, 'Try again');
    assert.equal(catalogPresenter({ input: input({ items: [{ id: 'a', title: null }] }), labels: { ...labels, untitled: 'Unnamed' } }).rows[0].title, 'Unnamed');
  });
  test('returns the complete view state and preserves frozen inputs', () => {
    const before = Object.freeze(input({ status: 'ready', items: Object.freeze([
      Object.freeze({ id: 'a', title: ' Alpha ' }),
    ]) }));
    const context = Object.freeze({ ...labels });
    const result = catalogPresenter({ input: before, labels: context });
    assert.deepEqual(result, { isLoading: false, isError: false, isEmpty: false, isLoaded: true, errorMessage: 'Please retry', rows: [{ id: 'a', title: 'Alpha' }] });
    assert.deepEqual(result.rows, [{ id: 'a', title: 'Alpha' }]);
    assert.equal(before.items[0].title, ' Alpha ');
    assert.deepEqual(catalogPresenter({ input: before, labels: context }), result);
    assert.notEqual(result.rows, before.items);
  });
});
```

## After: bind and render the result

### Catalog.svelte

```svelte
<script lang="ts">
  import { catalogPresenter } from './catalog.presenter.js';
  import type { CatalogInput, CatalogLabels } from './catalog.js';
  let { input, labels, onRefresh }: {
    input: CatalogInput; labels: CatalogLabels; onRefresh: () => void;
  } = $props();
  const view = $derived(catalogPresenter({ input, labels }));
</script>

<section aria-label="Catalog">
  {#if view.isLoading}
    <p>Loading</p>
  {:else if view.isError}
    <p role="alert">{view.errorMessage}</p>
  {:else if view.isEmpty}
    <p>No items</p>
  {:else if view.isLoaded}
    <ul>{#each view.rows as row (row.id)}<li>{row.title}</li>{/each}</ul>
  {:else}
    <p>Not requested</p>
  {/if}
  <button type="button" onclick={onRefresh} disabled={view.isLoading}>Refresh</button>
</section>
```

## Ready props need no new calculation

### ReadyLabel.svelte

```svelte
<script lang="ts">
  let { title, isVisible, onActivate }: {
    title: string; isVisible: boolean; onActivate: () => void;
  } = $props();
</script>

{#if isVisible}<button type="button" onclick={onActivate}>{title}</button>{/if}
```

## Verify the binding separately

In the browser, change idle → loading → ready empty → ready rows → error and
change rows again after rendering. Check ready labels/branches and that Refresh
and Activate still invoke the supplied callbacks. Pure tests do not prove these
updates. Keep the store/data source, dependencies and event behaviour in place.

## Recognize incomplete extractions

- `const view = catalogPresenter({ input, labels })` runs once in a Svelte script; use
  a reactive call for changing props. Successful TypeScript compilation is not
  evidence of updates.
- A component-local `$derived(input.status === "ready")` or helper named
  `isLoaded` still contains the presentation calculation. Trace its producer.
- Sorting input items in place mutates the input; prepare a separate result.
- Reading a store, clock or locale implicitly makes equal explicit inputs
  insufficient. Pass the required data as context and keep side effects outside.

These are manual classifications, not automatic lint guarantees. Use the
project's available checks and report missing input/source/runtime evidence.
