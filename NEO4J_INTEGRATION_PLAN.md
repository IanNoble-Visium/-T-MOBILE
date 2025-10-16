# Neo4j Integration Implementation Plan

## Executive Summary

Implement Neo4j Aura database integration for persistent storage of network topology data (nodes and edges) while maintaining backward compatibility with existing mock data and localStorage fallback.

## Current State Analysis

✅ **Verified:**
- Neo4j is NOT currently used in the application
- No Neo4j driver imports or environment variables exist
- Application uses localStorage for network topology persistence
- Mock data is generated on-the-fly in `src/lib/networkDataset.js`
- Backend uses PostgreSQL for security/threat data (separate from network topology)
- Backend has modular route structure ready for extension

## Implementation Strategy

### Phase 1: Environment & Dependencies
**Tasks:**
1. Install `neo4j-driver` package
2. Create `.env` file with Neo4j credentials
3. Update `.env.example` with Neo4j configuration

**Credentials:**
```
NEO4J_URI=neo4j+s://a52f4a1a.databases.neo4j.io
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=S0RAn2Qq41Sf9il2n_SrIKrAoH6ozYGIGzoSZsrQzOA
NEO4J_DATABASE=neo4j
```

### Phase 2: Backend Neo4j Connection
**Files to Create:**
- `server/db/neo4j.js` - Neo4j connection manager
- `server/routes/network-topology.js` - Network topology API endpoints
- `server/services/neo4j-queries.js` - Cypher query definitions

**Functionality:**
- Connection pooling and error handling
- Query execution wrapper
- Transaction management

### Phase 3: Cypher Queries
**Node Operations:**
- Create node with properties
- Update node properties
- Delete node
- Query nodes by type/region
- Get node by ID

**Edge Operations:**
- Create relationship with properties
- Update relationship properties
- Delete relationship
- Query edges by type
- Get connected edges for node

**Batch Operations:**
- Bulk create nodes
- Bulk create edges
- Clear all data
- Export all data

### Phase 4: Frontend Integration
**Files to Modify:**
- `src/lib/networkDataset.js` - Add Neo4j save/load functions
- `src/hooks/useNetworkDataset.js` - Fetch from Neo4j API
- `src/components/DatasetManager.jsx` - Add Neo4j sync button

**Functionality:**
- Fetch nodes/edges from Neo4j via API
- Save nodes/edges to Neo4j via API
- Fallback to localStorage if Neo4j unavailable
- Seed database with mock data

### Phase 5: API Endpoints
**New Endpoints:**
```
GET    /api/network-topology/nodes
GET    /api/network-topology/nodes/:id
POST   /api/network-topology/nodes
PUT    /api/network-topology/nodes/:id
DELETE /api/network-topology/nodes/:id

GET    /api/network-topology/edges
GET    /api/network-topology/edges/:id
POST   /api/network-topology/edges
PUT    /api/network-topology/edges/:id
DELETE /api/network-topology/edges/:id

POST   /api/network-topology/seed
POST   /api/network-topology/export
DELETE /api/network-topology/clear
```

### Phase 6: Data Migration & Seeding
**Tasks:**
1. Create seed endpoint to populate Neo4j with mock data
2. Implement data export from Neo4j
3. Add migration utility for existing localStorage data

## Technical Details

### Neo4j Schema Design

**Node Labels:**
- `NetworkNode` - Represents infrastructure nodes
  - Properties: id, name, type, status, location, region, capacity, vendor, model, uptime, coverage_radius

**Relationship Types:**
- `CONNECTED_TO` - Network connections
  - Properties: id, type, bandwidth, latency, utilization, status

**Indexes:**
- Create index on NetworkNode.id (unique)
- Create index on NetworkNode.type
- Create index on NetworkNode.region

### Cypher Query Examples

**Create Node:**
```cypher
CREATE (n:NetworkNode {
  id: $id,
  name: $name,
  type: $type,
  status: $status,
  location: $location,
  region: $region,
  capacity: $capacity,
  vendor: $vendor,
  model: $model
})
RETURN n
```

**Create Edge:**
```cypher
MATCH (source:NetworkNode {id: $sourceId})
MATCH (target:NetworkNode {id: $targetId})
CREATE (source)-[r:CONNECTED_TO {
  id: $id,
  type: $type,
  bandwidth: $bandwidth,
  latency: $latency,
  utilization: $utilization,
  status: $status
}]->(target)
RETURN r
```

**Query All Nodes:**
```cypher
MATCH (n:NetworkNode)
RETURN n
ORDER BY n.id
```

**Query Connected Edges:**
```cypher
MATCH (n:NetworkNode {id: $nodeId})-[r:CONNECTED_TO]-(m:NetworkNode)
RETURN r, m
```

## Fallback Strategy

1. **Primary:** Neo4j (persistent, scalable)
2. **Secondary:** localStorage (browser cache)
3. **Tertiary:** Mock data generation (fallback)

**Logic:**
```
Try Neo4j API
  ↓ (success) → Use Neo4j data
  ↓ (fail) → Try localStorage
    ↓ (success) → Use localStorage data
    ↓ (fail) → Generate mock data
```

## Compatibility Maintenance

✅ **Preserved:**
- All existing filtering (type, region)
- All layout options (force, hierarchical, circular, grid, radial)
- All alarm integration
- All node/edge interactions
- Dataset upload/download functionality
- Mock data generation

## Implementation Order

1. Install dependencies
2. Create `.env` file
3. Implement Neo4j connection (`server/db/neo4j.js`)
4. Create Cypher queries (`server/services/neo4j-queries.js`)
5. Create API routes (`server/routes/network-topology.js`)
6. Update backend server (`server/index.js`)
7. Create frontend API client (`src/lib/neo4jClient.js`)
8. Update `useNetworkDataset` hook
9. Update `DatasetManager` component
10. Test all functionality
11. Document Neo4j setup

## Success Criteria

✅ Network topology data persists in Neo4j
✅ Frontend fetches data from Neo4j API
✅ Fallback to localStorage works
✅ Mock data seeding works
✅ All existing features work unchanged
✅ No breaking changes to UI/UX
✅ Performance acceptable (<2s load time)
✅ Error handling graceful

## Timeline Estimate

- Phase 1: 5 minutes
- Phase 2: 15 minutes
- Phase 3: 20 minutes
- Phase 4: 15 minutes
- Phase 5: 20 minutes
- Phase 6: 10 minutes
- Testing: 15 minutes

**Total: ~100 minutes**

## Approval Needed

Please review this plan and confirm:
1. ✅ Proceed with implementation?
2. ✅ Use provided Neo4j credentials?
3. ✅ Keep localStorage fallback?
4. ✅ Maintain all existing features?

