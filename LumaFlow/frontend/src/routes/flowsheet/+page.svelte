<script lang="ts">
  import { onMount } from 'svelte';
  import FlowsheetDesigner from '$lib/components/FlowsheetDesigner.svelte';
  import { page } from '$app/stores';
  import { browser } from '$app/environment';

  export const ssr = false;
 
  export const load = async () => {
  // This function runs on both server and client
  return {
    // Add any server-side data fetching here
  };
};

// This ensures @maxgraph/core is only imported on the client side
export const hydrate = browser && (async () => {
  const { Graph } = await import('@maxgraph/core');
  return { Graph };
});


  let isClient = false;
  let flowsheetId: string;
 
  onMount(() => {
    isClient = true;
    flowsheetId = $page.params.id || 'default';
  });
 </script>
 
 {#if isClient}
  <FlowsheetDesigner {flowsheetId} />
 {:else}
  <div class="loading-placeholder">
    <h2>Flowsheet Designer</h2>
    <p>Loading interactive editor...</p>
  </div>
 {/if}
 
 <style>
  .loading-placeholder {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: var(--background-light);
    color: var(--text-color);
  }
 </style>
 
 