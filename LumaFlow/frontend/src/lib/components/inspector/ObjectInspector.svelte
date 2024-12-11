<script lang="ts">
import { DataTable, TextInput, NumberInput, Select, SelectItem } from "carbon-components-svelte";
import { flowsheetStore } from '../../stores/flowsheet';

export let graph: any;

let properties = [];

$: if ($flowsheetStore.selectedNode) {
  properties = [
    { id: 'name', key: 'Name', value: $flowsheetStore.selectedNode.name, type: 'string' },
    { id: 'script', key: 'Script', value: $flowsheetStore.selectedNode.script, type: 'string' },
    ...Object.entries($flowsheetStore.selectedNode.properties).map(([key, value]) => ({
      id: key,
      key,
      value,
      type: typeof value
    }))
  ];
} else {
  properties = [];
}

function updateProperty(key: string, value: any) {
  if ($flowsheetStore.selectedNode) {
    const updatedNode = { ...$flowsheetStore.selectedNode };
    if (key === 'name' || key === 'script') {
      updatedNode[key] = value;
    } else {
      updatedNode.properties[key] = value;
    }
    flowsheetStore.setSelectedNode(updatedNode);
    
    // Update the graph
    if (graph) {
      const cell = graph.getModel().getCell($flowsheetStore.selectedNode.id);
      if (cell) {
        graph.getModel().beginUpdate();
        try {
          if (key === 'name') {
            graph.getModel().setValue(cell, value);
          } else if (key === 'script') {
            cell.script = value;
          } else {
            graph.getModel().setValue(cell, {
              ...cell.value,
              [key]: value
            });
          }
        } finally {
          graph.getModel().endUpdate();
        }
      }
    }
  }
}

function renderEditableCell(row) {
  if (!row) return null;
  const { id, value, type } = row;
  switch (type) {
    case 'number':
      return NumberInput({
        id: `property-${id}`,
        value: value ?? 0,
        onChange: (event) => updateProperty(id, parseFloat(event.target.value))
      });
    case 'boolean':
      return Select({
        id: `property-${id}`,
        selected: (value ?? false).toString(),
        onChange: (event) => updateProperty(id, event.detail === 'true'),
        items: [
          { value: 'true', text: 'True' },
          { value: 'false', text: 'False' }
        ]
      });
    default:
      return TextInput({
        id: `property-${id}`,
        value: (value ?? '').toString(),
        onChange: (event) => updateProperty(id, event.target.value)
      });
  }
}
</script>

<div class="object-inspector">
  {#if $flowsheetStore.selectedNode}
    <h3>{$flowsheetStore.selectedNode.type} Properties</h3>
    <DataTable
      headers={[
        { key: 'key', value: 'Property' },
        { key: 'value', value: 'Value' }
      ]}
      rows={properties}
    >
      <svelte:fragment slot="cell" let:row let:cell>
        {#if cell && row}
          {#if cell.key === 'value'}
            {renderEditableCell(row)}
          {:else}
            {cell.value ?? ''}
          {/if}
        {/if}
      </svelte:fragment>
    </DataTable>
  {:else}
    <p>No object selected</p>
  {/if}
</div>

<style>
.object-inspector {
  padding: var(--cds-spacing-05);
}

h3 {
  margin-bottom: var(--cds-spacing-05);
}
</style>

