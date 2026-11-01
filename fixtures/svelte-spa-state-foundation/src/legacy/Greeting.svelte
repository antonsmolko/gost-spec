<script lang="ts">
  import { greeting } from './message';

  let name = $state('');
  let message = $state('');
</script>

<section aria-label="Existing greeting">
  <label>Name <input bind:value={name} /></label>
  <button onclick={() => { message = greeting(name); }}>Greet</button>
  <p role="status">{message}</p>
</section>
