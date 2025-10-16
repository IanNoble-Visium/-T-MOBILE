/**
 * Neo4j Cypher Query Definitions
 * Centralized query definitions for network topology operations
 */

// ============================================================================
// NODE QUERIES
// ============================================================================

export const NODE_QUERIES = {
  // Create a single node
  CREATE_NODE: `
    CREATE (n:NetworkNode {
      id: $id,
      name: $name,
      type: $type,
      status: $status,
      location: $location,
      region: $region,
      capacity: $capacity,
      vendor: $vendor,
      model: $model,
      uptime: $uptime,
      coverage_radius: $coverage_radius,
      latitude: $latitude,
      longitude: $longitude,
      created_at: datetime()
    })
    RETURN n
  `,

  // Get all nodes
  GET_ALL_NODES: `
    MATCH (n:NetworkNode)
    RETURN n
    ORDER BY n.id
  `,

  // Get node by ID
  GET_NODE_BY_ID: `
    MATCH (n:NetworkNode {id: $id})
    RETURN n
  `,

  // Get nodes by type
  GET_NODES_BY_TYPE: `
    MATCH (n:NetworkNode {type: $type})
    RETURN n
    ORDER BY n.id
  `,

  // Get nodes by region
  GET_NODES_BY_REGION: `
    MATCH (n:NetworkNode {region: $region})
    RETURN n
    ORDER BY n.id
  `,

  // Update node
  UPDATE_NODE: `
    MATCH (n:NetworkNode {id: $id})
    SET n.name = COALESCE($name, n.name),
        n.status = COALESCE($status, n.status),
        n.capacity = COALESCE($capacity, n.capacity),
        n.uptime = COALESCE($uptime, n.uptime),
        n.updated_at = datetime()
    RETURN n
  `,

  // Delete node (and its relationships)
  DELETE_NODE: `
    MATCH (n:NetworkNode {id: $id})
    DETACH DELETE n
    RETURN true
  `,

  // Delete all nodes
  DELETE_ALL_NODES: `
    MATCH (n:NetworkNode)
    DETACH DELETE n
    RETURN true
  `,

  // Count nodes
  COUNT_NODES: `
    MATCH (n:NetworkNode)
    RETURN count(n) as count
  `,
};

// ============================================================================
// EDGE QUERIES
// ============================================================================

export const EDGE_QUERIES = {
  // Create a relationship between two nodes
  CREATE_EDGE: `
    MATCH (source:NetworkNode {id: $sourceId})
    MATCH (target:NetworkNode {id: $targetId})
    CREATE (source)-[r:CONNECTED_TO {
      id: $id,
      type: $type,
      bandwidth: $bandwidth,
      latency: $latency,
      utilization: $utilization,
      status: $status,
      created_at: datetime()
    }]->(target)
    RETURN r
  `,

  // Get all edges
  GET_ALL_EDGES: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO]->(target:NetworkNode)
    RETURN {
      id: r.id,
      type: r.type,
      source: source.id,
      target: target.id,
      bandwidth: r.bandwidth,
      latency: r.latency,
      utilization: r.utilization,
      status: r.status
    } as edge
    ORDER BY r.id
  `,

  // Get edge by ID
  GET_EDGE_BY_ID: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO {id: $id}]->(target:NetworkNode)
    RETURN {
      id: r.id,
      type: r.type,
      source: source.id,
      target: target.id,
      bandwidth: r.bandwidth,
      latency: r.latency,
      utilization: r.utilization,
      status: r.status
    } as edge
  `,

  // Get edges connected to a node
  GET_EDGES_FOR_NODE: `
    MATCH (n:NetworkNode {id: $nodeId})-[r:CONNECTED_TO]-(m:NetworkNode)
    RETURN {
      id: r.id,
      type: r.type,
      source: CASE WHEN (n)-[r]->(m) THEN n.id ELSE m.id END,
      target: CASE WHEN (n)-[r]->(m) THEN m.id ELSE n.id END,
      bandwidth: r.bandwidth,
      latency: r.latency,
      utilization: r.utilization,
      status: r.status
    } as edge
  `,

  // Get edges by type
  GET_EDGES_BY_TYPE: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO {type: $type}]->(target:NetworkNode)
    RETURN {
      id: r.id,
      type: r.type,
      source: source.id,
      target: target.id,
      bandwidth: r.bandwidth,
      latency: r.latency,
      utilization: r.utilization,
      status: r.status
    } as edge
    ORDER BY r.id
  `,

  // Update edge
  UPDATE_EDGE: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO {id: $id}]->(target:NetworkNode)
    SET r.bandwidth = COALESCE($bandwidth, r.bandwidth),
        r.latency = COALESCE($latency, r.latency),
        r.utilization = COALESCE($utilization, r.utilization),
        r.status = COALESCE($status, r.status),
        r.updated_at = datetime()
    RETURN r
  `,

  // Delete edge
  DELETE_EDGE: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO {id: $id}]->(target:NetworkNode)
    DELETE r
    RETURN true
  `,

  // Delete all edges
  DELETE_ALL_EDGES: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO]->(target:NetworkNode)
    DELETE r
    RETURN true
  `,

  // Count edges
  COUNT_EDGES: `
    MATCH (source:NetworkNode)-[r:CONNECTED_TO]->(target:NetworkNode)
    RETURN count(r) as count
  `,
};

// ============================================================================
// BATCH QUERIES
// ============================================================================

export const BATCH_QUERIES = {
  // Create multiple nodes
  CREATE_NODES_BATCH: `
    UNWIND $nodes as nodeData
    CREATE (n:NetworkNode {
      id: nodeData.id,
      name: nodeData.name,
      type: nodeData.type,
      status: nodeData.status,
      location: nodeData.location,
      region: nodeData.region,
      capacity: nodeData.capacity,
      vendor: nodeData.vendor,
      model: nodeData.model,
      uptime: nodeData.uptime,
      coverage_radius: nodeData.coverage_radius,
      latitude: nodeData.latitude,
      longitude: nodeData.longitude,
      created_at: datetime()
    })
    RETURN count(n) as created
  `,

  // Create multiple edges
  CREATE_EDGES_BATCH: `
    UNWIND $edges as edgeData
    MATCH (source:NetworkNode {id: edgeData.source})
    MATCH (target:NetworkNode {id: edgeData.target})
    CREATE (source)-[r:CONNECTED_TO {
      id: edgeData.id,
      type: edgeData.type,
      bandwidth: edgeData.bandwidth,
      latency: edgeData.latency,
      utilization: edgeData.utilization,
      status: edgeData.status,
      created_at: datetime()
    }]->(target)
    RETURN count(r) as created
  `,

  // Get all data (nodes and edges)
  GET_ALL_DATA: `
    MATCH (n:NetworkNode)
    OPTIONAL MATCH (source:NetworkNode)-[r:CONNECTED_TO]->(target:NetworkNode)
    RETURN {
      nodes: collect(DISTINCT n),
      edges: collect(DISTINCT {
        id: r.id,
        type: r.type,
        source: source.id,
        target: target.id,
        bandwidth: r.bandwidth,
        latency: r.latency,
        utilization: r.utilization,
        status: r.status
      })
    } as data
  `,

  // Get statistics
  GET_STATISTICS: `
    MATCH (n:NetworkNode)
    OPTIONAL MATCH (source:NetworkNode)-[r:CONNECTED_TO]->(target:NetworkNode)
    RETURN {
      total_nodes: count(DISTINCT n),
      total_edges: count(DISTINCT r),
      node_types: collect(DISTINCT n.type),
      regions: collect(DISTINCT n.region),
      edge_types: collect(DISTINCT r.type)
    } as stats
  `,
};

// ============================================================================
// INDEX QUERIES
// ============================================================================

export const INDEX_QUERIES = {
  // Create indexes for performance (separate queries)
  CREATE_INDEX_ID: `
    CREATE INDEX IF NOT EXISTS FOR (n:NetworkNode) ON (n.id)
  `,

  CREATE_INDEX_TYPE: `
    CREATE INDEX IF NOT EXISTS FOR (n:NetworkNode) ON (n.type)
  `,

  CREATE_INDEX_REGION: `
    CREATE INDEX IF NOT EXISTS FOR (n:NetworkNode) ON (n.region)
  `,

  // Drop all indexes (separate queries)
  DROP_INDEX_ID: `
    DROP INDEX IF EXISTS FOR (n:NetworkNode) ON (n.id)
  `,

  DROP_INDEX_TYPE: `
    DROP INDEX IF EXISTS FOR (n:NetworkNode) ON (n.type)
  `,

  DROP_INDEX_REGION: `
    DROP INDEX IF EXISTS FOR (n:NetworkNode) ON (n.region)
  `,
};

export default {
  NODE_QUERIES,
  EDGE_QUERIES,
  BATCH_QUERIES,
  INDEX_QUERIES,
};

