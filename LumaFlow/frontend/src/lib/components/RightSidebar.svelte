<script lang="ts">
import { Accordion, AccordionItem, Button, TextInput, Toggle } from "carbon-components-svelte";
import { ChevronRight } from "carbon-icons-svelte";
import { onMount } from 'svelte';
import CodeEditor from './editor/CodeEditor.svelte';
import Terminal from './terminal/Terminal.svelte';
import DocumentationViewer from './docs/DocumentationViewer.svelte';
import { flowsheetStore } from '../stores/flowsheet';
import ObjectInspector from './inspector/ObjectInspector.svelte';

export let onHide: () => void;

let showFullSidebar = true;
let selectedNodeScript = '';
let documentationQuery = '';
let terminalOutput: string[] = [];

$: if ($flowsheetStore.selectedNode) {
    loadNodeScript($flowsheetStore.selectedNode.id);
}

async function loadNodeScript(nodeId: string) {
    try {
        const response = await fetch(`/api/nodes/${nodeId}/script`);
        if (response.ok) {
            selectedNodeScript = await response.text();
        }
    } catch (error) {
        console.error('Failed to load node script:', error);
    }
}

async function saveNodeScript() {
    if (!$flowsheetStore.selectedNode) return;
    
    try {
        await fetch(`/api/nodes/${$flowsheetStore.selectedNode.id}/script`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: selectedNodeScript
        });
    } catch (error) {
        console.error('Failed to save node script:', error);
    }
}

async function executeScript() {
    if (!$flowsheetStore.selectedNode) return;
    
    try {
        const response = await fetch(`/api/nodes/${$flowsheetStore.selectedNode.id}/execute`, {
            method: 'POST'
        });
        const result = await response.text();
        terminalOutput = [...terminalOutput, result];
    } catch (error) {
        console.error('Failed to execute script:', error);
        terminalOutput = [...terminalOutput, `Error: ${error.message}`];
    }
}

async function searchDocumentation() {
    // This would connect to your LLM-powered documentation search
    // For now, we'll just add a placeholder
    console.log('Searching documentation for:', documentationQuery);
}
</script>

<aside class="right-sidebar">
    <div class="sidebar-header">
        <h2>Development Tools</h2>
        <Button kind="ghost" icon={ChevronRight} iconDescription="Hide Sidebar" on:click={onHide} />
    </div>

    <div class="sidebar-toggle">
        <Toggle
            labelText="Show development tools"
            bind:toggled={showFullSidebar}
        />
    </div>

    <Accordion>
  {#if !showFullSidebar}
    <AccordionItem title="Script Editor" open>
      <div class="editor-container">
        <div class="editor-header">
          <span>{$flowsheetStore.selectedNode ? `${$flowsheetStore.selectedNode.type}.py` : 'No component selected'}</span>
          <div class="editor-actions">
            <Button size="small" on:click={saveNodeScript}>Save</Button>
            <Button size="small" on:click={executeScript}>Run</Button>
          </div>
        </div>
        <CodeEditor 
          bind:value={selectedNodeScript}
          language="python"
          theme="vs-dark"
          readonly={!$flowsheetStore.selectedNode}
        />
      </div>
    </AccordionItem>

    <AccordionItem title="Terminal">
      <Terminal 
        messages={terminalOutput}
        onCommand={(cmd) => {
          terminalOutput = [...terminalOutput, `$ ${cmd}`];
        }}
      />
    </AccordionItem>
  {/if}

  <AccordionItem title="Object Inspector" open>
    <ObjectInspector />
  </AccordionItem>

  <AccordionItem title="Documentation">
    <div class="documentation-container">
      <div class="documentation-search">
        <TextInput 
          placeholder="Search documentation..."
          bind:value={documentationQuery}
          on:keydown={(e) => {
            if (e.key === 'Enter') searchDocumentation();
          }}
        />
      </div>
      <DocumentationViewer query={documentationQuery} />
    </div>
  </AccordionItem>
</Accordion>
</aside>

<style>
.right-sidebar {
    width: 400px;
    background-color: rgb(0, 32, 192);
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    height: 100%;
    color: white;
}

.sidebar-header {
    padding: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgb(0, 24, 144);
}

.sidebar-header h2 {
    font-size: 1rem;
    font-weight: normal;
    margin: 0;
}

.editor-container {
    height: 400px;
    display: flex;
    flex-direction: column;
    background-color: rgb(18, 18, 18);
}

:global(.bx--accordion__item) {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

:global(.bx--accordion__heading) {
    background-color: rgb(0, 24, 144);
    color: white;
}

:global(.bx--accordion__content) {
    padding: 0;
    background-color: rgb(0, 32, 192);
}

.editor-actions {
    display: flex;
    gap: var(--cds-spacing-03);
}

.documentation-container {
    display: flex;
    flex-direction: column;
    height: 300px;
}

.documentation-search {
    padding: var(--cds-spacing-03);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-toggle {
  padding: var(--cds-spacing-05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

