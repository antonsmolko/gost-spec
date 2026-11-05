<script lang="ts">
  let { title, isVisible, onActivate }: {
    title: string; isVisible: boolean; onActivate: () => void;
  } = $props();
</script>

{#if isVisible}<button type="button" onclick={onActivate}>{title}</button>{/if}
