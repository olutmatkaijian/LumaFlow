import type { GraphConfig } from '@maxgraph/core';

export const defaultGraphConfig: GraphConfig = {
  // Enable basic interaction features
  movable: true,
  resizable: true,
  rotatable: true,
  editable: true,
  bendable: true,
  connectable: true,
  deletable: true,
  
  // Default styles
  defaultVertexStyle: {
    fillColor: '#ffffff',
    strokeColor: '#000000',
    fontColor: '#000000',
    strokeWidth: 1
  },
  
  // Grid settings
  grid: {
    enabled: true,
    size: 10,
    color: '#e0e0e0'
  },
  
  // Connection points
  connectionPoints: {
    enabled: true,
    number: 4 // North, East, South, West
  },
  
  // Guidelines for alignment
  guides: {
    enabled: true
  }
};

export const lockedStyle = {
  fillColor: '#f0f0f0',
  strokeColor: '#a0a0a0',
  fontColor: '#666666'
};

