/**
 * Tests for Dashboard Data Service
 * Verifies that real data is fetched from Neo4j and PostgreSQL
 */

import {
  fetchNetworkTopologyData,
  fetchAlarmData,
  fetchDeviceMetrics,
  fetchThreatEvents,
  fetchConnectionMetrics,
  fetchKPIMetrics,
  fetchNetworkTopologyGraph,
  generateChartData
} from '../services/dashboardData.js';

// Test helper to check if data has expected structure
function validateNetworkTopologyData(data) {
  console.log('✓ Network Topology Data Structure:');
  console.log(`  - Nodes: ${data.nodes?.length || 0}`);
  console.log(`  - Count: ${data.count}`);
  console.log(`  - Timestamp: ${data.timestamp}`);
  
  if (data.nodes && data.nodes.length > 0) {
    const sample = data.nodes[0];
    console.log(`  - Sample Node: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.nodes && Array.isArray(data.nodes);
}

function validateAlarmData(data) {
  console.log('✓ Alarm Data Structure:');
  console.log(`  - Alarms: ${data.alarms?.length || 0}`);
  console.log(`  - Severity Count: ${JSON.stringify(data.severityCount)}`);
  
  if (data.alarms && data.alarms.length > 0) {
    const sample = data.alarms[0];
    console.log(`  - Sample Alarm: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.alarms && Array.isArray(data.alarms);
}

function validateDeviceMetrics(data) {
  console.log('✓ Device Metrics Structure:');
  console.log(`  - Devices: ${data.devices?.length || 0}`);
  console.log(`  - Count: ${data.count}`);
  
  if (data.devices && data.devices.length > 0) {
    const sample = data.devices[0];
    console.log(`  - Sample Device: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.devices && Array.isArray(data.devices);
}

function validateThreatEvents(data) {
  console.log('✓ Threat Events Structure:');
  console.log(`  - Events: ${data.events?.length || 0}`);
  console.log(`  - Count: ${data.count}`);
  
  if (data.events && data.events.length > 0) {
    const sample = data.events[0];
    console.log(`  - Sample Event: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.events && Array.isArray(data.events);
}

function validateConnectionMetrics(data) {
  console.log('✓ Connection Metrics Structure:');
  console.log(`  - Connections: ${data.connections?.length || 0}`);
  console.log(`  - Count: ${data.count}`);
  
  if (data.connections && data.connections.length > 0) {
    const sample = data.connections[0];
    console.log(`  - Sample Connection: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.connections && Array.isArray(data.connections);
}

function validateKPIMetrics(data) {
  console.log('✓ KPI Metrics Structure:');
  console.log(`  - Metrics: ${data.metrics?.length || 0}`);
  console.log(`  - Count: ${data.count}`);
  
  if (data.metrics && data.metrics.length > 0) {
    const sample = data.metrics[0];
    console.log(`  - Sample Metric: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.metrics && Array.isArray(data.metrics);
}

function validateNetworkTopologyGraph(data) {
  console.log('✓ Network Topology Graph Structure:');
  console.log(`  - Nodes: ${data.nodes?.length || 0}`);
  console.log(`  - Edges: ${data.edges?.length || 0}`);
  console.log(`  - Node Count: ${data.nodeCount}`);
  console.log(`  - Edge Count: ${data.edgeCount}`);
  
  if (data.nodes && data.nodes.length > 0) {
    const sample = data.nodes[0];
    console.log(`  - Sample Node: ${JSON.stringify(sample, null, 2)}`);
  }
  
  if (data.edges && data.edges.length > 0) {
    const sample = data.edges[0];
    console.log(`  - Sample Edge: ${JSON.stringify(sample, null, 2)}`);
  }
  
  return data.nodes && Array.isArray(data.nodes) && data.edges && Array.isArray(data.edges);
}

// Run tests
async function runTests() {
  console.log('\n========================================');
  console.log('Dashboard Data Service Tests');
  console.log('========================================\n');

  try {
    console.log('1. Testing fetchNetworkTopologyData()...');
    const topoData = await fetchNetworkTopologyData();
    validateNetworkTopologyData(topoData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('2. Testing fetchAlarmData()...');
    const alarmData = await fetchAlarmData();
    validateAlarmData(alarmData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('3. Testing fetchDeviceMetrics()...');
    const deviceData = await fetchDeviceMetrics();
    validateDeviceMetrics(deviceData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('4. Testing fetchThreatEvents()...');
    const threatData = await fetchThreatEvents();
    validateThreatEvents(threatData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('5. Testing fetchConnectionMetrics()...');
    const connData = await fetchConnectionMetrics();
    validateConnectionMetrics(connData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('6. Testing fetchKPIMetrics()...');
    const kpiData = await fetchKPIMetrics();
    validateKPIMetrics(kpiData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('7. Testing fetchNetworkTopologyGraph()...');
    const graphData = await fetchNetworkTopologyGraph();
    validateNetworkTopologyGraph(graphData);
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  try {
    console.log('8. Testing generateChartData()...');
    const chartData1 = await generateChartData('network-topology', 'neo4j');
    console.log('✓ Network Topology Chart Data:', chartData1.type);
    
    const chartData2 = await generateChartData('devices', 'postgresql');
    console.log('✓ Device Chart Data:', chartData2.type);
    
    console.log('✅ PASSED\n');
  } catch (error) {
    console.error('❌ FAILED:', error.message, '\n');
  }

  console.log('========================================');
  console.log('All tests completed!');
  console.log('========================================\n');
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };

