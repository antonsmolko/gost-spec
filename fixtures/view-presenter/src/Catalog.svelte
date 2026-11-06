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
