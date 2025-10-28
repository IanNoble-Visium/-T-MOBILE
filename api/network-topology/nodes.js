import { executeQuery } from '../_lib/neo4j.js';
import { NODE_QUERIES } from '../_lib/neo4j-queries.js';

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
      // GET all nodes
      const results = await executeQuery(NODE_QUERIES.GET_ALL_NODES);
      const nodes = results.map(r => r.n.properties);
      return res.status(200).json({ success: true, data: nodes, count: nodes.length });
    }

    if (req.method === 'POST') {
      // POST create node
      const { id, name, type, status, location, region, capacity, vendor, model, uptime, coverage_radius, latitude, longitude } = req.body;
      
      if (!id || !name || !type) {
        return res.status(400).json({ success: false, error: 'Missing required fields: id, name, type' });
      }

      const results = await executeQuery(NODE_QUERIES.CREATE_NODE, {
        id, name, type, status, location, region, capacity, vendor, model, uptime, coverage_radius, latitude, longitude
      });

      return res.status(201).json({ success: true, data: results[0].n.properties });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Error in nodes endpoint:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
