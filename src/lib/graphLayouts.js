/**
 * Graph Layout Algorithms for Network Topology Visualization
 * Provides different layout options for D3.js force-directed graphs
 */

import * as d3 from 'd3'

/**
 * Force-Directed Layout (Default)
 * Uses D3's force simulation for organic layout
 */
export const createForceLayout = (nodes, edges, width, height) => {
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(100)
      .strength(0.5))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(40))
}

/**
 * Hierarchical Layout
 * Arranges nodes in a tree-like structure based on node types
 */
export const createHierarchicalLayout = (nodes, edges, width, height) => {
  const nodeTypes = [...new Set(nodes.map(n => n.type))]
  const typeIndex = {}
  nodeTypes.forEach((type, i) => {
    typeIndex[type] = i
  })

  // Position nodes by type in vertical layers
  const nodesPerType = {}
  nodes.forEach(node => {
    if (!nodesPerType[node.type]) nodesPerType[node.type] = []
    nodesPerType[node.type].push(node)
  })

  const layerHeight = height / nodeTypes.length
  let nodeIndex = 0

  nodes.forEach(node => {
    const typeIdx = typeIndex[node.type]
    const typeNodes = nodesPerType[node.type]
    const nodeInTypeIdx = typeNodes.indexOf(node)
    const nodesInType = typeNodes.length

    node.x = (width / (nodesInType + 1)) * (nodeInTypeIdx + 1)
    node.y = layerHeight * typeIdx + layerHeight / 2
    node.fx = node.x
    node.fy = node.y
  })

  // Create a weak simulation for smooth transitions
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(80)
      .strength(0.1))
    .force('charge', d3.forceManyBody().strength(-50))
    .alpha(0.3)
}

/**
 * Circular Layout
 * Arranges nodes in a circle
 */
export const createCircularLayout = (nodes, edges, width, height) => {
  const radius = Math.min(width, height) / 3
  const centerX = width / 2
  const centerY = height / 2
  const angleSlice = (Math.PI * 2) / nodes.length

  nodes.forEach((node, i) => {
    const angle = angleSlice * i
    node.x = centerX + radius * Math.cos(angle)
    node.y = centerY + radius * Math.sin(angle)
    node.fx = node.x
    node.fy = node.y
  })

  // Minimal simulation for stability
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(100)
      .strength(0.1))
    .force('charge', d3.forceManyBody().strength(-100))
    .alpha(0.1)
}

/**
 * Grid Layout
 * Arranges nodes in a structured grid pattern
 */
export const createGridLayout = (nodes, edges, width, height) => {
  const cols = Math.ceil(Math.sqrt(nodes.length))
  const rows = Math.ceil(nodes.length / cols)
  const cellWidth = width / (cols + 1)
  const cellHeight = height / (rows + 1)

  nodes.forEach((node, i) => {
    const row = Math.floor(i / cols)
    const col = i % cols
    node.x = cellWidth * (col + 1)
    node.y = cellHeight * (row + 1)
    node.fx = node.x
    node.fy = node.y
  })

  // Minimal simulation
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(100)
      .strength(0.05))
    .force('charge', d3.forceManyBody().strength(-50))
    .alpha(0.05)
}

/**
 * Radial Layout
 * Arranges nodes radiating from a central node
 */
export const createRadialLayout = (nodes, edges, width, height) => {
  if (nodes.length === 0) return d3.forceSimulation(nodes)

  // Find central node (data center or first node)
  let centralNode = nodes.find(n => n.type === 'data_center') || nodes[0]
  const centerX = width / 2
  const centerY = height / 2

  // Position central node at center
  centralNode.x = centerX
  centralNode.y = centerY
  centralNode.fx = centerX
  centralNode.fy = centerY

  // Position other nodes in concentric circles
  const otherNodes = nodes.filter(n => n.id !== centralNode.id)
  const nodesPerRing = Math.ceil(Math.sqrt(otherNodes.length))
  const maxRadius = Math.min(width, height) / 2.5

  otherNodes.forEach((node, i) => {
    const ring = Math.floor(i / nodesPerRing)
    const posInRing = i % nodesPerRing
    const radius = (ring + 1) * (maxRadius / Math.ceil(otherNodes.length / nodesPerRing))
    const angle = (Math.PI * 2 * posInRing) / nodesPerRing

    node.x = centerX + radius * Math.cos(angle)
    node.y = centerY + radius * Math.sin(angle)
    node.fx = node.x
    node.fy = node.y
  })

  // Simulation with constraints
  return d3.forceSimulation(nodes)
    .force('link', d3.forceLink(edges)
      .id(d => d.id)
      .distance(100)
      .strength(0.1))
    .force('charge', d3.forceManyBody().strength(-100))
    .alpha(0.2)
}

/**
 * Layout configuration
 */
export const LAYOUT_OPTIONS = {
  force: {
    name: 'Force-Directed',
    description: 'Organic layout with physics simulation',
    create: createForceLayout
  },
  hierarchical: {
    name: 'Hierarchical',
    description: 'Tree-like structure by node type',
    create: createHierarchicalLayout
  },
  circular: {
    name: 'Circular',
    description: 'Nodes arranged in a circle',
    create: createCircularLayout
  },
  grid: {
    name: 'Grid',
    description: 'Structured grid pattern',
    create: createGridLayout
  },
  radial: {
    name: 'Radial',
    description: 'Radiating from central node',
    create: createRadialLayout
  }
}

export default {
  createForceLayout,
  createHierarchicalLayout,
  createCircularLayout,
  createGridLayout,
  createRadialLayout,
  LAYOUT_OPTIONS
}

