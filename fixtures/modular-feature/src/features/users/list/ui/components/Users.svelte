<script lang="ts">
  import { useStore } from '../../../../../store/index.ts';
  import { usersPresenter } from './users.presenter.ts';
  const store = useStore();
  const labels = { loading: 'Loading users', empty: 'No users' };
  const view = $derived(usersPresenter({ input: store.state['users-list'], labels }));
</script>

<label>Search <input value={view.query} oninput={(event) => void store.dispatch({
  scope: 'directory', type: 'QueryChangedAction', query: event.currentTarget.value,
})} /></label>
{#if view.loading}<p>{view.message}</p>
{:else if view.failed}<p role="alert">{view.message}</p>
{:else if view.empty}<p>{view.message}</p>
{:else}
  <ul>{#each view.rows as row (row.key)}<li data-testid="user-row">{row.label}</li>{/each}</ul>
{/if}
