<script lang="ts">
  import { useStore } from '../../../../../store/index.ts';
  import { createPresenter } from './create.presenter.ts';
  const store = useStore();
  const view = $derived(createPresenter({ input: store.state['users-create'] }));
  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    void store.dispatch({ scope: 'registration', type: 'SubmitAction' });
  };
</script>

<form onsubmit={submit}>
  <label>Name <input value={view.name} disabled={view.disabled} oninput={(event) => void store.dispatch({
    scope: 'registration', type: 'NameChangedAction', name: event.currentTarget.value,
  })} /></label>
  <button type="submit" disabled={view.disabled}>{view.button}</button>
</form>
{#if view.failed}<p role="alert">{view.error}</p>{/if}
