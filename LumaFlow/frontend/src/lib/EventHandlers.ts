import { Graph, Cell } from '@maxgraph/core';
import { FLASK_SERVER_URL } from '../config';
import { addConnectionPoints, createStreamEdge } from './GraphLogic';
import { setupGraphListeners } from './SocketLogic';
export function handleMouseMove(event: MouseEvent, socket: any, graphContainer: HTMLElement) {
  if (socket && graphContainer) {
    const rect = graphContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    socket.emit('cursor_move', { x, y });
  }
}

export function handleKeyDown(event: KeyboardEvent, graph: Graph, lockedElements: Set<string>) {
  if (event.key === 'Delete' && graph) {
    const cell = graph.getSelectionCell();
    if (cell && !lockedElements.has(cell.id)) {
      graph.removeCells([cell]);
    }
  }
}

export function setupGraphSelectionListener(graph: Graph, onCellSelected: (properties: any) => void) {
    graph.getSelectionModel().addListener(Event.CHANGE, (sender, evt) => {
      const cells = graph.getSelectionCells();
      if (cells.length === 1) {
        const cell = cells[0];
        const properties = getCellProperties(cell);
        onCellSelected(properties);
      } else {
        onCellSelected(null);
      }
    });
  }
  function getCellProperties(cell: Cell) {
    const properties: any = {
      id: cell.id,
      type: cell.isVertex() ? 'Node' : 'Edge',
      value: cell.value,
    };
  
    if (cell.isVertex()) {
      properties.x = cell.geometry.x;
      properties.y = cell.geometry.y;
      properties.width = cell.geometry.width;
      properties.height = cell.geometry.height;
    } else if (cell.isEdge()) {
      properties.source = cell.source ? cell.source.id : 'none';
      properties.target = cell.target ? cell.target.id : 'none';
    }
  
    // Add any custom properties from cell.data if it exists
    if (cell.data) {
      Object.assign(properties, cell.data);
    }
  
    return properties;
  }
export function handleUndoChange(graph: Graph, undoStack: any[], redoStack: any[]): { undoStack: any[], redoStack: any[] } {
  if (undoStack.length > 0) {
    const edit = undoStack.pop();
    graph.model.beginUpdate();
    try {
      edit.undo();
    } finally {
      graph.model.endUpdate();
    }
    redoStack.push(edit);
  }
  return { undoStack, redoStack };
}

export async function fetchSvgContent(category: string, name: string): Promise<string> {
  const response = await fetch(`${FLASK_SERVER_URL}/svg/${category}/${name}.svg`);
  if (!response.ok) {
    throw new Error(`Failed to fetch SVG: ${response.statusText}`);
  }
  return await response.text();
}

export function handleDrop(event: DragEvent, graph: Graph, fetchSvgContent: (category: string, name: string) => Promise<string>) {
    event.preventDefault();
    if (!graph || !event.dataTransfer) return;
  
    const data = JSON.parse(event.dataTransfer.getData('application/json'));
    const { offsetX, offsetY } = event;
    if (data.name === 'Stream') {
      createStreamEdge(graph, offsetX, offsetY);
    } else {
      fetchSvgContent(data.category, data.name)
        .then((svgContent) => {
          graph.model.beginUpdate();
          try {
            const image_data = {
              shape: 'image',
              image: `${FLASK_SERVER_URL}/svg/${data.category}/${data.name}.svg`
            }
            const cell = graph.insertVertex(
              graph.getDefaultParent(),
              null,
              data.name,
              offsetX,
              offsetY,
              80,
              80,
              image_data
            );
            addConnectionPoints(graph, cell);
            graph.setSelectionCell(cell);
          } finally {
            graph.model.endUpdate();
          }
        })
        .catch((error) => {
          console.error('Error fetching SVG content:', error);
        });
    }
  }

