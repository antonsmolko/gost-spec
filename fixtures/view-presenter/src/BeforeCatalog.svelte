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
