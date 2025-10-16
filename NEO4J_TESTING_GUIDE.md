# Neo4j Integration Testing Guide

## Quick Start

### 1. Start the Development Server
```bash
pnpm dev
```

This will:
- Start Vite dev server on http://localhost:5173
- Start Express backend on http://localhost:3001
- Initialize Neo4j connection automatically

### 2. Verify Backend Connection

Open a new terminal and test the health endpoint:
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-16T...",
  "service": "T-Mobile TruContext Demo API"
}
```

### 3. Test Neo4j Endpoints

#### Get all nodes (should be empty initially)
```bash
curl http://localhost:3001/api/network-topology/nodes
```

#### Get statistics
```bash
curl http://localhost:3001/api/network-topology/stats
```

## Frontend Testing

### 1. Navigate to Graph Analytics Dashboard
- Open http://localhost:5173
- Click on "Graph Analytics" in the sidebar
- Or navigate directly to `/graph-analytics`

### 2. Test Dataset Manager

#### Sync to Neo4j
1. Click "Sync to Neo4j" button
2. Should see loading spinner
3. Should see success message: "Dataset synced to Neo4j successfully!"
4. Check browser console for any errors

#### Load from Neo4j
1. Click "Load from Neo4j" button
2. Should see loading spinner
3. Should see success message: "Dataset loaded from Neo4j successfully!"
4. Verify nodes and edges count matches

#### Upload Dataset
1. Click "Upload Dataset" button
2. Select a JSON file with network topology data
3. Should see success message with node/edge count

#### Download Dataset
1. Click "Download Dataset" button
2. Should download `tmobile-network-dataset-YYYY-MM-DD.json`
3. Verify file contains nodes, edges, and metadata

#### Reset to Default
1. Click "Reset to Default" button
2. Confirm in dialog
3. Should see success message
4. Dataset should reset to 25 nodes and 40+ edges

### 3. Test All Dashboards

Navigate to each dashboard and verify they load correctly:
- `/network-topology` - Network Topology Dashboard
- `/geographic-map` - Geographic Map Dashboard
- `/ai-analytics` - AI Analytics Dashboard
- `/graph-analytics` - Graph Analytics Dashboard

## Fallback Testing

### Test Neo4j Fallback to localStorage

1. **Simulate Neo4j Offline:**
   - Open DevTools (F12)
   - Go to Network tab
   - Right-click on any request to `/api/network-topology`
   - Select "Block URL"

2. **Reload Page:**
   - Refresh the page
   - Should still load data from localStorage
   - Check console for warning: "Neo4j unavailable, falling back to localStorage"

3. **Unblock URL:**
   - Right-click blocked request
   - Select "Unblock URL"

### Test localStorage Fallback to Mock Data

1. **Clear localStorage:**
   - Open DevTools (F12)
   - Go to Application tab
   - Click "Local Storage"
   - Delete `tmobile_network_dataset` entry

2. **Block Neo4j:**
   - Block `/api/network-topology` requests (see above)

3. **Reload Page:**
   - Refresh the page
   - Should generate new mock data
   - Check console for fallback messages

## API Testing with cURL

### Create a Node
```bash
curl -X POST http://localhost:3001/api/network-topology/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "id": "test-node-1",
    "name": "Test Node",
    "type": "router",
    "status": "active",
    "location": "New York",
    "region": "northeast",
    "capacity": 1000,
    "vendor": "Cisco",
    "model": "ASR 9000",
    "uptime": 99.9,
    "coverage_radius": 50,
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

### Get All Nodes
```bash
curl http://localhost:3001/api/network-topology/nodes
```

### Get Nodes by Type
```bash
curl http://localhost:3001/api/network-topology/nodes/type/router
```

### Get Nodes by Region
```bash
curl http://localhost:3001/api/network-topology/nodes/region/northeast
```

### Update a Node
```bash
curl -X PUT http://localhost:3001/api/network-topology/nodes/test-node-1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "maintenance",
    "uptime": 95.5
  }'
```

### Delete a Node
```bash
curl -X DELETE http://localhost:3001/api/network-topology/nodes/test-node-1
```

### Seed Database
```bash
curl -X POST http://localhost:3001/api/network-topology/seed \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [...],
    "edges": [...]
  }'
```

### Export Data
```bash
curl http://localhost:3001/api/network-topology/export > export.json
```

### Get Statistics
```bash
curl http://localhost:3001/api/network-topology/stats
```

### Clear Database
```bash
curl -X DELETE http://localhost:3001/api/network-topology/clear
```

## Browser DevTools Testing

### 1. Network Tab
- Monitor requests to `/api/network-topology/*`
- Check response times
- Verify response payloads

### 2. Console Tab
- Check for errors or warnings
- Look for Neo4j connection messages
- Verify fallback messages

### 3. Application Tab
- Check localStorage for `tmobile_network_dataset`
- Verify data structure
- Monitor storage size

## Performance Testing

### 1. Load Time
- Open DevTools Performance tab
- Reload page
- Check time to load data
- Should be < 2 seconds

### 2. Sync Operations
- Click "Sync to Neo4j"
- Monitor time in DevTools
- Should complete in < 5 seconds

### 3. Large Dataset
- Export current dataset
- Modify to include 100+ nodes
- Upload modified dataset
- Verify performance

## Troubleshooting

### Neo4j Connection Failed
1. Check `.env` file has correct credentials
2. Verify Neo4j Aura instance is running
3. Check network connectivity
4. Review server console for error messages

### Sync Button Not Working
1. Check browser console for errors
2. Verify backend is running on port 3001
3. Check Network tab for failed requests
4. Verify Neo4j credentials in `.env`

### Data Not Persisting
1. Check if Neo4j sync was successful
2. Verify localStorage is enabled
3. Check browser storage quota
4. Review console for errors

### Fallback Not Working
1. Verify localStorage is enabled
2. Check if mock data generation works
3. Review console for error messages
4. Try clearing localStorage and reloading

## Success Criteria

✅ Backend starts without errors
✅ Neo4j connection established
✅ All API endpoints respond correctly
✅ Frontend loads data from Neo4j
✅ Sync to Neo4j works
✅ Load from Neo4j works
✅ Fallback to localStorage works
✅ Fallback to mock data works
✅ All dashboards display correctly
✅ No console errors
✅ Performance acceptable

## Next Steps

After successful testing:
1. Deploy to production
2. Monitor Neo4j performance
3. Set up automated backups
4. Configure alerts for connection failures
5. Document for team

