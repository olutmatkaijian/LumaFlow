import { io, Socket } from 'socket.io-client';
import type { Graph } from '@maxgraph/core';
import { applyElementChanges, addConnectionPoints } from './GraphLogic';

export function initSocket(url: string, flowsheetId: string, graph: Graph, updateLockedElements: () => void): Socket {
  const socket = io(url, {
    transports: ['websocket'],
    withCredentials: true
  });

  socket.on('connect', () => {
    console.log('Connected to WebSocket server');
    socket.emit('join_flowsheet', { flowsheet_id: flowsheetId });
  });

  socket.on('connect_error', (error) => {
    console.error('WebSocket connection error:', error);
  });

  socket.on('user_connected', (data) => {
    console.log('User connected:', data.user_id);
  });

  socket.on('user_disconnected', (data) => {
    console.log('User disconnected:', data.user_id);
    updateLockedElements();
  });

  socket.on('cursor_update', (data) => {
    // This will be handled in the CanvasArea component
  });

  socket.on('selection_update', (data) => {
    // This will be handled in the CanvasArea component
    updateLockedElements();
  });

  socket.on('element_modified', (data) => {
    applyElementChanges(graph, data.element_id, data.changes);
  });

  return socket;
}

export function emitCursorMove(socket: Socket, x: number, y: number) {
  socket.emit('cursor_move', { x, y });
}

export function emitElementSelect(socket: Socket, elementId: string | null) {
  if (elementId) {
    socket.emit('element_select', { element_id: elementId });
  } else {
    socket.emit('element_deselect');
  }
}

export function emitElementModify(socket: Socket, elementId: string, changes: any) {
  socket.emit('element_modify', { element_id: elementId, changes });
}

export function emitElementConnect(socket: Socket, edgeId: string, sourceId: string, targetId: string) {
  socket.emit('element_connect', { edge_id: edgeId, source_id: sourceId, target_id: targetId });
}

export function setupGraphListeners(graph: Graph, socket: Socket) {
  graph.model.addListener('change', (sender, evt) => {
    const edit = evt.getProperty('edit');
    // Handle undo/redo stack updates here if needed
  });

  graph.addListener('add', (sender, evt) => {
    const cells = evt.getProperty('cells');
    cells.forEach((cell) => {
      if (cell.isVertex()) {
        addConnectionPoints(graph, cell);
      }
    });
  });

  graph.addListener('connect', (sender, evt) => {
    const edge = evt.getProperty('cell');
    const source = edge.getTerminal(true);
    const target = edge.getTerminal(false);
    
    if (source && target) {
      socket.emit('element_connect', {
        edge_id: edge.id,
        source_id: source.id,
        target_id: target.id
      });
    }
  });

  graph.addListener('move', (sender, evt) => {
    const cells = evt.getProperty('cells');
    cells.forEach((cell) => {
      if (cell.isVertex()) {
        socket.emit('element_modify', {
          element_id: cell.id,
          changes: {
            position: {
              x: cell.geometry.x,
              y: cell.geometry.y
            }
          }
        });
      }
    });
  });

  graph.addListener('resize', (sender, evt) => {
    const cells = evt.getProperty('cells');
    cells.forEach((cell) => {
      if (cell.isVertex()) {
        socket.emit('element_modify', {
          element_id: cell.id,
          changes: {
            size: {
              width: cell.geometry.width,
              height: cell.geometry.height
            }
          }
        });
      }
    });
  });

  graph.selectionModel.addListener('change', (sender, evt) => {
    const cell = graph.getSelectionCell();
    socket.emit('element_select', { element_id: cell ? cell.id : null });
  });
}

