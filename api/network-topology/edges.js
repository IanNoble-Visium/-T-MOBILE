import { executeQuery } from '../_lib/neo4j.js';
import { EDGE_QUERIES } from '../_lib/neo4j-queries.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // GET all edges
      console.log('Fetching all edges from Neo4j...');
      const results = await executeQuery(EDGE_QUERIES.GET_ALL_EDGES);
      const edges = results.map(r => r.edge);
      console.log(`Fetched ${edges.length} edges`);
      return res.status(200).json({ success: true, data: edges, count: edges.length });
    }

    if (req.method === 'POST') {
      // POST create edge
      const { id, sourceId, targetId, type, bandwidth, latency, utilization, status } = req.body;
      
      if (!id || !sourceId || !targetId) {
        return res.status(400).json({ 
          success: false, 
          error: 'Missing required fields: id, sourceId, targetId' 
        });
      }

      console.log(`Creating edge: ${sourceId} -> ${targetId}`);
      const results = await executeQuery(EDGE_QUERIES.CREATE_EDGE, {
        id,
        sourceId,
        targetId,
        type: type || 'connection',
        bandwidth: bandwidth || 1000,
        latency: latency || 10,
        utilization: utilization || 50,
        status: status || 'active'
      });

      const edge = results[0].edge;
      console.log(`Edge created: ${edge.id}`);
      return res.status(201).json({ success: true, data: edge });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in edges endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

