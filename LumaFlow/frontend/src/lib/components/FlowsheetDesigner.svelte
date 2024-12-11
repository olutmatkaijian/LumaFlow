<script lang="ts">
import { onMount } from 'svelte';
import { browser } from '$app/environment';
import { goto } from '$app/navigation';
import LeftSidebar from './LeftSidebar.svelte';
import RightSidebar from './RightSidebar.svelte';
import { flowsheetStore } from '../stores/flowsheet';
import { Add, Subtract, Reset } from "carbon-icons-svelte";

export let flowsheetId: string;

let graphContainer: HTMLElement;
let graph: any;
let leftSidebarVisible = true;
let rightSidebarVisible = true;
let svgElements: Record<string, Array<{ name: string; svg: string; category: string }>> = {};
let loading = true;
let error: string | null = null;
let isLoggedIn = false;
let username = '';
let diagramType: string = 'Other';
let flowsheetData: any = null;

onMount(async () => {
  if (browser) {
    try {
      const { isAuthenticated, getUserInfo } = await import('$lib/api/authApi');
      const { fetchSvgElements, loadFlowsheet } = await import('$lib/api/flowsheetApi');
      const { initGraph } = await import('$lib/GraphLogic');

      isLoggedIn = await isAuthenticated();
      if (isLoggedIn) {
        const userInfo = await getUserInfo();
        username = userInfo.username;
        await loadFlowsheetData();
        svgElements = await fetchSvgElements(diagramType);
        graph = initGraph(graphContainer);
        if (graph) {
          setupGraphListeners(graph);
        }
      } else {
        error = "Please log in to access the flowsheet.";
        console.log("User is not authenticated. Redirecting to login...");
        goto('/login');
      }
    } catch (e) {
      console.error('Error checking auth status:', e);
      error = "An error occurred while checking authentication. Please try again.";
    } finally {
      loading = false;
    }
  }
});

async function loadFlowsheetData() {
  const { loadFlowsheet } = await import('$lib/api/flowsheetApi');
  try {
    flowsheetData = await loadFlowsheet(flowsheetId);
    diagramType = flowsheetData.diagram_type || 'Other';
    if (graph && flowsheetData.content) {
      populateGraph(flowsheetData.content);
    }
  } catch (e) {
    console.error('Error loading flowsheet data:', e);
    error = "Failed to load flowsheet data. Please try again.";
  }
}

function populateGraph(content: any) {
  if (graph) {
    graph.getModel().beginUpdate();
    try {
      graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));

      content.nodes.forEach((node: any) => {
        const vertex = graph.insertVertex(
          graph.getDefaultParent(),
          node.id,
          node.label,
          node.x,
          node.y,
          node.width,
          node.height,
          node.style
        );
        addConnectionPoints(graph, vertex);
      });

      content.edges.forEach((edge: any) => {
        const source = graph.getModel().getCell(edge.source);
        const target = graph.getModel().getCell(edge.target);
        graph.insertEdge(
          graph.getDefaultParent(),
          edge.id,
          edge.label,
          source,
          target,
          edge.style
        );
      });
    } finally {
      graph.getModel().endUpdate();
    }
  }
}

function setupGraphListeners(graph: any) {
  graph.addListener('drop', handleDrop);
  graph.addListener('keydown', handleKeyDown);

  graph.addListener('change', (sender: any, evt: any) => {
    const changes = evt.getProperty('changes');
    // Emit changes to server or update local state
  });

  graph.getSelectionModel().addListener('change', (sender: any, evt: any) => {
    const cells = graph.getSelectionCells();
    if (cells.length === 1) {
      const selectedCell = cells[0];
      const cellProperties = getCellProperties(selectedCell);
      flowsheetStore.setSelectedNode(cellProperties);
    } else {
      flowsheetStore.clearSelectedNode();
    }
  });
}

function getCellProperties(cell: any) {
  const properties: any = {
    id: cell.id,
    type: cell.isVertex() ? 'Node' : 'Edge',
    name: cell.value || '',
    script: cell.script || '',
    properties: {},
  };

  if (cell.isVertex()) {
    properties.properties = {
      x: cell.geometry.x,
      y: cell.geometry.y,
      width: cell.geometry.width,
      height: cell.geometry.height,
    };
  } else if (cell.isEdge()) {
    properties.properties = {
      source: cell.source ? cell.source.id : null,
      target: cell.target ? cell.target.id : null,
    };
  }

  if (typeof cell.value === 'object' && cell.value !== null) {
    Object.assign(properties.properties, cell.value);
  }

  return properties;
}

function handleDrop(event: any) {
  const { x, y } = event.properties;
  const data = JSON.parse(event.properties.dataTransfer.getData('application/json'));

  graph.model.beginUpdate();
  try {
    if (data.name === 'Stream') {
      createStreamEdge(graph, x, y);
    } else {
      createNode(graph, data, x, y);
    }
  } finally {
    graph.model.endUpdate();
  }
}

function createNode(graph: any, data: { name: string, svg: string, category: string }, x: number, y: number) {
  const parent = graph.getDefaultParent();
  const vertex = graph.insertVertex(
    parent,
    null,
    data.name,
    x,
    y,
    80,
    80,
    `shape=image;image=/svg/${data.category}/${data.name}.svg`
  );
  vertex.script = ''; // Initialize with an empty script
  addConnectionPoints(graph, vertex);
  graph.setSelectionCell(vertex);
}

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Delete') {
    const cell = graph.getSelectionCell();
    if (cell) {
      graph.removeCells([cell]);
      flowsheetStore.clearSelectedNode();
    }
  }
}

async function handleSave() {
  if (graph) {
    const content = getGraphContent(graph);
    try {
      const { saveFlowsheet } = await import('$lib/api/flowsheetApi');
      await saveFlowsheet(flowsheetId, content);
      console.log('Flowsheet saved successfully');
    } catch (e) {
      console.error('Error saving flowsheet:', e);
      error = 'Failed to save flowsheet';
    }
  }
}

function toggleLeftSidebar() {
  leftSidebarVisible = !leftSidebarVisible;
}

function toggleRightSidebar() {
  rightSidebarVisible = !rightSidebarVisible;
}

async function handleLogout() {
  try {
    const { logout } = await import('$lib/api/authApi');
    await logout();
    goto('/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  }
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

// Placeholder functions to be implemented
function addConnectionPoints(graph: any, vertex: any) {
  // Implementation here
}

function createStreamEdge(graph: any, x: number, y: number) {
  // Implementation here
}

function getGraphContent(graph: any) {
  // Implementation here
  return {};
}
</script>

<div class="flowsheet-designer">
  <header class="app-header">
    <div class="app-title">Flowsheet Designer v1.0</div>
    <nav>
      <div class="dropdown">
        <button class="dropbtn">File</button>
        <div class="dropdown-content">
          <a href="#" on:click={handleSave}>Save</a>
          <a href="/dashboard">Dashboard</a>
        </div>
      </div>
      <div class="dropdown">
        <button class="dropbtn">View</button>
        <div class="dropdown-content">
          <a href="#" on:click={toggleLeftSidebar}>Toggle Left Sidebar</a>
          <a href="#" on:click={toggleRightSidebar}>Toggle Right Sidebar</a>
        </div>
      </div>
    </nav>
    <div class="user-actions">
      <button on:click={handleLogout}>Logout ({username})</button>
    </div>
  </header>

  <div class="content-area">
    {#if leftSidebarVisible}
      <LeftSidebar {svgElements} {loading} {error} onHide={toggleLeftSidebar} />
    {/if}

    <main id="main-content" class="canvas-container">
      <div bind:this={graphContainer} class="graph-container"></div>
      <div class="zoom-controls">
        <button on:click={zoomIn}>Zoom In</button>
        <button on:click={zoomOut}>Zoom Out</button>
        <button on:click={resetZoom}>Reset Zoom</button>
      </div>
    </main>

    {#if rightSidebarVisible}
      <RightSidebar 
        onHide={toggleRightSidebar}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onResetZoom={resetZoom}
        {graph}
      />
    {/if}
  </div>
</div>

<style>
  .app-header {
    background-color: rgb(0, 32, 192);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    height: 48px;
  }

  .app-title {
    font-weight: bold;
  }

  nav {
    display: flex;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropbtn {
    background-color: transparent;
    color: white;
    border: none;
    cursor: pointer;
    padding: 0.5rem 1rem;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    background-color: rgb(0, 24, 144);
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
  }

  .dropdown-content a {
    color: white;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .content-area {
    display: flex;
    height: calc(100vh - 48px);
  }

  .canvas-container {
    flex: 1;
    position: relative;
    background-color: #f0f0f0;
    background-image:
      linear-gradient(to right, #e0e0e0 1px, transparent 1px),
      linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
    background-size: 20px 20px;
  }

  .graph-container {
    width: 100%;
    height: 100%;
  }

  .zoom-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
  }

  .zoom-controls button {
    background-color: white;
    border: 1px solid #ccc;
    padding: 5px 10px;
    cursor: pointer;
  }
</style>

