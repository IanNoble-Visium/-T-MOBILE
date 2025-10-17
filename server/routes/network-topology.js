import express from 'express';
import { executeQuery, executeTransaction } from '../db/neo4j.js';
import { NODE_QUERIES, EDGE_QUERIES, BATCH_QUERIES } from '../services/neo4j-queries.js';

const router = express.Router();

/**
 * Convert Neo4j integer to JavaScript number
 * Neo4j returns integers as {low: number, high: number}
 */
function toNumber(value) {
  if (typeof value === 'object' && value.low !== undefined) {
    return value.low;
  }
  return value || 0;
}

// ============================================================================
// NODE ENDPOINTS
// ============================================================================

// GET all nodes
router.get('/nodes', async (req, res) => {
  try {
    const results = await executeQuery(NODE_QUERIES.GET_ALL_NODES);
    const nodes = results.map(r => r.n.properties);
    res.json({ success: true, data: nodes, count: nodes.length });
  } catch (error) {
    console.error('Error fetching nodes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET node by ID
router.get('/nodes/:id', async (req, res) => {
  try {
    const results = await executeQuery(NODE_QUERIES.GET_NODE_BY_ID, { id: req.params.id });
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Node not found' });
    }
    res.json({ success: true, data: results[0].n.properties });
  } catch (error) {
    console.error('Error fetching node:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET nodes by type
router.get('/nodes/type/:type', async (req, res) => {
  try {
    const results = await executeQuery(NODE_QUERIES.GET_NODES_BY_TYPE, { type: req.params.type });
    const nodes = results.map(r => r.n.properties);
    res.json({ success: true, data: nodes, count: nodes.length });
  } catch (error) {
    console.error('Error fetching nodes by type:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET nodes by region
router.get('/nodes/region/:region', async (req, res) => {
  try {
    const results = await executeQuery(NODE_QUERIES.GET_NODES_BY_REGION, { region: req.params.region });
    const nodes = results.map(r => r.n.properties);
    res.json({ success: true, data: nodes, count: nodes.length });
  } catch (error) {
    console.error('Error fetching nodes by region:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create node
router.post('/nodes', async (req, res) => {
  try {
    const { id, name, type, status, location, region, capacity, vendor, model, uptime, coverage_radius, latitude, longitude } = req.body;
    
    if (!id || !name || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields: id, name, type' });
    }

    const results = await executeQuery(NODE_QUERIES.CREATE_NODE, {
      id, name, type, status, location, region, capacity, vendor, model, uptime, coverage_radius, latitude, longitude
    });

    res.status(201).json({ success: true, data: results[0].n.properties });
  } catch (error) {
    console.error('Error creating node:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update node
router.put('/nodes/:id', async (req, res) => {
  try {
    const { name, status, capacity, uptime } = req.body;
    const results = await executeQuery(NODE_QUERIES.UPDATE_NODE, {
      id: req.params.id,
      name,
      status,
      capacity,
      uptime
    });

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Node not found' });
    }

    res.json({ success: true, data: results[0].n.properties });
  } catch (error) {
    console.error('Error updating node:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE node
router.delete('/nodes/:id', async (req, res) => {
  try {
    const results = await executeQuery(NODE_QUERIES.DELETE_NODE, { id: req.params.id });
    res.json({ success: true, message: 'Node deleted successfully' });
  } catch (error) {
    console.error('Error deleting node:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// EDGE ENDPOINTS
// ============================================================================

// GET all edges
router.get('/edges', async (req, res) => {
  try {
    const results = await executeQuery(EDGE_QUERIES.GET_ALL_EDGES);
    const edges = results.map(r => r.edge);
    res.json({ success: true, data: edges, count: edges.length });
  } catch (error) {
    console.error('Error fetching edges:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET edge by ID
router.get('/edges/:id', async (req, res) => {
  try {
    const results = await executeQuery(EDGE_QUERIES.GET_EDGE_BY_ID, { id: req.params.id });
    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Edge not found' });
    }
    res.json({ success: true, data: results[0].edge });
  } catch (error) {
    console.error('Error fetching edge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET edges for a node
router.get('/nodes/:nodeId/edges', async (req, res) => {
  try {
    const results = await executeQuery(EDGE_QUERIES.GET_EDGES_FOR_NODE, { nodeId: req.params.nodeId });
    const edges = results.map(r => r.edge);
    res.json({ success: true, data: edges, count: edges.length });
  } catch (error) {
    console.error('Error fetching edges for node:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST create edge
router.post('/edges', async (req, res) => {
  try {
    const { id, sourceId, targetId, type, bandwidth, latency, utilization, status } = req.body;
    
    if (!id || !sourceId || !targetId || !type) {
      return res.status(400).json({ success: false, error: 'Missing required fields: id, sourceId, targetId, type' });
    }

    const results = await executeQuery(EDGE_QUERIES.CREATE_EDGE, {
      id, sourceId, targetId, type, bandwidth, latency, utilization, status
    });

    res.status(201).json({ success: true, data: results[0].r.properties });
  } catch (error) {
    console.error('Error creating edge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT update edge
router.put('/edges/:id', async (req, res) => {
  try {
    const { bandwidth, latency, utilization, status } = req.body;
    const results = await executeQuery(EDGE_QUERIES.UPDATE_EDGE, {
      id: req.params.id,
      bandwidth,
      latency,
      utilization,
      status
    });

    if (results.length === 0) {
      return res.status(404).json({ success: false, error: 'Edge not found' });
    }

    res.json({ success: true, data: results[0].r.properties });
  } catch (error) {
    console.error('Error updating edge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE edge
router.delete('/edges/:id', async (req, res) => {
  try {
    await executeQuery(EDGE_QUERIES.DELETE_EDGE, { id: req.params.id });
    res.json({ success: true, message: 'Edge deleted successfully' });
  } catch (error) {
    console.error('Error deleting edge:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============================================================================
// BATCH & UTILITY ENDPOINTS
// ============================================================================

// POST seed database with data
router.post('/seed', async (req, res) => {
  try {
    const { nodes, edges, clearExisting = true } = req.body;

    if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
      return res.status(400).json({ success: false, error: 'Missing or invalid nodes data' });
    }

    if (!edges || !Array.isArray(edges)) {
      return res.status(400).json({ success: false, error: 'Missing or invalid edges data' });
    }

    // Clear existing data if requested
    if (clearExisting) {
      try {
        await executeQuery(NODE_QUERIES.DELETE_ALL_NODES);
        console.log('Cleared existing nodes and edges');
      } catch (clearError) {
        console.warn('Warning: Could not clear existing data:', clearError.message);
      }
    }

    // Normalize nodes - ensure all required properties exist
    const normalizedNodes = nodes.map(n => {
      // Handle location object from frontend (has lat, lon, city)
      let location = n.location;
      let latitude = n.latitude || 0;
      let longitude = n.longitude || 0;

      if (typeof n.location === 'object' && n.location !== null) {
        latitude = n.location.lat || latitude;
        longitude = n.location.lon || longitude;
        location = n.location.city || 'Unknown';
      }

      return {
        id: n.id || `node-${Math.random()}`,
        name: n.name || 'Unknown',
        type: n.type || 'router',
        status: n.status || 'active',
        location: location || 'Unknown',
        region: n.region || 'unknown',
        capacity: n.capacity || 0,
        vendor: n.vendor || 'Unknown',
        model: n.model || 'Unknown',
        uptime: n.uptime || 0,
        coverage_radius: n.coverage_radius || 0,
        latitude: latitude,
        longitude: longitude
      };
    });

    // Normalize edges - ensure all required properties exist
    const normalizedEdges = edges.map(e => ({
      id: e.id || `edge-${Math.random()}`,
      source: e.source || e.sourceId,
      target: e.target || e.targetId,
      type: e.type || 'fiber',
      bandwidth: e.bandwidth || 0,
      latency: e.latency || 0,
      utilization: e.utilization || 0,
      status: e.status || 'active'
    }));

    // Create nodes
    const nodeResults = await executeQuery(BATCH_QUERIES.CREATE_NODES_BATCH, { nodes: normalizedNodes });
    const nodesCreated = toNumber(nodeResults[0]?.created);

    // Create edges (only if there are nodes)
    let edgesCreated = 0;
    if (normalizedEdges.length > 0) {
      try {
        const edgeResults = await executeQuery(BATCH_QUERIES.CREATE_EDGES_BATCH, { edges: normalizedEdges });
        edgesCreated = toNumber(edgeResults[0]?.created);
      } catch (edgeError) {
        console.warn('Warning: Some edges failed to create:', edgeError.message);
        // Don't fail the entire seed if edges fail
      }
    }

    res.status(201).json({
      success: true,
      message: `Seeded database with ${nodesCreated} nodes and ${edgesCreated} edges`,
      data: { nodes_created: nodesCreated, edges_created: edgesCreated }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET export all data
router.get('/export', async (req, res) => {
  try {
    const results = await executeQuery(BATCH_QUERIES.GET_ALL_DATA);
    const { nodes, edges } = results[0].data;
    
    res.json({
      success: true,
      data: {
        nodes: nodes.map(n => n.properties),
        edges: edges.filter(e => e.id !== null)
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET statistics
router.get('/stats', async (req, res) => {
  try {
    const results = await executeQuery(BATCH_QUERIES.GET_STATISTICS);
    res.json({ success: true, data: results[0].stats });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE clear all data
router.delete('/clear', async (req, res) => {
  try {
    await executeQuery(NODE_QUERIES.DELETE_ALL_NODES);
    res.json({ success: true, message: 'All data cleared successfully' });
  } catch (error) {
    console.error('Error clearing data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

