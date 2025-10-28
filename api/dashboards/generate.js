import { generateResponse } from '../_lib/gemini.js';
import { query } from '../_lib/db.js';
import { executeQuery } from '../_lib/neo4j.js';

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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, context = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('\n' + '='.repeat(80));
    console.log('🚀 [Dashboard] Starting dashboard generation');
    console.log(`📝 [Dashboard] User prompt: "${prompt}"`);
    console.log('='.repeat(80));

    // Generate chart specifications based on prompt
    const charts = await generateChartsFromPrompt(prompt);
    
    console.log(`✅ [Dashboard] Dashboard generation complete: ${charts.length} charts created`);
    console.log('='.repeat(80) + '\n');

    res.json({
      prompt,
      charts,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ [Dashboard] Error generating dashboard:', error);
    res.status(500).json({
      error: 'Failed to generate dashboard',
      details: error.message
    });
  }
}

/**
 * Generate charts from natural language prompt
 */
async function generateChartsFromPrompt(prompt) {
  const charts = [];
  const promptLower = prompt.toLowerCase();

  // Always include network topology if mentioned
  if (promptLower.includes('network') || promptLower.includes('topology')) {
    try {
      const topologyData = await fetchNetworkTopologyGraph();
      if (topologyData && topologyData.nodes && topologyData.nodes.length > 0) {
        charts.push({
          type: 'network-topology',
          title: 'Network Topology',
          description: 'Interactive network topology visualization',
          data: topologyData,
          dataSource: 'neo4j'
        });
        console.log(`✅ [Dashboard] Added network-topology chart`);
      }
    } catch (error) {
      console.error('Error fetching network topology:', error);
    }
  }

  // Add threat-related charts
  if (promptLower.includes('threat') || promptLower.includes('security') || promptLower.includes('attack')) {
    try {
      const threatData = await fetchThreatData();
      if (threatData && threatData.items && threatData.items.length > 0) {
        charts.push({
          type: 'pie',
          title: 'Threats by Severity',
          description: 'Distribution of threats by severity level',
          data: threatData,
          dataSource: 'postgresql'
        });
        console.log(`✅ [Dashboard] Added threat pie chart`);
      }
    } catch (error) {
      console.error('Error fetching threat data:', error);
    }
  }

  // Add device-related charts
  if (promptLower.includes('device') || promptLower.includes('iot')) {
    try {
      const deviceData = await fetchDeviceData();
      if (deviceData && deviceData.categories && deviceData.categories.length > 0) {
        charts.push({
          type: 'bar',
          title: 'Devices by Type',
          description: 'Number of devices by type',
          data: deviceData,
          dataSource: 'postgresql'
        });
        console.log(`✅ [Dashboard] Added device bar chart`);
      }
    } catch (error) {
      console.error('Error fetching device data:', error);
    }
  }

  // Add KPI metrics if mentioned
  if (promptLower.includes('kpi') || promptLower.includes('metric') || promptLower.includes('overview')) {
    try {
      const kpiData = await fetchKPITrend();
      if (kpiData && kpiData.categories && kpiData.categories.length > 0) {
        charts.push({
          type: 'line',
          title: 'Threats Detected Trend',
          description: 'Trend of threats detected over time',
          data: kpiData,
          dataSource: 'postgresql'
        });
        console.log(`✅ [Dashboard] Added KPI line chart`);
      }
    } catch (error) {
      console.error('Error fetching KPI data:', error);
    }
  }

  // If no specific charts were added, add default overview charts
  if (charts.length === 0) {
    console.log('📊 [Dashboard] No specific charts matched, adding default overview...');
    
    try {
      const topologyData = await fetchNetworkTopologyGraph();
      if (topologyData && topologyData.nodes && topologyData.nodes.length > 0) {
        charts.push({
          type: 'network-topology',
          title: 'Network Topology',
          description: 'Interactive network topology visualization',
          data: topologyData,
          dataSource: 'neo4j'
        });
      }
    } catch (error) {
      console.error('Error fetching default topology:', error);
    }

    try {
      const threatData = await fetchThreatData();
      if (threatData && threatData.items && threatData.items.length > 0) {
        charts.push({
          type: 'pie',
          title: 'Threats by Severity',
          description: 'Distribution of threats by severity level',
          data: threatData,
          dataSource: 'postgresql'
        });
      }
    } catch (error) {
      console.error('Error fetching default threats:', error);
    }
  }

  return charts;
}

/**
 * Fetch network topology graph from Neo4j
 */
async function fetchNetworkTopologyGraph() {
  try {
    const nodeResults = await executeQuery(`
      MATCH (n:NetworkNode)
      RETURN n
      LIMIT 100
    `);

    const edgeResults = await executeQuery(`
      MATCH (source:NetworkNode)-[r:CONNECTED_TO]->(target:NetworkNode)
      RETURN source.id as source, target.id as target, r
      LIMIT 200
    `);

    const nodes = nodeResults.map(r => r.n.properties);
    const edges = edgeResults.map(r => ({
      source: r.source,
      target: r.target,
      ...r.r.properties
    }));

    return { nodes, edges };
  } catch (error) {
    console.error('Error fetching network topology graph:', error);
    return { nodes: [], edges: [] };
  }
}

/**
 * Fetch threat data from PostgreSQL
 */
async function fetchThreatData() {
  try {
    const result = await query(`
      SELECT severity, COUNT(*) as count
      FROM threat_events
      WHERE timestamp > NOW() - INTERVAL '7 days'
      GROUP BY severity
      ORDER BY count DESC
    `);

    const items = result.rows.map(row => ({
      name: row.severity || 'Unknown',
      value: parseInt(row.count)
    }));

    return { items };
  } catch (error) {
    console.error('Error fetching threat data:', error);
    return { items: [] };
  }
}

/**
 * Fetch device data from PostgreSQL
 */
async function fetchDeviceData() {
  try {
    const result = await query(`
      SELECT type, COUNT(*) as count
      FROM devices
      GROUP BY type
      ORDER BY count DESC
      LIMIT 10
    `);

    const categories = result.rows.map(row => row.type || 'Unknown');
    const values = result.rows.map(row => parseInt(row.count));

    return { categories, values };
  } catch (error) {
    console.error('Error fetching device data:', error);
    return { categories: [], values: [] };
  }
}

/**
 * Fetch KPI trend data from PostgreSQL
 */
async function fetchKPITrend() {
  try {
    const result = await query(`
      SELECT 
        DATE(timestamp) as date,
        AVG(threats_detected_24h)::INTEGER as threats
      FROM kpi_metrics
      WHERE timestamp > NOW() - INTERVAL '7 days'
      GROUP BY DATE(timestamp)
      ORDER BY DATE(timestamp)
    `);

    const categories = result.rows.map(row => row.date.toISOString().split('T')[0]);
    const values = result.rows.map(row => parseInt(row.threats));

    return { categories, values };
  } catch (error) {
    console.error('Error fetching KPI trend:', error);
    return { categories: [], values: [] };
  }
}

