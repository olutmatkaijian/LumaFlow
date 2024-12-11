import { Graph, Cell, Point, Geometry } from '@maxgraph/core';
import { FLASK_SERVER_URL } from '../config';

export function initGraph(graphContainer: HTMLElement): Graph | null {
  if (!graphContainer) return null;

  try {
    const graph = new Graph(graphContainer);
    
    // Core functionality
    graph.setEnabled(true);
    graph.setConnectable(true);
    graph.setAllowDanglingEdges(false);
    graph.setAutoSizeCells(true);
    graph.setAllowLoops(false);
    
    // Enable panning and basic interactions
    graph.setPanning(true);
    graph.setTooltips(true);
    graph.setConnectableEdges(false);
    graph.setDisconnectOnMove(false);
    
    // Set grid properties
    graph.setGridEnabled(true);
    graph.setGridSize(20);
    //graph.setSnapToGrid(true);
    
    // Set default styles
    const style = graph.getStylesheet().getDefaultVertexStyle();
    style['strokeColor'] = '#333333';
    style['strokeWidth'] = '2';
    style['fillColor'] = '#ffffff';
    style['fontColor'] = '#333333';
    style['fontSize'] = '12';
    style['fontFamily'] = 'Arial';
    style['align'] = 'center';
    style['verticalAlign'] = 'middle';
    style['rounded'] = '1';
    
    // Edge style
    const edgeStyle = graph.getStylesheet().getDefaultEdgeStyle();
    edgeStyle['strokeColor'] = '#333333';
    edgeStyle['strokeWidth'] = '2';
    edgeStyle['rounded'] = '1';
    edgeStyle['edgeStyle'] = 'orthogonalEdgeStyle';
    
    // Register custom shapes and markers
    // registerCustomShapes(graph);
    
    // Set up event handlers
    graph.addMouseListener({
      mouseDown: (sender: Graph, evt: any) => {
        if (!graph.isEnabled()) {
          return;
        }
        graphContainer.style.cursor = 'move';
      },
      mouseMove: (sender: Graph, evt: any) => {
        // Handle mouse move if needed
      },
      mouseUp: (sender: Graph, evt: any) => {
        graphContainer.style.cursor = 'default';
      }
    });

    // Handle drops
    graphContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
    });

    graphContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      const data = e.dataTransfer?.getData('application/json');
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          const rect = graphContainer.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          createNode(graph, parsedData, x, y);
        } catch (err) {
          console.error('Failed to parse drop data:', err);
        }
      }
    });

    return graph;
  } catch (error) {
    console.error('Error initializing graph:', error);
    return null;
  }
}

function registerCustomShapes(graph: Graph) {
  // Register stream shape
  graph.registerShape('stream', {
    draw: function(c: any, x: number, y: number, w: number, h: number) {
      c.begin();
      c.moveTo(x, y + h/2);
      c.lineTo(x + w - 10, y + h/2);
      c.lineTo(x + w, y + h/2);
      c.stroke();
      
      // Draw arrow
      c.begin();
      c.moveTo(x + w, y + h/2);
      c.lineTo(x + w - 10, y + h/2 - 5);
      c.lineTo(x + w - 10, y + h/2 + 5);
      c.close();
      c.fillAndStroke();
    }
  });
}

export function addConnectionPoints(graph: Graph, cell: Cell) {
  if (!cell.geometry) return;
  
  const points = [
    new Point(0, 0.5),   // Left
    new Point(1, 0.5),   // Right
    new Point(0.5, 0),   // Top
    new Point(0.5, 1)    // Bottom
  ];
  
  cell.setConnectable(true);
  cell.geometry.points = points;
}

export function createStreamEdge(graph: Graph, startX: number, startY: number) {
  const streamName = prompt('Enter stream name:');
  if (streamName === null) return;

  graph.model.beginUpdate();
  try {
    const parent = graph.getDefaultParent();
    const edge = graph.insertEdge(
      parent,
      null,
      streamName,
      null,
      null,
      'edgeStyle=orthogonalEdgeStyle;html=1;rounded=0;exitX=1;exitY=0.5;exitDx=0;exitDy=0;entryX=0;entryY=0.5;entryDx=0;entryDy=0;'
    );
    
    const sourceGeometry = new Geometry(startX, startY, 0, 0);
    sourceGeometry.offset = new Point(-5, -5);
    edge.geometry.setTerminalPoint(new Point(startX, startY), true);
    
    const targetGeometry = new Geometry(startX + 100, startY, 0, 0);
    targetGeometry.offset = new Point(-5, -5);
    edge.geometry.setTerminalPoint(new Point(startX + 100, startY), false);

    graph.setSelectionCell(edge);
  } finally {
    graph.model.endUpdate();
  }
}

export function createNode(graph: Graph, data: { name: string, category: string, svg: string }, x: number, y: number) {
  if (!graph) return;

  graph.model.beginUpdate();
  try {
    const style = {
      shape: 'image',
      image: `${FLASK_SERVER_URL}/svg/${data.category}/${data.name}.svg`,
      imageWidth: 80,
      imageHeight: 80,
      resizable: true,
      movable: true,
      rotatable: false,
      strokeColor: '#333333',
      strokeWidth: 2
    };
    
    const vertex = graph.insertVertex(
      graph.getDefaultParent(),
      null,
      data.name,
      x,
      y,
      80,
      80,
      Object.entries(style).map(([key, value]) => `${key}=${value}`).join(';')
    );
    
    addConnectionPoints(graph, vertex);
    graph.setSelectionCell(vertex);
  } finally {
    graph.model.endUpdate();
  }
}

export function getGraphContent(graph: Graph) {
  if (!graph) return null;

  const elements: any[] = [];
  const connections: any[] = [];
  const cells = graph.model.cells;

  for (const cellId in cells) {
    const cell = cells[cellId];
    if (!cell || cell.id == null) continue;

    if (cell.isVertex()) {
      elements.push({
        id: cell.id.toString(),
        label: cell.value || '',
        x: cell.geometry?.x || 0,
        y: cell.geometry?.y || 0,
        width: cell.geometry?.width || 0,
        height: cell.geometry?.height || 0,
        style: cell.style
      });
    } else if (cell.isEdge()) {
      connections.push({
        id: cell.id.toString(),
        source: cell.source?.id?.toString() || '',
        target: cell.target?.id?.toString() || '',
        label: cell.value || '',
        style: cell.style
      });
    }
  }

  return { elements, connections };
}

export function applyElementChanges(graph: Graph, elementId: string, changes: any) {
  const cell = graph.model.getCell(elementId);
  if (!cell) return;

  graph.model.beginUpdate();
  try {
    if (changes.position && cell.geometry) {
      const geo = cell.geometry.clone();
      geo.x = changes.position.x;
      geo.y = changes.position.y;
      graph.model.setGeometry(cell, geo);
    }
    
    if (changes.size && cell.geometry) {
      const geo = cell.geometry.clone();
      geo.width = changes.size.width;
      geo.height = changes.size.height;
      graph.model.setGeometry(cell, geo);
    }
    
    if (changes.style) {
      const newStyle = { ...JSON.parse(cell.style), ...changes.style };
      graph.model.setStyle(cell, JSON.stringify(newStyle));
    }
    
    if (changes.value !== undefined) {
      graph.model.setValue(cell, changes.value);
    }
  } finally {
    graph.model.endUpdate();
  }
}

