# Dashboard Generation - Comprehensive Logging Guide

## Overview
Enhanced logging has been added to the dashboard generation feature to provide complete visibility into:
- Chart type selection based on user prompts
- Neo4j query execution for network topology data
- PostgreSQL query execution for security and metrics data
- Data transformation and chart creation process

## Log Output Format

### Dashboard Generation Flow

```
================================================================================
🚀 [Dashboard] Starting dashboard generation
📝 [Dashboard] User prompt: "Create a dashboard that shows network topology with alarm status and utilization metrics"
================================================================================
🔍 [Dashboard] Analyzing prompt for chart types: "Create a dashboard that shows network topology with alarm status and utilization metrics"
✅ [Dashboard] Selected: network-topology (Neo4j)
✅ [Dashboard] Selected: pie chart (PostgreSQL)
✅ [Dashboard] Selected: gauge chart (PostgreSQL)
📊 [Dashboard] Total charts to generate: 3
📚 [Dashboard] Enhancing prompt with database context...
✅ [Dashboard] Prompt enhanced
🎯 [Dashboard] Generating chart specifications...
📊 [Dashboard] Creating chart objects with real data...
📊 [Dashboard] Fetching network topology from Neo4j...
🔗 [Neo4j] Executing query: MATCH (n:NetworkNode) RETURN n LIMIT 200
✅ [Neo4j] Fetched 15 network nodes
🔗 [Neo4j] Executing query: MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode) RETURN edge LIMIT 500
✅ [Neo4j] Fetched 24 network connections
📊 [Dashboard] Fetching threat events from PostgreSQL...
📊 [PostgreSQL] Executing query: SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours' LIMIT 100
✅ [PostgreSQL] Fetched 45 threat events from last 24 hours
📊 [Dashboard] Fetching KPI metrics from PostgreSQL for gauge...
📊 [PostgreSQL] Executing query: SELECT * FROM kpi_metrics LIMIT 30
✅ [PostgreSQL] Fetched 30 KPI metric records
✅ [Dashboard] Dashboard generation complete: 3 charts created
================================================================================
```

## Log Symbols

| Symbol | Meaning |
|--------|---------|
| 🚀 | Starting operation |
| 📝 | User input/prompt |
| 🔍 | Analyzing/searching |
| ✅ | Success/completed |
| ❌ | Error/failed |
| 📊 | Dashboard/chart operation |
| 🔗 | Database query |
| 📚 | Data enhancement |
| 🎯 | Targeting/selection |

## Log Levels

### [Dashboard] - Main Dashboard Operations
- Dashboard generation start/end
- Chart type selection
- Chart creation progress
- Overall flow tracking

### [Neo4j] - Network Topology Queries
- Network node queries
- Connection/relationship queries
- Query execution details
- Result counts

### [PostgreSQL] - Security & Metrics Queries
- Device metric queries
- Threat event queries
- KPI metric queries
- Query execution details

## Example Scenarios

### Scenario 1: Network Topology Request
**Prompt**: "Show me the network topology"

**Expected Logs**:
```
✅ [Dashboard] Selected: network-topology (Neo4j)
📊 [Dashboard] Fetching network topology from Neo4j...
🔗 [Neo4j] Executing query: MATCH (n:NetworkNode) RETURN n LIMIT 200
✅ [Neo4j] Fetched X network nodes
🔗 [Neo4j] Executing query: MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode) RETURN edge LIMIT 500
✅ [Neo4j] Fetched Y network connections
```

### Scenario 2: Threat Analysis Request
**Prompt**: "Show threat events by severity"

**Expected Logs**:
```
✅ [Dashboard] Selected: pie chart (PostgreSQL)
📊 [Dashboard] Fetching threat events from PostgreSQL...
📊 [PostgreSQL] Executing query: SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours' LIMIT 100
✅ [PostgreSQL] Fetched Z threat events from last 24 hours
```

### Scenario 3: Health Metrics Request
**Prompt**: "Display network health score and trends"

**Expected Logs**:
```
✅ [Dashboard] Selected: gauge chart (PostgreSQL)
✅ [Dashboard] Selected: line chart (PostgreSQL)
📊 [Dashboard] Fetching KPI metrics from PostgreSQL for gauge...
📊 [PostgreSQL] Executing query: SELECT * FROM kpi_metrics LIMIT 30
✅ [PostgreSQL] Fetched 30 KPI metric records
📊 [Dashboard] Fetching KPI metrics from PostgreSQL...
✅ [PostgreSQL] Fetched 30 KPI metric records
```

### Scenario 4: Combined Request
**Prompt**: "Create a dashboard that shows network topology with alarm status and utilization metrics"

**Expected Logs**:
```
✅ [Dashboard] Selected: network-topology (Neo4j)
✅ [Dashboard] Selected: pie chart (PostgreSQL)
✅ [Dashboard] Selected: gauge chart (PostgreSQL)
📊 [Dashboard] Total charts to generate: 3
[Neo4j queries for network topology]
[PostgreSQL queries for threat events]
[PostgreSQL queries for KPI metrics]
✅ [Dashboard] Dashboard generation complete: 3 charts created
```

## Troubleshooting with Logs

### Issue: No Neo4j Queries Appearing
**Check**:
1. Is "network", "topology", or "nodes" in the prompt?
2. Look for: `✅ [Dashboard] Selected: network-topology (Neo4j)`
3. If not selected, refine prompt with network-related keywords

**Example Fix**:
```
❌ Prompt: "Show me the data"
✅ Prompt: "Show me the network topology"
```

### Issue: Neo4j Query Executed but No Data
**Check**:
1. Look for: `✅ [Neo4j] Fetched 0 network nodes`
2. Verify Neo4j database has NetworkNode data
3. Check Neo4j connection status at startup

**Example Log**:
```
✅ [Neo4j] Fetched 0 network nodes  ← Problem: No data in database
```

### Issue: PostgreSQL Query Failed
**Check**:
1. Look for: `❌ [PostgreSQL] Error fetching...`
2. Check database connection
3. Verify table exists and has data

**Example Log**:
```
❌ [PostgreSQL] Error fetching threat events: Connection refused
```

### Issue: Chart Type Not Selected
**Check**:
1. Look for: `🔍 [Dashboard] Analyzing prompt for chart types`
2. Verify keywords match the selection logic
3. Check if default charts are used instead

**Example Log**:
```
ℹ️  [Dashboard] No keywords matched, using default charts
```

## Keyword Matching

The following keywords trigger specific chart types:

| Keywords | Chart Type | Database |
|----------|-----------|----------|
| network, topology, nodes | network-topology | Neo4j |
| trend, history, over time, 24 hour | line | PostgreSQL |
| distribution, severity, breakdown | pie | PostgreSQL |
| comparison, compare, by type | bar | PostgreSQL |
| health, score, performance, percentage | gauge | PostgreSQL |
| correlation, relationship, vs | scatter | PostgreSQL |

## Performance Metrics in Logs

Look for these indicators:
- **Query Execution**: `🔗 [Neo4j/PostgreSQL] Executing query...`
- **Result Count**: `✅ [Neo4j/PostgreSQL] Fetched X records`
- **Chart Creation**: `📊 [Dashboard] Creating chart objects with real data...`
- **Completion**: `✅ [Dashboard] Dashboard generation complete: X charts created`

## Real-Time Monitoring

To monitor dashboard generation in real-time:

```bash
# Terminal 1: Start the server
node server/index.js

# Terminal 2: Watch logs (on Linux/Mac)
tail -f server.log | grep Dashboard

# Terminal 2: Watch logs (on Windows PowerShell)
Get-Content server.log -Wait | Select-String "Dashboard"
```

## Log Retention

Logs are printed to console. To save logs to file:

```bash
# Redirect to file
node server/index.js > dashboard.log 2>&1

# Or use a logging library (future enhancement)
```

## Debugging Tips

1. **Enable verbose logging**: All logs are enabled by default
2. **Search for errors**: Look for `❌` symbols
3. **Track data flow**: Follow the 🔗 symbols to see queries
4. **Verify selections**: Check ✅ symbols for chart type selection
5. **Monitor performance**: Count the number of queries and results

## Next Steps

- Monitor logs during dashboard generation
- Verify Neo4j and PostgreSQL queries are executing
- Check data counts match expectations
- Adjust query limits if needed
- Add custom logging for specific use cases

