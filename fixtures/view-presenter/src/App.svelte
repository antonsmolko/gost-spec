<script lang="ts">
  import Catalog from './Catalog.svelte';
  import BeforeCatalog from './BeforeCatalog.svelte';
  import ReadyLabel from './ReadyLabel.svelte';
  import type { CatalogInput, CatalogLabels } from './catalog.js';
  const labels: CatalogLabels = { untitled: 'Untitled', errorFallback: 'Please retry' };
  const before = new URLSearchParams(window.location.search).has('before');
  let input: CatalogInput = $state({ status: 'idle', items: [], error: null });
  let refreshes = $state(0);
  let activations = $state(0);
  const refresh = () => { refreshes += 1; };
  const activate = () => { activations += 1; };
</script>

<nav aria-label="Fixture inputs">
  <button onclick={() => { input = { status: 'loading', items: [], error: null }; }}>Set loading</button>
  <button onclick={() => { input = { status: 'ready', items: [], error: null }; }}>Set empty</button>
  <button onclick={() => { input = { status: 'ready', items: [
    { id: 'a', title: ' Alpha ' }, { id: 'b', title: null }, { id: 'c', title: ' ' },
  ], error: null }; }}>Set ready</button>
  <button onclick={() => { input = { ...input, items: [{ id: 'a', title: ' Beta ' }] }; }}>Change rows</button>
  <button onclick={() => { input = { status: 'error', items: [], error: ' Offline ' }; }}>Set error</button>
  <button onclick={() => { input = { status: 'error', items: [], error: null }; }}>Set nullable error</button>
</nav>
{#if before}
  <BeforeCatalog {input} {labels} onRefresh={refresh} />
{:else}
  <Catalog {input} {labels} onRefresh={refresh} />
{/if}
<ReadyLabel title="Activate" isVisible={true} onActivate={activate} />
<p aria-label="Refresh count">{refreshes}</p>
<p aria-label="Activation count">{activations}</p>
