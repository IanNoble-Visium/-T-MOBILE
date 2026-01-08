# Quick Test Guide - Dashboard Logging Verification

## Quick Start

### 1. Start the Server
```bash
node server/index.js
```

**Expected Output**:
```
✅ Neo4j connection established
✅ PostgreSQL connection established
Server running on port 3001
```

### 2. Open Browser
```
http://localhost:5173
```

### 3. Navigate to AI Dashboards
- Click "AI Dashboards" in sidebar
- Click "Create Dashboard" button

## Test Scenarios

### Test 1: Network Topology Only
**Prompt**: `Show me the network topology`

**Expected Logs**:
```
✅ [Dashboard] Selected: network-topology (Neo4j)
📊 [Dashboard] Fetching network topology from Neo4j...
🔗 [Neo4j] Executing query: MATCH (n:NetworkNode) RETURN n LIMIT 200
✅ [Neo4j] Fetched X network nodes
🔗 [Neo4j] Executing query: MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode) RETURN edge LIMIT 500
✅ [Neo4j] Fetched Y network connections
```

**Expected Result**: Network topology chart with real nodes and connections

---

### Test 2: Threat Analysis
**Prompt**: `Show threat events by severity`

**Expected Logs**:
```
✅ [Dashboard] Selected: pie chart (PostgreSQL)
📊 [Dashboard] Fetching threat events from PostgreSQL...
📊 [PostgreSQL] Executing query: SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours' LIMIT 100
✅ [PostgreSQL] Fetched Z threat events from last 24 hours
```

**Expected Result**: Pie chart showing threat severity distribution

---

### Test 3: Health Metrics
**Prompt**: `Display network health score`

**Expected Logs**:
```
✅ [Dashboard] Selected: gauge chart (PostgreSQL)
📊 [Dashboard] Fetching KPI metrics from PostgreSQL for gauge...
📊 [PostgreSQL] Executing query: SELECT * FROM kpi_metrics LIMIT 30
✅ [PostgreSQL] Fetched 30 KPI metric records
```

**Expected Result**: Gauge chart showing network health percentage

---

### Test 4: Trends
**Prompt**: `Show network health trends over time`

**Expected Logs**:
```
✅ [Dashboard] Selected: line chart (PostgreSQL)
📊 [Dashboard] Fetching KPI metrics from PostgreSQL...
📊 [PostgreSQL] Executing query: SELECT * FROM kpi_metrics LIMIT 30
✅ [PostgreSQL] Fetched 30 KPI metric records
```

**Expected Result**: Line chart showing health score trends

---

### Test 5: Device Comparison
**Prompt**: `Compare devices by type`

**Expected Logs**:
```
✅ [Dashboard] Selected: bar chart (PostgreSQL)
📊 [Dashboard] Fetching device metrics from PostgreSQL...
📊 [PostgreSQL] Executing query: SELECT * FROM devices LIMIT 50
✅ [PostgreSQL] Fetched N device records
```

**Expected Result**: Bar chart showing device count by type

---

### Test 6: Combined Dashboard (MOST IMPORTANT)
**Prompt**: `Create a dashboard that shows network topology with alarm status and utilization metrics`

**Expected Logs**:
```
✅ [Dashboard] Selected: network-topology (Neo4j)
✅ [Dashboard] Selected: pie chart (PostgreSQL)
✅ [Dashboard] Selected: gauge chart (PostgreSQL)
📊 [Dashboard] Total charts to generate: 3
📊 [Dashboard] Fetching network topology from Neo4j...
🔗 [Neo4j] Executing query: MATCH (n:NetworkNode) RETURN n LIMIT 200
✅ [Neo4j] Fetched X network nodes
🔗 [Neo4j] Executing query: MATCH (source:NetworkNode)-[rel:CONNECTED_TO]->(target:NetworkNode) RETURN edge LIMIT 500
✅ [Neo4j] Fetched Y network connections
📊 [Dashboard] Fetching threat events from PostgreSQL...
📊 [PostgreSQL] Executing query: SELECT * FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours' LIMIT 100
✅ [PostgreSQL] Fetched Z threat events from last 24 hours
📊 [Dashboard] Fetching KPI metrics from PostgreSQL for gauge...
📊 [PostgreSQL] Executing query: SELECT * FROM kpi_metrics LIMIT 30
✅ [PostgreSQL] Fetched 30 KPI metric records
✅ [Dashboard] Dashboard generation complete: 3 charts created
```

**Expected Result**: 
- Network topology chart (Neo4j data)
- Threat distribution pie chart (PostgreSQL data)
- Network health gauge chart (PostgreSQL data)

---

## Verification Checklist

### Neo4j Integration
- [ ] "network topology" prompt triggers Neo4j selection
- [ ] Neo4j queries appear in logs
- [ ] Node count is > 0
- [ ] Edge count is > 0
- [ ] Network topology chart displays real node names
- [ ] Nodes are color-coded (magenta/orange/gray)
- [ ] Connections are visible between nodes

### PostgreSQL Integration
- [ ] "threat" prompt triggers PostgreSQL selection
- [ ] PostgreSQL queries appear in logs
- [ ] Data counts are > 0
- [ ] Charts display real data
- [ ] Multiple chart types work (pie, bar, gauge, line, scatter)

### Combined Integration
- [ ] Combined prompt triggers both Neo4j and PostgreSQL
- [ ] All queries appear in logs
- [ ] All charts are created
- [ ] Dashboard displays all charts correctly

### Logging
- [ ] Logs show clear flow with symbols (🚀, ✅, 📊, 🔗)
- [ ] Logs show database source (Neo4j vs PostgreSQL)
- [ ] Logs show data counts
- [ ] Logs show query execution
- [ ] Logs show completion status

---

## Troubleshooting

### Issue: No Neo4j Logs Appearing
**Solution**: 
1. Check prompt contains "network", "topology", or "nodes"
2. Verify Neo4j connection at startup
3. Check Neo4j database has NetworkNode data

### Issue: No PostgreSQL Logs Appearing
**Solution**:
1. Check prompt contains relevant keywords
2. Verify PostgreSQL connection at startup
3. Check database tables have data

### Issue: Charts Not Displaying
**Solution**:
1. Check browser console for errors
2. Verify all logs show successful data fetching
3. Check data counts are > 0

### Issue: Wrong Chart Type Selected
**Solution**:
1. Check prompt keywords match selection logic
2. Refine prompt with more specific keywords
3. Check logs for keyword analysis

---

## Log Symbols Reference

| Symbol | Meaning |
|--------|---------|
| 🚀 | Starting operation |
| 📝 | User input |
| 🔍 | Analyzing |
| ✅ | Success |
| ❌ | Error |
| 📊 | Dashboard/chart |
| 🔗 | Database query |
| 📚 | Enhancement |
| 🎯 | Selection |
| ℹ️  | Information |

---

## Performance Expectations

- **Dashboard Generation**: < 2 seconds
- **Neo4j Query**: < 500ms
- **PostgreSQL Query**: < 500ms
- **Data Transformation**: < 100ms
- **Chart Rendering**: < 1 second

---

## Success Criteria

✅ **All tests pass when**:
1. Neo4j queries execute for network topology prompts
2. PostgreSQL queries execute for other prompts
3. Logs show clear flow with data counts
4. Charts display real data from databases
5. Combined dashboards show both Neo4j and PostgreSQL data
6. No errors in browser console
7. No errors in server logs

---

## Next Steps

1. Run all 6 test scenarios
2. Verify logs match expected output
3. Verify charts display correctly
4. Check data counts are realistic
5. Monitor performance metrics
6. Deploy to production when ready

---

## Support

For issues or questions:
1. Check DASHBOARD_LOGGING_GUIDE.md for detailed logging info
2. Check NEO4J_INTEGRATION_VERIFICATION.md for integration details
3. Check DASHBOARD_API_GUIDE.md for API documentation
4. Review server logs for error messages
5. Check browser console for client-side errors

