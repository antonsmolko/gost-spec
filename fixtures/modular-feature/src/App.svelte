<script lang="ts">
  import { onMount } from 'svelte';
  import { createApplicationStore } from './store/create-store.ts';
  import { provideStore } from './store/context.ts';
  import { ListPage } from './features/users/list/ui/index.ts';
  import { CreatePage } from './features/users/create/ui/index.ts';
  import { pagePresenter } from './app/page.presenter.ts';
  const { transport }: { transport: typeof fetch } = $props();
  const store = createApplicationStore((input, init) => transport(input, init));
  provideStore(store);
  const view = $derived(pagePresenter({ page: store.state.navigation.page }));
  onMount(() => { void store.dispatch({ scope: 'app', type: 'NavigateAction', to: 'list' }); });
</script>

<nav aria-label="Users navigation">
  <button onclick={() => void store.dispatch({ scope: 'app', type: 'NavigateAction', to: 'list' })}>User list</button>
  <button onclick={() => void store.dispatch({ scope: 'app', type: 'NavigateAction', to: 'create' })}>Create user</button>
</nav>
{#if view.list}<ListPage />{:else if view.create}<CreatePage />{/if}
