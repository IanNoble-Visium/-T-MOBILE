# AI Dashboard Generation Enhancements

## Overview
Enhanced the dashboard generation feature to use real data from Neo4j Aura and PostgreSQL databases instead of mock data, with intelligent chart type selection based on user prompts.

## Key Improvements

### 1. Real Data Integration

#### Neo4j Data Fetching
- **Network Topology Graph**: Fetches actual nodes and edges from Neo4j with properties:
  - Node properties: id, name, type, status, region, latitude, longitude
  - Edge properties: source, target, bandwidth, latency, status
  - Supports up to 200 nodes and 500 edges for visualization

- **Alarm Data**: Queries actual alarm nodes with:
  - id, name, severity, status, createdAt
  - Calculates severity distribution (critical, high, medium, low)

- **Connection Metrics**: Fetches CONNECTED_TO relationships between nodes
  - Bandwidth, latency, and status information

#### PostgreSQL Data Fetching
- **Device Metrics**: Real device data with:
  - Security posture scores
  - Threat detection counts
  - Compliance status
  - Last seen timestamps

- **Threat Events**: Actual threat data from last 24 hours:
  - Event type, severity, status, confidence
  - Enables severity-based distribution analysis

- **KPI Metrics**: Time-series data for trends:
  - Network health score, threats detected/blocked
  - Active incidents, protected devices
  - Uptime percentage

### 2. Intelligent Chart Type Selection

The system now intelligently selects chart types based on keywords in user prompts:

| Keyword | Chart Type | Data Source |
|---------|-----------|-------------|
| network, topology, nodes | network-topology | Neo4j |
| trend, history, 24 hour | line | PostgreSQL |
| distribution, severity, breakdown | pie | PostgreSQL |
| comparison, compare, by type | bar | PostgreSQL |
| health, score, performance, percentage | gauge | PostgreSQL |
| correlation, relationship, vs | scatter | PostgreSQL |

### 3. New Chart Type: Network Topology

Implemented force-directed graph visualization with:
- **Node Rendering**: 
  - Color-coded by status (active=magenta, warning=orange, inactive=gray)
  - Labels showing node names
  - Interactive pan/zoom

- **Edge Rendering**:
  - Color-coded by connection status
  - Bandwidth/latency information in tooltips

- **Force Simulation**:
  - Repulsion: 100 (prevents node overlap)
  - Gravity: 0.1 (keeps graph centered)
  - Edge length: 100 (controls spacing)

### 4. Data Transformation Pipeline

New function `transformDataToChartFormat()` converts database results to chart-specific formats:

```
Database Query → Transform → Chart Format
  ↓
Neo4j/PostgreSQL → Real Data → ECharts Compatible
```

Each chart type has specific transformation logic:
- **Line**: Time-series data with dates and values
- **Bar**: Categorical data with counts
- **Pie**: Severity/type distribution
- **Gauge**: Single metric percentage
- **Scatter**: Two-dimensional correlation
- **Network-Topology**: Nodes and edges for graph visualization

### 5. Real-Time Updates

Enhanced real-time update logic to handle network topology:
- Network nodes randomly update status (active/warning)
- Other chart types continue with realistic data variations
- Updates maintain data integrity (no negative values)

## Files Modified

### Backend
1. **server/services/dashboardData.js**
   - Added `fetchKPIMetrics()` - Time-series KPI data
   - Added `fetchNetworkTopologyGraph()` - Nodes and edges
   - Updated `fetchDeviceMetrics()` - Real device data
   - Updated `fetchThreatEvents()` - Real threat data
   - Updated `fetchConnectionMetrics()` - Real connections
   - Updated `generateChartData()` - Support for new chart types

2. **server/routes/dashboards.js**
   - Added `transformDataToChartFormat()` - Data transformation
   - Updated `generateChartSpecifications()` - Intelligent chart selection
   - Updated `createChartsFromSpec()` - Async data fetching
   - Updated `/generate` endpoint - Real data integration

### Frontend
1. **src/components/dashboards/ChartComponent.jsx**
   - Added network-topology chart case in `prepareChartOptions()`
   - Force-directed graph configuration with ECharts
   - Updated `generateMockDataUpdate()` - Network topology updates
   - Color-coding based on node status

## Database Schema Alignment

### Neo4j Queries
- `MATCH (n:NetworkNode)` - Fetch network nodes
- `MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode)` - Fetch connections
- `MATCH (a:Alarm)` - Fetch alarm data

### PostgreSQL Queries
- `SELECT * FROM devices` - Device metrics
- `SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours'` - Recent threats
- `SELECT * FROM kpi_metrics ORDER BY timestamp DESC LIMIT 30` - KPI trends

## Example Usage

### Request
```json
{
  "prompt": "Show me network topology with alarm severity distribution and device health metrics"
}
```

### Response
```json
{
  "prompt": "Show me network topology with alarm severity distribution and device health metrics",
  "enhancedPrompt": "...",
  "charts": [
    {
      "id": "chart-...-0",
      "type": "network-topology",
      "title": "Network Topology",
      "description": "Real-time network topology visualization",
      "dataSource": "neo4j",
      "data": {
        "nodes": [...],
        "edges": [...]
      }
    },
    {
      "id": "chart-...-1",
      "type": "pie",
      "title": "Threat Events by Severity",
      "description": "Distribution of threat events by severity level",
      "dataSource": "postgresql",
      "data": {
        "items": [
          {"name": "Critical", "value": 5},
          {"name": "High", "value": 12}
        ]
      }
    },
    {
      "id": "chart-...-2",
      "type": "gauge",
      "title": "Network Health Score",
      "description": "Current overall network health percentage",
      "dataSource": "postgresql",
      "data": {"value": 87}
    }
  ]
}
```

## Benefits

1. **Realistic Data**: Dashboards now display actual network and security metrics
2. **Immediate Usefulness**: No need to populate with sample data
3. **Intelligent Selection**: Chart types match the data and user intent
4. **Real-Time Monitoring**: Live updates reflect actual system state
5. **Better Insights**: Users can immediately see network topology and threat patterns
6. **Scalable**: Supports up to 200 nodes and 500 connections in topology visualization

## Future Enhancements

- Add filtering options (by region, device type, severity)
- Implement drill-down capabilities for detailed analysis
- Add export functionality (PDF, CSV)
- Support for custom date ranges
- Anomaly detection highlighting
- Performance optimization for large datasets

