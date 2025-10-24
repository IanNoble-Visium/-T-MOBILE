import express from 'express';
import { enhanceQuery, generateResponse } from '../services/gemini.js';
import { query } from '../db/connection.js';
import {
  fetchNetworkTopologyData,
  fetchAlarmData,
  fetchDeviceMetrics,
  fetchThreatEvents,
  fetchConnectionMetrics,
  fetchKPIMetrics,
  fetchNetworkTopologyGraph,
  getDatabaseSchema,
  generateChartData,
  fetchHeatmapData,
  fetchTreemapData,
  fetchRadarData,
  fetchSankeyData,
  fetchFunnelData,
  fetchSunburstData
} from '../services/dashboardData.js';

const router = express.Router();

// Validation functions for chart data
function validateChartData(chartType, data) {
  const validations = {
    'network-topology': () => {
      const hasNodes = data.nodes && Array.isArray(data.nodes) && data.nodes.length >= 1;
      if (!hasNodes) {
        console.log(`❌ [Dashboard] Validation FAILED for network-topology: No nodes found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for network-topology: ${data.nodes.length} nodes`);
      return true;
    },
    'line': () => {
      const hasData = data.categories && data.values &&
                      Array.isArray(data.categories) && Array.isArray(data.values) &&
                      data.categories.length >= 2 && data.values.length >= 2;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for line: Insufficient data points (need ≥2)`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for line: ${data.values.length} data points`);
      return true;
    },
    'pie': () => {
      const hasItems = data.items && Array.isArray(data.items) && data.items.length >= 1;
      if (!hasItems) {
        console.log(`❌ [Dashboard] Validation FAILED for pie: No items found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for pie: ${data.items.length} items`);
      return true;
    },
    'donut': () => {
      const hasItems = data.items && Array.isArray(data.items) && data.items.length >= 1;
      if (!hasItems) {
        console.log(`❌ [Dashboard] Validation FAILED for donut: No items found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for donut: ${data.items.length} items`);
      return true;
    },
    'bar': () => {
      const hasData = data.categories && data.values &&
                      Array.isArray(data.categories) && Array.isArray(data.values) &&
                      data.categories.length >= 1 && data.values.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for bar: No categories or values`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for bar: ${data.categories.length} categories`);
      return true;
    },
    'horizontal-bar': () => {
      const hasData = data.categories && data.values &&
                      Array.isArray(data.categories) && Array.isArray(data.values) &&
                      data.categories.length >= 1 && data.values.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for horizontal-bar: No categories or values`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for horizontal-bar: ${data.categories.length} categories`);
      return true;
    },
    'heatmap': () => {
      const hasData = data.xCategories && data.yCategories && data.values &&
                      Array.isArray(data.xCategories) && Array.isArray(data.yCategories) && Array.isArray(data.values) &&
                      data.xCategories.length >= 1 && data.yCategories.length >= 1 && data.values.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for heatmap: Missing or empty categories/values`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for heatmap: ${data.values.length} data points`);
      return true;
    },
    'treemap': () => {
      const hasItems = data.items && Array.isArray(data.items) && data.items.length >= 1;
      if (!hasItems) {
        console.log(`❌ [Dashboard] Validation FAILED for treemap: No items found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for treemap: ${data.items.length} items`);
      return true;
    },
    'radar': () => {
      const hasData = data.indicators && data.series &&
                      Array.isArray(data.indicators) && Array.isArray(data.series) &&
                      data.indicators.length >= 3 && data.series.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for radar: Need ≥3 indicators and ≥1 series`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for radar: ${data.indicators.length} indicators`);
      return true;
    },
    'sankey': () => {
      const hasData = data.nodes && data.links &&
                      Array.isArray(data.nodes) && Array.isArray(data.links) &&
                      data.nodes.length >= 1 && data.links.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for sankey: Need ≥1 node and ≥1 link`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for sankey: ${data.nodes.length} nodes, ${data.links.length} links`);
      return true;
    },
    'funnel': () => {
      const hasItems = data.items && Array.isArray(data.items) && data.items.length >= 2;
      if (!hasItems) {
        console.log(`❌ [Dashboard] Validation FAILED for funnel: Need ≥2 stages`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for funnel: ${data.items.length} stages`);
      return true;
    },
    'scatter': () => {
      const hasPoints = data.points && Array.isArray(data.points) && data.points.length >= 1;
      if (!hasPoints) {
        console.log(`❌ [Dashboard] Validation FAILED for scatter: No data points found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for scatter: ${data.points.length} points`);
      return true;
    },
    'area': () => {
      const hasData = data.categories && data.values &&
                      Array.isArray(data.categories) && Array.isArray(data.values) &&
                      data.categories.length >= 2 && data.values.length >= 2;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for area: Insufficient data points (need ≥2)`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for area: ${data.values.length} data points`);
      return true;
    },
    'candlestick': () => {
      const hasData = data.categories && data.values &&
                      Array.isArray(data.categories) && Array.isArray(data.values) &&
                      data.categories.length >= 1 && data.values.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for candlestick: No data found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for candlestick: ${data.values.length} data points`);
      return true;
    },
    'stacked-bar': () => {
      const hasData = data.categories && data.series &&
                      Array.isArray(data.categories) && Array.isArray(data.series) &&
                      data.categories.length >= 1 && data.series.length >= 1;
      if (!hasData) {
        console.log(`❌ [Dashboard] Validation FAILED for stacked-bar: No categories or series`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for stacked-bar: ${data.categories.length} categories`);
      return true;
    },
    'sunburst': () => {
      const hasItems = data.items && Array.isArray(data.items) && data.items.length >= 1;
      if (!hasItems) {
        console.log(`❌ [Dashboard] Validation FAILED for sunburst: No items found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for sunburst: ${data.items.length} items`);
      return true;
    },
    'gauge': () => {
      const hasValue = data.value !== undefined && data.value !== null;
      if (!hasValue) {
        console.log(`❌ [Dashboard] Validation FAILED for gauge: No value found`);
        return false;
      }
      console.log(`✅ [Dashboard] Validation PASSED for gauge: value = ${data.value}`);
      return true;
    }
  };

  const validator = validations[chartType];
  if (!validator) {
    console.log(`⚠️  [Dashboard] No validator found for chart type: ${chartType}`);
    return true; // Default to true if no validator exists
  }

  return validator();
}

// Helper function to transform real data into chart formats
async function transformDataToChartFormat(chartSpec) {
  const { type, dataSource, description } = chartSpec;

  try {
    if (type === 'network-topology') {
      console.log('📊 [Dashboard] Fetching network topology from Neo4j...');
      const data = await fetchNetworkTopologyGraph();
      console.log(`✅ [Dashboard] Neo4j network topology fetched: ${data.nodes?.length || 0} nodes, ${data.edges?.length || 0} edges`);
      const chartData = {
        nodes: data.nodes,
        edges: data.edges
      };
      if (validateChartData(type, chartData)) {
        return {
          type: 'network-topology',
          title: 'Network Topology',
          description: 'Real-time network topology visualization',
          data: chartData,
          dataSource: 'neo4j'
        };
      }
      return null;
    }

    if (type === 'line') {
      console.log('📊 [Dashboard] Fetching KPI metrics from PostgreSQL...');
      const kpiData = await fetchKPIMetrics();
      console.log(`✅ [Dashboard] PostgreSQL KPI metrics fetched: ${kpiData.metrics?.length || 0} records`);
      if (kpiData.metrics && kpiData.metrics.length > 0) {
        const chartData = {
          categories: kpiData.metrics.map(m => new Date(m.timestamp).toLocaleDateString()),
          values: kpiData.metrics.map(m => m.network_health_score || 0)
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'line',
            title: 'Network Health Score Trend',
            description: 'Historical network health metrics',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'pie') {
      console.log('📊 [Dashboard] Fetching threat events from PostgreSQL...');
      const threatData = await fetchThreatEvents();
      console.log(`✅ [Dashboard] PostgreSQL threat events fetched: ${threatData.events?.length || 0} events`);
      if (threatData.events && threatData.events.length > 0) {
        const severityCount = {};
        threatData.events.forEach(event => {
          severityCount[event.severity] = (severityCount[event.severity] || 0) + 1;
        });
        const chartData = {
          items: Object.entries(severityCount).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }))
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'pie',
            title: 'Threat Events by Severity',
            description: 'Distribution of threat events by severity level',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'bar') {
      console.log('📊 [Dashboard] Fetching device metrics from PostgreSQL...');
      const deviceData = await fetchDeviceMetrics();
      console.log(`✅ [Dashboard] PostgreSQL device metrics fetched: ${deviceData.devices?.length || 0} devices`);
      if (deviceData.devices && deviceData.devices.length > 0) {
        const typeCount = {};
        deviceData.devices.forEach(device => {
          typeCount[device.type] = (typeCount[device.type] || 0) + 1;
        });
        const chartData = {
          categories: Object.keys(typeCount),
          values: Object.values(typeCount)
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'bar',
            title: 'Devices by Type',
            description: 'Count of devices grouped by type',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'gauge') {
      console.log('📊 [Dashboard] Fetching KPI metrics from PostgreSQL for gauge...');
      const kpiData = await fetchKPIMetrics();
      console.log(`✅ [Dashboard] PostgreSQL KPI metrics fetched: ${kpiData.metrics?.length || 0} records`);
      if (kpiData.metrics && kpiData.metrics.length > 0) {
        const latestMetric = kpiData.metrics[kpiData.metrics.length - 1];
        const chartData = {
          value: latestMetric.network_health_score || 0
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'gauge',
            title: 'Network Health Score',
            description: 'Current overall network health percentage',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'scatter') {
      console.log('📊 [Dashboard] Fetching device metrics from PostgreSQL for scatter...');
      const deviceData = await fetchDeviceMetrics();
      console.log(`✅ [Dashboard] PostgreSQL device metrics fetched: ${deviceData.devices?.length || 0} devices`);
      if (deviceData.devices && deviceData.devices.length > 0) {
        const chartData = {
          points: deviceData.devices.map(d => [
            d.security_posture || 0,
            d.threats_detected || 0
          ])
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'scatter',
            title: 'Device Security Posture vs Threats',
            description: 'Correlation between security posture and detected threats',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'heatmap') {
      console.log('📊 [Dashboard] Fetching heatmap data from PostgreSQL...');
      const heatmapData = await fetchHeatmapData();
      console.log(`✅ [Dashboard] Heatmap data fetched: ${heatmapData.values?.length || 0} data points`);
      if (validateChartData(type, heatmapData)) {
        return {
          type: 'heatmap',
          title: 'Network Traffic Intensity',
          description: 'Network traffic intensity by region and time',
          data: heatmapData,
          dataSource: 'postgresql'
        };
      }
      return null;
    }

    if (type === 'treemap') {
      console.log('📊 [Dashboard] Fetching treemap data from PostgreSQL...');
      const treemapData = await fetchTreemapData();
      console.log(`✅ [Dashboard] Treemap data fetched: ${treemapData.items?.length || 0} categories`);
      if (validateChartData(type, treemapData)) {
        return {
          type: 'treemap',
          title: 'Device Distribution by Type',
          description: 'Hierarchical view of devices grouped by type',
          data: treemapData,
          dataSource: 'postgresql'
        };
      }
      return null;
    }

    if (type === 'radar') {
      console.log('📊 [Dashboard] Fetching radar data from PostgreSQL...');
      const radarData = await fetchRadarData();
      console.log(`✅ [Dashboard] Radar data fetched: ${radarData.series?.length || 0} device types`);
      if (validateChartData(type, radarData)) {
        return {
          type: 'radar',
          title: 'Security Metrics Comparison',
          description: 'Multi-metric comparison across device types',
          data: radarData,
          dataSource: 'postgresql'
        };
      }
      return null;
    }

    if (type === 'sankey') {
      console.log('📊 [Dashboard] Fetching sankey data from PostgreSQL...');
      const sankeyData = await fetchSankeyData();
      console.log(`✅ [Dashboard] Sankey data fetched: ${sankeyData.links?.length || 0} flows`);
      if (validateChartData(type, sankeyData)) {
        return {
          type: 'sankey',
          title: 'Threat Event Flow Analysis',
          description: 'Flow of threat events from type to severity',
          data: sankeyData,
          dataSource: 'postgresql'
        };
      }
      return null;
    }

    if (type === 'funnel') {
      console.log('📊 [Dashboard] Fetching funnel data from PostgreSQL...');
      const funnelData = await fetchFunnelData();
      console.log(`✅ [Dashboard] Funnel data fetched: ${funnelData.items?.length || 0} stages`);
      if (validateChartData(type, funnelData)) {
        return {
          type: 'funnel',
          title: 'Threat Resolution Pipeline',
          description: 'Threat events through resolution stages',
          data: funnelData,
          dataSource: 'postgresql'
        };
      }
      return null;
    }

    if (type === 'donut') {
      console.log('📊 [Dashboard] Fetching threat events for donut chart...');
      const threatData = await fetchThreatEvents();
      console.log(`✅ [Dashboard] Threat events fetched: ${threatData.events?.length || 0} events`);
      if (threatData.events && threatData.events.length > 0) {
        const severityCount = {};
        threatData.events.forEach(event => {
          severityCount[event.severity] = (severityCount[event.severity] || 0) + 1;
        });
        const chartData = {
          items: Object.entries(severityCount).map(([name, value]) => ({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            value
          }))
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'donut',
            title: 'Threat Severity Distribution',
            description: 'Donut chart showing threat severity breakdown',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'horizontal-bar') {
      console.log('📊 [Dashboard] Fetching device metrics for horizontal bar chart...');
      const deviceData = await fetchDeviceMetrics();
      console.log(`✅ [Dashboard] Device metrics fetched: ${deviceData.devices?.length || 0} devices`);
      if (deviceData.devices && deviceData.devices.length > 0) {
        const typeCount = {};
        deviceData.devices.forEach(device => {
          typeCount[device.type] = (typeCount[device.type] || 0) + 1;
        });
        const chartData = {
          categories: Object.keys(typeCount),
          values: Object.values(typeCount)
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'horizontal-bar',
            title: 'Device Count by Type',
            description: 'Horizontal bar chart of device distribution',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'stacked-bar') {
      console.log('📊 [Dashboard] Fetching KPI metrics for stacked bar chart...');
      const kpiData = await fetchKPIMetrics();
      console.log(`✅ [Dashboard] KPI metrics fetched: ${kpiData.metrics?.length || 0} records`);
      if (kpiData.metrics && kpiData.metrics.length > 0) {
        const chartData = {
          categories: kpiData.metrics.map(m => new Date(m.timestamp).toLocaleDateString()),
          series: [
            {
              name: 'Threats Detected',
              values: kpiData.metrics.map(m => m.threats_detected_24h || 0)
            },
            {
              name: 'Incidents',
              values: kpiData.metrics.map(m => m.incidents_24h || 0)
            }
          ]
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'stacked-bar',
            title: 'Network Metrics Over Time',
            description: 'Stacked bar chart of network metrics',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'area') {
      console.log('📊 [Dashboard] Fetching KPI metrics for area chart...');
      const kpiData = await fetchKPIMetrics();
      console.log(`✅ [Dashboard] KPI metrics fetched: ${kpiData.metrics?.length || 0} records`);
      if (kpiData.metrics && kpiData.metrics.length > 0) {
        const chartData = {
          categories: kpiData.metrics.map(m => new Date(m.timestamp).toLocaleDateString()),
          values: kpiData.metrics.map(m => m.network_health_score || 0)
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'area',
            title: 'Network Health Trend',
            description: 'Area chart showing network health over time',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'candlestick') {
      console.log('📊 [Dashboard] Fetching KPI metrics for candlestick chart...');
      const kpiData = await fetchKPIMetrics();
      console.log(`✅ [Dashboard] KPI metrics fetched: ${kpiData.metrics?.length || 0} records`);
      if (kpiData.metrics && kpiData.metrics.length > 0) {
        const chartData = {
          categories: kpiData.metrics.map(m => new Date(m.timestamp).toLocaleDateString()),
          values: kpiData.metrics.map(m => [
            Math.max(0, (m.network_health_score || 50) - 10),
            Math.min(100, (m.network_health_score || 50) + 10),
            m.network_health_score || 50,
            m.network_health_score || 50
          ])
        };
        if (validateChartData(type, chartData)) {
          return {
            type: 'candlestick',
            title: 'Network Health Statistics',
            description: 'Candlestick chart showing health score ranges',
            data: chartData,
            dataSource: 'postgresql'
          };
        }
      }
      return null;
    }

    if (type === 'sunburst') {
      console.log('📊 [Dashboard] Fetching sunburst data from Neo4j...');
      const sunburstData = await fetchSunburstData();
      console.log(`✅ [Dashboard] Sunburst data fetched: hierarchical alarm structure`);
      if (validateChartData(type, sunburstData)) {
        return {
          type: 'sunburst',
          title: 'Alarm Hierarchy Breakdown',
          description: 'Hierarchical view of alarms by severity, type, and region',
          data: sunburstData,
          dataSource: 'neo4j'
        };
      }
      return null;
    }
  } catch (error) {
    console.error('Error transforming data to chart format:', error);
  }

  // Return null if chart could not be generated with valid data
  console.log(`❌ [Dashboard] Chart type "${type}" could not be generated with valid data`);
  return null;
}

// Generate dashboard from natural language prompt
router.post('/generate', async (req, res) => {
  try {
    const { prompt, context = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log('\n' + '='.repeat(80));
    console.log('🚀 [Dashboard] Starting dashboard generation');
    console.log(`📝 [Dashboard] User prompt: "${prompt}"`);
    console.log('='.repeat(80));

    // Step 1: Enhance the prompt with database context
    console.log('📚 [Dashboard] Enhancing prompt with database context...');
    const enhancedPrompt = await enhanceQuery(prompt, {
      summary: 'Network topology with nodes, connections, alarms, devices, and threat events'
    });
    console.log(`✅ [Dashboard] Prompt enhanced`);

    // Step 2: Generate chart specifications using intelligent selection
    console.log('🎯 [Dashboard] Generating chart specifications...');
    const chartSpec = await generateChartSpecifications(enhancedPrompt);

    // Step 3: Create chart objects with real data
    console.log('📊 [Dashboard] Creating chart objects with real data...');
    const charts = await createChartsFromSpec(chartSpec);
    console.log(`✅ [Dashboard] Dashboard generation complete: ${charts.length} charts created`);
    console.log('='.repeat(80) + '\n');

    res.json({
      prompt,
      enhancedPrompt,
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
});

// Enhance dashboard prompt
router.post('/enhance-prompt', async (req, res) => {
  try {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const enhancedPrompt = await enhanceQuery(userPrompt, {
      summary: 'Network topology dashboard with alarm status, device health, and connection metrics'
    });

    res.json({
      originalPrompt: userPrompt,
      enhancedPrompt
    });
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({
      error: 'Failed to enhance prompt',
      details: error.message
    });
  }
});

// Get dashboard suggestions based on database schema
router.get('/suggestions', async (req, res) => {
  try {
    const suggestions = [
      {
        title: 'Network Health Overview',
        description: 'Monitor network nodes, connections, and alarm status',
        prompt: 'Create a dashboard showing network topology health with node status distribution and top alarms'
      },
      {
        title: 'Device Performance',
        description: 'Track device metrics and utilization',
        prompt: 'Build a dashboard displaying device performance metrics, CPU usage, and memory utilization trends'
      },
      {
        title: 'Alarm Analysis',
        description: 'Analyze alarm patterns and trends',
        prompt: 'Create a dashboard for alarm analysis showing alarm types, severity distribution, and resolution times'
      },
      {
        title: 'Connection Metrics',
        description: 'Monitor network connections and bandwidth',
        prompt: 'Generate a dashboard with connection statistics, bandwidth usage, and latency metrics'
      }
    ];

    res.json(suggestions);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    res.status(500).json({
      error: 'Failed to fetch suggestions',
      details: error.message
    });
  }
});

// Get database schema for AI context
router.get('/schema', async (req, res) => {
  try {
    const schema = await getDatabaseSchema();
    res.json(schema);
  } catch (error) {
    console.error('Error fetching schema:', error);
    res.status(500).json({
      error: 'Failed to fetch schema',
      details: error.message
    });
  }
});

// Get chart data by type
router.get('/data/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const { source = 'postgresql' } = req.query;

    let data;
    switch (type) {
      case 'topology':
        data = await fetchNetworkTopologyData();
        break;
      case 'alarms':
        data = await fetchAlarmData();
        break;
      case 'devices':
        data = await fetchDeviceMetrics();
        break;
      case 'threats':
        data = await fetchThreatEvents();
        break;
      case 'connections':
        data = await fetchConnectionMetrics();
        break;
      default:
        return res.status(400).json({ error: 'Unknown data type' });
    }

    res.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({
      error: 'Failed to fetch chart data',
      details: error.message
    });
  }
});

// Helper function to generate chart specifications based on prompt
async function generateChartSpecifications(prompt) {
  // Intelligent chart selection based on keywords in the prompt
  const charts = [];
  const promptLower = prompt.toLowerCase();

  console.log(`🔍 [Dashboard] Analyzing prompt for chart types: "${prompt}"`);

  // Define all available chart types with weights (higher = more likely to be selected)
  // Priority chart types (weight 3): Advanced, visually distinctive
  // Standard chart types (weight 1): Traditional, less visually distinctive
  const allChartTypes = [
    // ALWAYS INCLUDE - Network topology
    { type: 'network-topology', keywords: ['network', 'topology', 'nodes', 'connections'], dataSource: 'neo4j', weight: 5, priority: 'always' },

    // HIGH PRIORITY - Advanced, visually distinctive (weight 3)
    { type: 'sankey', keywords: ['flow', 'process', 'journey', 'propagation', 'threat'], dataSource: 'postgresql', weight: 3, priority: 'high' },
    { type: 'heatmap', keywords: ['intensity', 'density', 'traffic', 'frequency', 'region', 'heat'], dataSource: 'postgresql', weight: 3, priority: 'high' },
    { type: 'sunburst', keywords: ['hierarchy', 'hierarchical', 'breakdown', 'alarm', 'nested'], dataSource: 'neo4j', weight: 3, priority: 'high' },
    { type: 'treemap', keywords: ['hierarchy', 'hierarchical', 'categories', 'allocation', 'distribution'], dataSource: 'postgresql', weight: 3, priority: 'high' },
    { type: 'radar', keywords: ['metrics', 'comparison', 'multi-metric', 'performance', 'security'], dataSource: 'postgresql', weight: 3, priority: 'high' },
    { type: 'scatter', keywords: ['correlation', 'relationship', 'vs', 'compare', 'posture'], dataSource: 'postgresql', weight: 3, priority: 'high' },
    { type: 'funnel', keywords: ['funnel', 'pipeline', 'stages', 'conversion', 'resolution'], dataSource: 'postgresql', weight: 3, priority: 'high' },

    // MEDIUM PRIORITY - Specialized (weight 2)
    { type: 'candlestick', keywords: ['range', 'distribution', 'statistics', 'variance', 'health'], dataSource: 'postgresql', weight: 2, priority: 'medium' },
    { type: 'stacked-bar', keywords: ['stacked', 'composition', 'breakdown', 'multiple', 'combined'], dataSource: 'postgresql', weight: 2, priority: 'medium' },
    { type: 'area', keywords: ['area', 'cumulative', 'trend', 'growth', 'over time'], dataSource: 'postgresql', weight: 2, priority: 'medium' },

    // LOW PRIORITY - Traditional (weight 1)
    { type: 'line', keywords: ['trend', 'history', 'over time', '24 hour', 'timeline'], dataSource: 'postgresql', weight: 1, priority: 'low' },
    { type: 'pie', keywords: ['distribution', 'severity', 'breakdown', 'proportion'], dataSource: 'postgresql', weight: 1, priority: 'low' },
    { type: 'donut', keywords: ['distribution', 'breakdown', 'proportion', 'share'], dataSource: 'postgresql', weight: 1, priority: 'low' },
    { type: 'bar', keywords: ['comparison', 'compare', 'by type', 'count'], dataSource: 'postgresql', weight: 1, priority: 'low' },
    { type: 'horizontal-bar', keywords: ['comparison', 'compare', 'ranking', 'list'], dataSource: 'postgresql', weight: 1, priority: 'low' },
    { type: 'gauge', keywords: ['health', 'score', 'performance', 'percentage', 'status'], dataSource: 'postgresql', weight: 1, priority: 'low' }
  ];

  // Step 1: Always include network-topology if mentioned
  const networkTopology = allChartTypes.find(c => c.type === 'network-topology');
  if (promptLower.includes('network') || promptLower.includes('topology') || promptLower.includes('nodes')) {
    charts.push({
      type: networkTopology.type,
      description: 'Network topology visualization',
      dataSource: networkTopology.dataSource
    });
    console.log(`✅ [Dashboard] ALWAYS INCLUDED: network-topology (Neo4j)`);
  }

  // Step 2: Keyword-based selection for high-priority charts
  const matchedHighPriority = new Set();
  allChartTypes.filter(c => c.priority === 'high').forEach(chartDef => {
    if (chartDef.keywords.some(keyword => promptLower.includes(keyword))) {
      matchedHighPriority.add(chartDef.type);
      console.log(`✅ [Dashboard] Selected (HIGH PRIORITY): ${chartDef.type} (${chartDef.dataSource})`);
    }
  });

  // Add matched high-priority charts
  matchedHighPriority.forEach(chartType => {
    const chartDef = allChartTypes.find(c => c.type === chartType);
    charts.push({
      type: chartType,
      description: `${chartType} visualization`,
      dataSource: chartDef.dataSource
    });
  });

  // Step 3: Fill remaining slots with weighted random selection (favoring advanced types)
  const usedTypes = new Set(charts.map(c => c.type));
  const remainingCharts = allChartTypes.filter(c => !usedTypes.has(c.type));
  const chartsNeeded = Math.max(8 - charts.length, 0);

  if (chartsNeeded > 0 && remainingCharts.length > 0) {
    console.log(`📚 [Dashboard] Adding ${chartsNeeded} weighted random chart types for variety...`);

    // Create weighted selection pool (higher weight = more likely to be selected)
    const weightedPool = [];
    remainingCharts.forEach(chartDef => {
      for (let i = 0; i < chartDef.weight; i++) {
        weightedPool.push(chartDef);
      }
    });

    // Select random charts from weighted pool without duplicates
    const selectedCharts = new Set();
    for (let i = 0; i < chartsNeeded && weightedPool.length > 0; i++) {
      let chartDef;
      let attempts = 0;

      // Keep trying until we find a chart type we haven't selected yet
      do {
        chartDef = weightedPool[Math.floor(Math.random() * weightedPool.length)];
        attempts++;
      } while (selectedCharts.has(chartDef.type) && attempts < 10);

      if (!selectedCharts.has(chartDef.type)) {
        selectedCharts.add(chartDef.type);
        charts.push({
          type: chartDef.type,
          description: `${chartDef.type} visualization`,
          dataSource: chartDef.dataSource
        });
        console.log(`🎲 [Dashboard] Weighted random (${chartDef.priority}): ${chartDef.type} (weight: ${chartDef.weight})`);
      }
    }
  }

  // Step 4: If still no charts (shouldn't happen), provide defaults with advanced types
  if (charts.length === 0) {
    console.log('ℹ️  [Dashboard] No keywords matched, using default advanced charts');
    charts.push(
      { type: 'network-topology', description: 'Network topology overview', dataSource: 'neo4j' },
      { type: 'sankey', description: 'Threat flow analysis', dataSource: 'postgresql' },
      { type: 'heatmap', description: 'Traffic intensity', dataSource: 'postgresql' },
      { type: 'sunburst', description: 'Alarm hierarchy', dataSource: 'neo4j' },
      { type: 'treemap', description: 'Device distribution', dataSource: 'postgresql' },
      { type: 'radar', description: 'Security metrics', dataSource: 'postgresql' },
      { type: 'scatter', description: 'Correlation analysis', dataSource: 'postgresql' },
      { type: 'funnel', description: 'Threat pipeline', dataSource: 'postgresql' }
    );
  }

  console.log(`📊 [Dashboard] Total charts to generate: ${charts.length}`);
  // Return up to 8 charts
  return charts.slice(0, 8);
}

// Helper function to create chart objects with real data
async function createChartsFromSpec(specs) {
  const charts = [];
  const fallbackChartTypes = ['line', 'bar', 'pie', 'gauge', 'area', 'scatter', 'donut', 'horizontal-bar'];

  for (let idx = 0; idx < specs.length; idx++) {
    const spec = specs[idx];
    let chartData = await transformDataToChartFormat(spec);

    // If chart validation failed (returned null), try fallback chart types
    if (chartData === null) {
      console.log(`⚠️  [Dashboard] Chart type "${spec.type}" failed validation, attempting fallback...`);
      let fallbackAttempted = false;

      for (const fallbackType of fallbackChartTypes) {
        if (fallbackType === spec.type) continue; // Skip the original type

        const fallbackSpec = { ...spec, type: fallbackType };
        const fallbackData = await transformDataToChartFormat(fallbackSpec);

        if (fallbackData !== null) {
          console.log(`✅ [Dashboard] Fallback successful: Using "${fallbackType}" instead of "${spec.type}"`);
          chartData = fallbackData;
          fallbackAttempted = true;
          break;
        }
      }

      if (!fallbackAttempted) {
        console.log(`❌ [Dashboard] All fallback attempts failed for chart type "${spec.type}", skipping chart`);
        continue; // Skip this chart entirely
      }
    }

    charts.push({
      id: `chart-${Date.now()}-${idx}`,
      type: chartData.type,
      title: chartData.title,
      description: chartData.description,
      dataSource: chartData.dataSource,
      data: chartData.data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return charts;
}

export default router;

