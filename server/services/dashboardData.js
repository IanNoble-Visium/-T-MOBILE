import { query } from '../db/connection.js';
import { getDriver, executeQuery } from '../db/neo4j.js';

/**
 * Fetch network topology data from Neo4j
 */
export async function fetchNetworkTopologyData() {
  try {
    const results = await executeQuery(`
      MATCH (n:Node)
      RETURN {
        id: n.id,
        name: n.name,
        type: n.type,
        status: n.status,
        region: n.region
      } as node
      LIMIT 100
    `);

    const nodes = results.map(record => record.node);

    return {
      nodes,
      count: nodes.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching network topology:', error);
    return { nodes: [], count: 0, error: error.message };
  }
}

/**
 * Fetch alarm data from Neo4j
 */
export async function fetchAlarmData() {
  try {
    const results = await executeQuery(`
      MATCH (a:Alarm)
      RETURN {
        id: a.id,
        name: a.name,
        severity: a.severity,
        status: a.status,
        createdAt: a.createdAt
      } as alarm
      LIMIT 50
    `);

    const alarms = results.map(record => record.alarm);

    // Count by severity
    const severityCount = {
      critical: alarms.filter(a => a.severity === 'critical').length,
      high: alarms.filter(a => a.severity === 'high').length,
      medium: alarms.filter(a => a.severity === 'medium').length,
      low: alarms.filter(a => a.severity === 'low').length
    };

    return {
      alarms,
      severityCount,
      total: alarms.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching alarm data:', error);
    return { alarms: [], severityCount: {}, total: 0, error: error.message };
  }
}

/**
 * Fetch device metrics from PostgreSQL
 */
export async function fetchDeviceMetrics() {
  try {
    console.log('📊 [PostgreSQL] Executing query: SELECT * FROM devices LIMIT 50');
    const result = await query(`
      SELECT
        id,
        name,
        type,
        security_posture,
        threats_detected,
        compliance_status,
        last_seen
      FROM devices
      ORDER BY security_posture DESC
      LIMIT 50
    `);

    console.log(`✅ [PostgreSQL] Fetched ${result.rows.length} device records`);
    return {
      devices: result.rows,
      count: result.rows.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ [PostgreSQL] Error fetching device metrics:', error);
    return { devices: [], count: 0, error: error.message };
  }
}

/**
 * Fetch threat events from PostgreSQL
 */
export async function fetchThreatEvents() {
  try {
    console.log('📊 [PostgreSQL] Executing query: SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL \'24 hours\' LIMIT 100');
    const result = await query(`
      SELECT
        id,
        type,
        severity,
        status,
        timestamp,
        confidence
      FROM threat_events
      WHERE timestamp > NOW() - INTERVAL '24 hours'
      ORDER BY timestamp DESC
      LIMIT 100
    `);

    console.log(`✅ [PostgreSQL] Fetched ${result.rows.length} threat events from last 24 hours`);
    return {
      events: result.rows,
      count: result.rows.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ [PostgreSQL] Error fetching threat events:', error);
    return { events: [], count: 0, error: error.message };
  }
}

/**
 * Fetch connection metrics from Neo4j
 */
export async function fetchConnectionMetrics() {
  try {
    const results = await executeQuery(`
      MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode)
      RETURN {
        source: source.id,
        target: target.id,
        type: type(rel),
        bandwidth: rel.bandwidth,
        latency: rel.latency,
        status: rel.status
      } as connection
      LIMIT 100
    `);

    const connections = results.map(record => record.connection);

    return {
      connections,
      count: connections.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching connection metrics:', error);
    return { connections: [], count: 0, error: error.message };
  }
}

/**
 * Fetch KPI metrics from PostgreSQL
 */
export async function fetchKPIMetrics() {
  try {
    console.log('📊 [PostgreSQL] Executing query: SELECT * FROM kpi_metrics LIMIT 30');
    const result = await query(`
      SELECT
        timestamp,
        threats_detected_24h,
        threats_blocked_24h,
        active_incidents,
        network_health_score,
        protected_devices,
        uptime_percentage
      FROM kpi_metrics
      ORDER BY timestamp DESC
      LIMIT 30
    `);

    console.log(`✅ [PostgreSQL] Fetched ${result.rows.length} KPI metric records`);
    return {
      metrics: result.rows.reverse(), // Reverse to get chronological order
      count: result.rows.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ [PostgreSQL] Error fetching KPI metrics:', error);
    return { metrics: [], count: 0, error: error.message };
  }
}

/**
 * Fetch network topology with nodes and edges for visualization
 */
export async function fetchNetworkTopologyGraph() {
  try {
    // Fetch nodes
    console.log('🔗 [Neo4j] Executing query: MATCH (n:NetworkNode) RETURN n LIMIT 200');
    const nodeResults = await executeQuery(`
      MATCH (n:NetworkNode)
      RETURN {
        id: n.id,
        name: n.name,
        type: n.type,
        status: n.status,
        region: n.region,
        latitude: n.latitude,
        longitude: n.longitude
      } as node
      LIMIT 200
    `);

    const nodes = nodeResults.map(record => record.node);
    console.log(`✅ [Neo4j] Fetched ${nodes.length} network nodes`);

    // Fetch edges/connections
    console.log('🔗 [Neo4j] Executing query: MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode) RETURN edge LIMIT 500');
    const edgeResults = await executeQuery(`
      MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode)
      RETURN {
        source: source.id,
        target: target.id,
        bandwidth: rel.bandwidth,
        latency: rel.latency,
        status: rel.status
      } as edge
      LIMIT 500
    `);

    const edges = edgeResults.map(record => record.edge);
    console.log(`✅ [Neo4j] Fetched ${edges.length} network connections`);

    return {
      nodes,
      edges,
      nodeCount: nodes.length,
      edgeCount: edges.length,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('❌ [Neo4j] Error fetching network topology graph:', error);
    return { nodes: [], edges: [], nodeCount: 0, edgeCount: 0, error: error.message };
  }
}

/**
 * Fetch heatmap data - network traffic intensity by region and time
 */
export async function fetchHeatmapData() {
  try {
    console.log('📊 [Dashboard] Fetching heatmap data from PostgreSQL...');
    const result = await query(`
      SELECT
        DATE_TRUNC('hour', timestamp) as hour,
        region,
        COUNT(*) as intensity
      FROM network_metrics
      WHERE timestamp > NOW() - INTERVAL '24 hours'
      GROUP BY DATE_TRUNC('hour', timestamp), region
      ORDER BY hour DESC
      LIMIT 100
    `);

    const regions = [...new Set(result.rows.map(r => r.region))];
    const hours = [...new Set(result.rows.map(r => new Date(r.hour).toLocaleTimeString()))];

    const values = result.rows.map(r => [
      regions.indexOf(r.region),
      hours.indexOf(new Date(r.hour).toLocaleTimeString()),
      Math.min(100, r.intensity)
    ]);

    console.log(`✅ [Dashboard] Heatmap data fetched: ${result.rows.length} records`);
    return {
      xCategories: regions,
      yCategories: hours,
      values
    };
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return { xCategories: [], yCategories: [], values: [] };
  }
}

/**
 * Fetch treemap data - hierarchical device distribution
 */
export async function fetchTreemapData() {
  try {
    console.log('📊 [Dashboard] Fetching treemap data from PostgreSQL...');
    const result = await query(`
      SELECT
        type as category,
        COUNT(*) as count,
        AVG(CAST(security_posture AS FLOAT)) as avg_security
      FROM devices
      GROUP BY type
      ORDER BY count DESC
      LIMIT 20
    `);

    const items = result.rows.map(r => ({
      name: r.category,
      value: r.count,
      children: [{
        name: `Security: ${Math.round(r.avg_security)}%`,
        value: r.count
      }]
    }));

    console.log(`✅ [Dashboard] Treemap data fetched: ${result.rows.length} categories`);
    return { items };
  } catch (error) {
    console.error('Error fetching treemap data:', error);
    return { items: [] };
  }
}

/**
 * Fetch radar chart data - security metrics comparison
 */
export async function fetchRadarData() {
  try {
    console.log('📊 [Dashboard] Fetching radar data from PostgreSQL...');
    const result = await query(`
      SELECT
        type,
        AVG(CAST(security_posture AS FLOAT)) as security,
        AVG(CAST(compliance_status AS FLOAT)) as compliance,
        COUNT(*) as device_count
      FROM devices
      GROUP BY type
      LIMIT 10
    `);

    const indicators = [
      { name: 'Security Posture', max: 100 },
      { name: 'Compliance', max: 100 },
      { name: 'Device Count', max: 100 }
    ];

    const series = result.rows.map(r => ({
      name: r.type,
      value: [r.security || 0, r.compliance || 0, Math.min(100, r.device_count)]
    }));

    console.log(`✅ [Dashboard] Radar data fetched: ${result.rows.length} device types`);
    return { indicators, series };
  } catch (error) {
    console.error('Error fetching radar data:', error);
    return { indicators: [], series: [] };
  }
}

/**
 * Fetch sankey diagram data - threat event flow
 */
export async function fetchSankeyData() {
  try {
    console.log('📊 [Dashboard] Fetching sankey data from PostgreSQL...');
    const result = await query(`
      SELECT
        type as source_type,
        severity as target_severity,
        COUNT(*) as count
      FROM threat_events
      WHERE timestamp > NOW() - INTERVAL '7 days'
      GROUP BY type, severity
      LIMIT 50
    `);

    const nodes = [];
    const nodeSet = new Set();
    const links = [];

    result.rows.forEach(r => {
      if (!nodeSet.has(r.source_type)) {
        nodes.push({ name: `Type: ${r.source_type}` });
        nodeSet.add(r.source_type);
      }
      if (!nodeSet.has(r.target_severity)) {
        nodes.push({ name: `Severity: ${r.target_severity}` });
        nodeSet.add(r.target_severity);
      }
      links.push({
        source: `Type: ${r.source_type}`,
        target: `Severity: ${r.target_severity}`,
        value: r.count
      });
    });

    console.log(`✅ [Dashboard] Sankey data fetched: ${nodes.length} nodes, ${links.length} links`);
    return { nodes, links };
  } catch (error) {
    console.error('Error fetching sankey data:', error);
    return { nodes: [], links: [] };
  }
}

/**
 * Fetch funnel chart data - threat resolution pipeline
 */
export async function fetchFunnelData() {
  try {
    console.log('📊 [Dashboard] Fetching funnel data from PostgreSQL...');
    const result = await query(`
      SELECT
        status,
        COUNT(*) as count
      FROM threat_events
      WHERE timestamp > NOW() - INTERVAL '30 days'
      GROUP BY status
      ORDER BY count DESC
    `);

    const items = result.rows.map(r => ({
      name: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      value: r.count
    }));

    console.log(`✅ [Dashboard] Funnel data fetched: ${items.length} stages`);
    return { items };
  } catch (error) {
    console.error('Error fetching funnel data:', error);
    return { items: [] };
  }
}

/**
 * Fetch sunburst chart data - hierarchical alarm breakdown
 */
export async function fetchSunburstData() {
  try {
    console.log('📊 [Dashboard] Fetching sunburst data from Neo4j...');
    const results = await executeQuery(`
      MATCH (a:Alarm)
      RETURN {
        severity: a.severity,
        type: a.type,
        region: a.region,
        count: 1
      } as alarm
      LIMIT 200
    `);

    const alarms = results.map(record => record.alarm);

    // Build hierarchical structure
    const severityMap = {};
    alarms.forEach(alarm => {
      if (!severityMap[alarm.severity]) {
        severityMap[alarm.severity] = {};
      }
      if (!severityMap[alarm.severity][alarm.type]) {
        severityMap[alarm.severity][alarm.type] = 0;
      }
      severityMap[alarm.severity][alarm.type]++;
    });

    const items = [{
      name: 'Alarms',
      children: Object.entries(severityMap).map(([severity, types]) => ({
        name: severity,
        children: Object.entries(types).map(([type, count]) => ({
          name: type,
          value: count
        }))
      }))
    }];

    console.log(`✅ [Dashboard] Sunburst data fetched: ${alarms.length} alarms`);
    return { items };
  } catch (error) {
    console.error('Error fetching sunburst data:', error);
    return { items: [] };
  }
}

/**
 * Generate chart data based on data source
 */
export async function generateChartData(chartType, dataSource) {
  try {
    let data = {};

    if (dataSource === 'neo4j') {
      if (chartType === 'network-topology') {
        data = await fetchNetworkTopologyGraph();
      } else if (chartType === 'alarms') {
        data = await fetchAlarmData();
      } else if (chartType === 'connections') {
        data = await fetchConnectionMetrics();
      }
    } else if (dataSource === 'postgresql') {
      if (chartType === 'devices') {
        data = await fetchDeviceMetrics();
      } else if (chartType === 'threats') {
        data = await fetchThreatEvents();
      } else if (chartType === 'kpi') {
        data = await fetchKPIMetrics();
      }
    }

    return data;
  } catch (error) {
    console.error('Error generating chart data:', error);
    return { error: error.message };
  }
}

/**
 * Get database schema information for AI context
 */
export async function getDatabaseSchema() {
  try {
    const pgResult = await query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tables = pgResult.rows.map(row => row.table_name);

    // Get Neo4j labels
    const neoResults = await executeQuery(`
      CALL db.labels()
      YIELD label
      RETURN label
    `);

    const labels = neoResults.map(record => record.label);

    return {
      postgresql: {
        tables,
        count: tables.length
      },
      neo4j: {
        labels,
        count: labels.length
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching database schema:', error);
    return {
      postgresql: { tables: [], count: 0 },
      neo4j: { labels: [], count: 0 },
      error: error.message
    };
  }
}

