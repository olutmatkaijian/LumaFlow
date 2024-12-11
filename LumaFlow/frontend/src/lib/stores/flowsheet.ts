import { writable } from 'svelte/store';

export interface Node {
  id: string;
  type: string;
  name: string;
  script: string;
  properties: Record<string, any>;
}

interface FlowsheetStore {
  selectedNode: Node | null;
}

const createFlowsheetStore = () => {
  const { subscribe, set, update } = writable<FlowsheetStore>({
    selectedNode: null,
  });

  return {
    subscribe,
    setSelectedNode: (node: Node) => update(store => ({ ...store, selectedNode: node })),
    clearSelectedNode: () => update(store => ({ ...store, selectedNode: null })),
    updateSelectedNodeProperty: (key: string, value: any) => update(store => {
      if (store.selectedNode) {
        const updatedNode = { ...store.selectedNode };
        if (key === 'name' || key === 'script') {
          updatedNode[key] = value;
        } else {
          updatedNode.properties[key] = value;
        }
        return { ...store, selectedNode: updatedNode };
      }
      return store;
    }),
  };
};

export const flowsheetStore = createFlowsheetStore();

