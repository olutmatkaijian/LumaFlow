<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Button } from "carbon-components-svelte";
  import { Add, Subtract, Reset } from "carbon-icons-svelte";
  import { initSocket, setupGraphListeners } from '../GraphLogic';
  import { handleKeyDown, handleMouseMove } from '../EventHandlers';
  
  export let flowsheetId: string;
  
  let graph: any = null;
  let socket: any;
  let graphContainer: HTMLElement;
  const WEBSOCKET_URL = 'ws://localhost:8080'; // Replace with your actual WebSocket URL
  let lockedElements = new Set<string>();
  
  const updateLockedElements = (elements: Set<string>) => {
    lockedElements = elements;
  };
  
  onMount(async () => {
    if (browser) {
      const { Graph } = await import('@maxgraph/core');
      const { initGraph } = await import('../GraphLogic');
  
      if (graphContainer) {
        graph = initGraph(graphContainer);
        if (graph) {
          socket = initSocket(WEBSOCKET_URL, flowsheetId, graph, updateLockedElements);
          setupGraphListeners(graph, socket);
          window.addEventListener('keydown', (e) => handleKeyDown(e, graph, lockedElements));
          window.addEventListener('mousemove', (e) => handleMouseMove(e, socket, graphContainer));
        }
      }
    }
  });
  
  export function loadGraphContentWrapper(content: any) {
    if (graph) {
      // Implement the logic to load graph content
      console.log('Loading graph content:', content);
    }
  }
  
  export function getGraphContentWrapper() {
    if (graph) {
      // Implement the logic to get graph content
      return { /* graph content */ };
    }
    return null;
  }
  
  function zoomIn() {
    if (graph) {
      graph.zoomIn();
    }
  }
  
  function zoomOut() {
    if (graph) {
      graph.zoomOut();
    }
  }
  
  function resetZoom() {
    if (graph) {
      graph.zoomActual();
    }
  }
  </script>
  
  <div class="canvas-area">
    <div bind:this={graphContainer} class="graph-container"></div>
    <div class="graph-controls">
      <Button kind="ghost" icon={Add} iconDescription="Zoom In" on:click={zoomIn} />
      <Button kind="ghost" icon={Subtract} iconDescription="Zoom Out" on:click={zoomOut} />
      <Button kind="ghost" icon={Reset} iconDescription="Reset Zoom" on:click={resetZoom} />
    </div>
  </div>
  
  <style>
    @import '../../styles/components/CanvasArea.css';
  </style>
  
  