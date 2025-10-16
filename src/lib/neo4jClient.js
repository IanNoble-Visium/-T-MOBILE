/**
 * Neo4j API Client
 * Handles all communication with the Neo4j backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * Normalize node data from Neo4j to match frontend schema
 * @param {object} node - Raw node from Neo4j
 * @returns {object} Normalized node
 */
function normalizeNode(node) {
  return {
    id: node.id,
    name: node.name,
    type: node.type,
    status: node.status,
    region: node.region,
    capacity: node.capacity || 0,
    vendor: node.vendor,
    model: node.model,
    uptime: node.uptime || 0,
    coverage_radius: node.coverage_radius || 0,
    location: {
      lat: node.latitude || 0,
      lon: node.longitude || 0,
      city: node.location || 'Unknown'
    },
    alarmIds: node.alarmIds || []
  };
}

/**
 * Normalize edge data from Neo4j to match frontend schema
 * @param {object} edge - Raw edge from Neo4j
 * @returns {object} Normalized edge
 */
function normalizeEdge(edge) {
  return {
    id: edge.id,
    source: edge.source,
    target: edge.target,
    type: edge.type,
    bandwidth: edge.bandwidth || 0,
    latency: edge.latency || 0,
    utilization: edge.utilization || 0,
    status: edge.status,
    alarmIds: edge.alarmIds || []
  };
}

/**
 * Fetch nodes from Neo4j
 * @returns {Promise<array>} Array of nodes
 */
export async function fetchNodes() {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const nodes = result.data || [];
    return nodes.map(normalizeNode);
  } catch (error) {
    console.error('Error fetching nodes from Neo4j:', error);
    throw error;
  }
}

/**
 * Fetch node by ID
 * @param {string} id - Node ID
 * @returns {Promise<object>} Node object
 */
export async function fetchNodeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching node ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch nodes by type
 * @param {string} type - Node type
 * @returns {Promise<array>} Array of nodes
 */
export async function fetchNodesByType(type) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes/type/${type}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching nodes by type ${type}:`, error);
    throw error;
  }
}

/**
 * Fetch nodes by region
 * @param {string} region - Region name
 * @returns {Promise<array>} Array of nodes
 */
export async function fetchNodesByRegion(region) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes/region/${region}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching nodes by region ${region}:`, error);
    throw error;
  }
}

/**
 * Create a new node
 * @param {object} nodeData - Node data
 * @returns {Promise<object>} Created node
 */
export async function createNode(nodeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nodeData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating node:', error);
    throw error;
  }
}

/**
 * Update a node
 * @param {string} id - Node ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated node
 */
export async function updateNode(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating node ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a node
 * @param {string} id - Node ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteNode(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error(`Error deleting node ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch all edges
 * @returns {Promise<array>} Array of edges
 */
export async function fetchEdges() {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/edges`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    const edges = result.data || [];
    return edges.map(normalizeEdge);
  } catch (error) {
    console.error('Error fetching edges from Neo4j:', error);
    throw error;
  }
}

/**
 * Fetch edge by ID
 * @param {string} id - Edge ID
 * @returns {Promise<object>} Edge object
 */
export async function fetchEdgeById(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/edges/${id}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error fetching edge ${id}:`, error);
    throw error;
  }
}

/**
 * Fetch edges for a node
 * @param {string} nodeId - Node ID
 * @returns {Promise<array>} Array of edges
 */
export async function fetchEdgesForNode(nodeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/nodes/${nodeId}/edges`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error(`Error fetching edges for node ${nodeId}:`, error);
    throw error;
  }
}

/**
 * Create a new edge
 * @param {object} edgeData - Edge data
 * @returns {Promise<object>} Created edge
 */
export async function createEdge(edgeData) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/edges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(edgeData)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error creating edge:', error);
    throw error;
  }
}

/**
 * Update an edge
 * @param {string} id - Edge ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object>} Updated edge
 */
export async function updateEdge(id, updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/edges/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Error updating edge ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an edge
 * @param {string} id - Edge ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteEdge(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/edges/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error(`Error deleting edge ${id}:`, error);
    throw error;
  }
}

/**
 * Seed database with data
 * @param {object} data - Nodes and edges data
 * @returns {Promise<object>} Seed result
 */
export async function seedDatabase(data) {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/seed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

/**
 * Export all data from Neo4j
 * @returns {Promise<object>} Exported data
 */
export async function exportData() {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/export`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
}

/**
 * Get database statistics
 * @returns {Promise<object>} Statistics
 */
export async function getStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/stats`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching statistics:', error);
    throw error;
  }
}

/**
 * Clear all data from Neo4j
 * @returns {Promise<boolean>} Success status
 */
export async function clearDatabase() {
  try {
    const response = await fetch(`${API_BASE_URL}/network-topology/clear`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return true;
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

export default {
  fetchNodes,
  fetchNodeById,
  fetchNodesByType,
  fetchNodesByRegion,
  createNode,
  updateNode,
  deleteNode,
  fetchEdges,
  fetchEdgeById,
  fetchEdgesForNode,
  createEdge,
  updateEdge,
  deleteEdge,
  seedDatabase,
  exportData,
  getStatistics,
  clearDatabase,
};

