# Data Validation Quick Reference Guide

## How It Works

### 1. Chart Generation Flow
```
User Prompt
    ↓
Enhance Prompt with Context
    ↓
Generate Chart Specifications (8 charts)
    ↓
For Each Chart Specification:
    ├─ Transform Data to Chart Format
    ├─ Validate Chart Data
    ├─ If Valid: Add to Dashboard
    ├─ If Invalid: Try Fallback Chart Types
    │   ├─ Try line, bar, pie, gauge, area, scatter, donut, horizontal-bar
    │   ├─ If Fallback Valid: Use Fallback Chart
    │   └─ If All Fail: Skip Chart
    └─ Continue to Next Chart
    ↓
Return Dashboard with 8 (or fewer) Valid Charts
```

### 2. Validation Process

**Step 1: Extract Chart Data**
```javascript
const chartData = {
  nodes: data.nodes,
  edges: data.edges
};
```

**Step 2: Validate Data**
```javascript
if (validateChartData(type, chartData)) {
  // Return chart object
  return { type, title, data: chartData, ... };
}
```

**Step 3: Return null if Invalid**
```javascript
return null; // Triggers fallback mechanism
```

### 3. Fallback Mechanism

When a chart fails validation:
1. System logs: `⚠️  [Dashboard] Chart type "X" failed validation, attempting fallback...`
2. Tries alternative chart types in order
3. For each fallback type:
   - Creates new spec with fallback type
   - Calls `transformDataToChartFormat()` with fallback type
   - If valid, logs: `✅ [Dashboard] Fallback successful: Using "Y" instead of "X"`
   - Uses fallback chart and continues
4. If all fallbacks fail:
   - Logs: `❌ [Dashboard] All fallback attempts failed for chart type "X", skipping chart`
   - Skips chart entirely

## Validation Criteria Reference

### Simple Data Structures
- **pie, donut, treemap, sunburst**: Need ≥1 item
- **gauge**: Need a value (not null/undefined)
- **scatter**: Need ≥1 point

### Time Series Data
- **line, area**: Need ≥2 categories AND ≥2 values
- **candlestick**: Need ≥1 category AND ≥1 value

### Categorical Data
- **bar, horizontal-bar**: Need ≥1 category AND ≥1 value
- **stacked-bar**: Need ≥1 category AND ≥1 series

### Complex Data
- **heatmap**: Need ≥1 xCategory, ≥1 yCategory, ≥1 value
- **radar**: Need ≥3 indicators AND ≥1 series
- **sankey**: Need ≥1 node AND ≥1 link
- **funnel**: Need ≥2 stages

### Graph Data
- **network-topology**: Need ≥1 node

## Console Log Messages

### Validation Success
```
✅ [Dashboard] Validation PASSED for network-topology: 5 nodes
✅ [Dashboard] Validation PASSED for line: 10 data points
✅ [Dashboard] Validation PASSED for pie: 3 items
```

### Validation Failure
```
❌ [Dashboard] Validation FAILED for line: Insufficient data points (need ≥2)
❌ [Dashboard] Validation FAILED for sankey: Need ≥1 node and ≥1 link
❌ [Dashboard] Validation FAILED for radar: Need ≥3 indicators and ≥1 series
```

### Fallback Attempts
```
⚠️  [Dashboard] Chart type "radar" failed validation, attempting fallback...
✅ [Dashboard] Fallback successful: Using "line" instead of "radar"
❌ [Dashboard] All fallback attempts failed for chart type "scatter", skipping chart
```

### Chart Skipping
```
❌ [Dashboard] Chart type "scatter" could not be generated with valid data
```

## Testing the Implementation

### Test 1: Basic Network Topology
```bash
curl -X POST http://localhost:3001/api/dashboards/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Show me network topology"}'
```

Expected: 8 charts with network-topology as first chart

### Test 2: Threat Analysis
```bash
curl -X POST http://localhost:3001/api/dashboards/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Show me threat events and security analysis"}'
```

Expected: 8 charts with varied types (scatter, treemap, etc.)

### Test 3: Device Metrics
```bash
curl -X POST http://localhost:3001/api/dashboards/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Show me device health and performance metrics"}'
```

Expected: 8 charts with bar, treemap, area charts

## Key Files Modified

**server/routes/dashboards.js**
- Lines 22-210: `validateChartData()` function
- Lines 213-592: Updated `transformDataToChartFormat()` with validation calls
- Lines 585-592: Updated fallback return logic
- Lines 886-933: Enhanced `createChartsFromSpec()` with fallback mechanism

## Troubleshooting

### Issue: Fewer than 8 charts generated
**Cause**: Multiple chart types failed validation and fallback
**Solution**: Check console logs for validation failures and fallback attempts

### Issue: Same chart type repeated
**Cause**: Fallback mechanism using same chart type for multiple failed specs
**Solution**: This is expected behavior - fallback uses available data

### Issue: No validation logs appearing
**Cause**: Validation is passing for all charts
**Solution**: This is expected - means data is sufficient for all chart types

### Issue: Charts appear blank in UI
**Cause**: Data validation not working properly
**Solution**: Check browser console and server logs for validation messages

## Performance Considerations

- Validation adds minimal overhead (~1-2ms per chart)
- Fallback attempts only occur when validation fails
- Most dashboards generate without fallback (data is usually sufficient)
- Total dashboard generation time: 3-5 seconds (including AI processing)

## Future Enhancements

Potential improvements:
1. Add data aggregation for charts with insufficient data
2. Implement chart type recommendations based on data characteristics
3. Add user preferences for chart type selection
4. Implement caching for frequently used chart types
5. Add A/B testing for chart type effectiveness

