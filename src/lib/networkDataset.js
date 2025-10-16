// Network Topology Dataset Generator for T-Mobile Infrastructure

// Helper function to generate random numbers
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// US Cities with coordinates (from existing mockData)
export const US_CITIES = [
  { city: 'New York', lat: 40.7128, lon: -74.0060, region: 'Northeast' },
  { city: 'Los Angeles', lat: 34.0522, lon: -118.2437, region: 'West' },
  { city: 'Chicago', lat: 41.8781, lon: -87.6298, region: 'Midwest' },
  { city: 'Houston', lat: 29.7604, lon: -95.3698, region: 'South' },
  { city: 'Seattle', lat: 47.6062, lon: -122.3321, region: 'Pacific' },
  { city: 'San Francisco', lat: 37.7749, lon: -122.4194, region: 'West' },
  { city: 'Miami', lat: 25.7617, lon: -80.1918, region: 'Southeast' },
  { city: 'Dallas', lat: 32.7767, lon: -96.7970, region: 'South' }
];

// Node types and their properties
export const NODE_TYPES = {
  data_center: { label: 'Data Center', color: '#E20074', icon: '🏢' },
  cell_tower: { label: 'Cell Tower', color: '#0066CC', icon: '📡' },
  router: { label: 'Router', color: '#00A651', icon: '🔀' },
  switch: { label: 'Switch', color: '#FFB81C', icon: '⚡' },
  gateway: { label: 'Gateway', color: '#E4002B', icon: '🚪' },
  firewall: { label: 'Firewall', color: '#9C27B0', icon: '🛡️' }
};

// Edge types
export const EDGE_TYPES = {
  fiber: { label: 'Fiber Optic', bandwidth: 100, latency: 5 },
  microwave: { label: 'Microwave', bandwidth: 50, latency: 15 },
  ethernet: { label: 'Ethernet', bandwidth: 10, latency: 2 },
  wireless: { label: 'Wireless', bandwidth: 25, latency: 20 }
};

// Vendors and models
const VENDORS = {
  data_center: [
    { vendor: 'Cisco', model: 'ASR 9000' },
    { vendor: 'Juniper', model: 'MX960' },
    { vendor: 'Arista', model: 'DCS-7280' }
  ],
  cell_tower: [
    { vendor: 'Nokia', model: 'AirScale' },
    { vendor: 'Ericsson', model: 'RAN Compute' },
    { vendor: 'Samsung', model: 'vRAN' }
  ],
  router: [
    { vendor: 'Cisco', model: 'ASR 1000' },
    { vendor: 'Juniper', model: 'MX480' }
  ],
  switch: [
    { vendor: 'Cisco', model: 'Catalyst 9000' },
    { vendor: 'Arista', model: 'DCS-7050' }
  ],
  gateway: [
    { vendor: 'Palo Alto', model: 'PA-5220' },
    { vendor: 'Fortinet', model: 'FortiGate 3100D' }
  ],
  firewall: [
    { vendor: 'Palo Alto', model: 'PA-5220' },
    { vendor: 'Checkpoint', model: 'Quantum Spark' }
  ]
};

/**
 * Generate network nodes representing T-Mobile infrastructure
 * @returns {Array} Array of network nodes
 */
export const generateNetworkNodes = () => {
  const nodes = [];
  let nodeId = 1;

  // Create nodes for each city
  US_CITIES.forEach((city, cityIndex) => {
    // 1 Data Center per city
    const dcVendor = VENDORS.data_center[random(0, VENDORS.data_center.length - 1)];
    nodes.push({
      id: `node-${String(nodeId).padStart(3, '0')}`,
      name: `${city.city} Data Center`,
      type: 'data_center',
      location: { lat: city.lat, lon: city.lon, city: city.city },
      region: city.region,
      status: 'operational',
      capacity: random(5000, 15000),
      vendor: dcVendor.vendor,
      model: dcVendor.model,
      uptime: random(99, 99.99),
      alarmIds: []
    });
    nodeId++;

    // 2-3 Cell Towers per city
    for (let i = 0; i < random(2, 3); i++) {
      const towerVendor = VENDORS.cell_tower[random(0, VENDORS.cell_tower.length - 1)];
      const offsetLat = (Math.random() - 0.5) * 0.1;
      const offsetLon = (Math.random() - 0.5) * 0.1;
      
      nodes.push({
        id: `node-${String(nodeId).padStart(3, '0')}`,
        name: `${city.city} Cell Tower ${i + 1}`,
        type: 'cell_tower',
        location: { 
          lat: city.lat + offsetLat, 
          lon: city.lon + offsetLon, 
          city: city.city 
        },
        region: city.region,
        status: 'operational',
        capacity: random(1000, 5000),
        vendor: towerVendor.vendor,
        model: towerVendor.model,
        coverage_radius: random(2, 5),
        alarmIds: []
      });
      nodeId++;
    }

    // 1 Router per city
    const routerVendor = VENDORS.router[random(0, VENDORS.router.length - 1)];
    nodes.push({
      id: `node-${String(nodeId).padStart(3, '0')}`,
      name: `${city.city} Router`,
      type: 'router',
      location: { lat: city.lat, lon: city.lon, city: city.city },
      region: city.region,
      status: 'operational',
      capacity: random(2000, 8000),
      vendor: routerVendor.vendor,
      model: routerVendor.model,
      throughput: random(50, 200),
      alarmIds: []
    });
    nodeId++;

    // 1 Switch per city
    const switchVendor = VENDORS.switch[random(0, VENDORS.switch.length - 1)];
    nodes.push({
      id: `node-${String(nodeId).padStart(3, '0')}`,
      name: `${city.city} Switch`,
      type: 'switch',
      location: { lat: city.lat, lon: city.lon, city: city.city },
      region: city.region,
      status: 'operational',
      capacity: random(1000, 5000),
      vendor: switchVendor.vendor,
      model: switchVendor.model,
      ports: random(24, 48),
      alarmIds: []
    });
    nodeId++;
  });

  // Add 2 regional gateways
  const gatewayVendor = VENDORS.gateway[random(0, VENDORS.gateway.length - 1)];
  nodes.push({
    id: `node-${String(nodeId).padStart(3, '0')}`,
    name: 'East Coast Gateway',
    type: 'gateway',
    location: { lat: 40.7128, lon: -74.0060, city: 'New York' },
    region: 'Northeast',
    status: 'operational',
    capacity: random(10000, 20000),
    vendor: gatewayVendor.vendor,
    model: gatewayVendor.model,
    alarmIds: []
  });
  nodeId++;

  const gatewayVendor2 = VENDORS.gateway[random(0, VENDORS.gateway.length - 1)];
  nodes.push({
    id: `node-${String(nodeId).padStart(3, '0')}`,
    name: 'West Coast Gateway',
    type: 'gateway',
    location: { lat: 37.7749, lon: -122.4194, city: 'San Francisco' },
    region: 'West',
    status: 'operational',
    capacity: random(10000, 20000),
    vendor: gatewayVendor2.vendor,
    model: gatewayVendor2.model,
    alarmIds: []
  });
  nodeId++;

  // Add 2 firewalls
  const firewallVendor = VENDORS.firewall[random(0, VENDORS.firewall.length - 1)];
  nodes.push({
    id: `node-${String(nodeId).padStart(3, '0')}`,
    name: 'Primary Firewall',
    type: 'firewall',
    location: { lat: 40.7128, lon: -74.0060, city: 'New York' },
    region: 'Northeast',
    status: 'operational',
    capacity: random(5000, 10000),
    vendor: firewallVendor.vendor,
    model: firewallVendor.model,
    alarmIds: []
  });
  nodeId++;

  const firewallVendor2 = VENDORS.firewall[random(0, VENDORS.firewall.length - 1)];
  nodes.push({
    id: `node-${String(nodeId).padStart(3, '0')}`,
    name: 'Secondary Firewall',
    type: 'firewall',
    location: { lat: 37.7749, lon: -122.4194, city: 'San Francisco' },
    region: 'West',
    status: 'operational',
    capacity: random(5000, 10000),
    vendor: firewallVendor2.vendor,
    model: firewallVendor2.model,
    alarmIds: []
  });

  return nodes;
};

/**
 * Generate network edges representing connections between nodes
 * @param {Array} nodes - Array of network nodes
 * @returns {Array} Array of network edges
 */
export const generateNetworkEdges = (nodes) => {
  const edges = [];
  let edgeId = 1;

  // Connect data centers to gateways
  const dataCenters = nodes.filter(n => n.type === 'data_center');
  const gateways = nodes.filter(n => n.type === 'gateway');
  
  dataCenters.forEach(dc => {
    gateways.forEach(gw => {
      const edgeType = Object.keys(EDGE_TYPES)[random(0, 1)]; // fiber or microwave
      const typeInfo = EDGE_TYPES[edgeType];
      
      edges.push({
        id: `edge-${String(edgeId).padStart(3, '0')}`,
        source: dc.id,
        target: gw.id,
        type: edgeType,
        status: 'active',
        bandwidth: typeInfo.bandwidth,
        latency: typeInfo.latency + random(-2, 2),
        utilization: random(20, 80),
        alarmIds: []
      });
      edgeId++;
    });
  });

  // Connect gateways to firewalls
  const firewalls = nodes.filter(n => n.type === 'firewall');
  gateways.forEach(gw => {
    firewalls.forEach(fw => {
      edges.push({
        id: `edge-${String(edgeId).padStart(3, '0')}`,
        source: gw.id,
        target: fw.id,
        type: 'fiber',
        status: 'active',
        bandwidth: EDGE_TYPES.fiber.bandwidth,
        latency: EDGE_TYPES.fiber.latency,
        utilization: random(30, 70),
        alarmIds: []
      });
      edgeId++;
    });
  });

  // Connect firewalls to routers in each region
  const routers = nodes.filter(n => n.type === 'router');
  firewalls.forEach(fw => {
    routers.slice(0, 3).forEach(router => {
      edges.push({
        id: `edge-${String(edgeId).padStart(3, '0')}`,
        source: fw.id,
        target: router.id,
        type: 'ethernet',
        status: 'active',
        bandwidth: EDGE_TYPES.ethernet.bandwidth,
        latency: EDGE_TYPES.ethernet.latency,
        utilization: random(40, 75),
        alarmIds: []
      });
      edgeId++;
    });
  });

  // Connect routers to switches
  const switches = nodes.filter(n => n.type === 'switch');
  routers.forEach(router => {
    const nearbySwitch = switches.find(s => s.region === router.region);
    if (nearbySwitch) {
      edges.push({
        id: `edge-${String(edgeId).padStart(3, '0')}`,
        source: router.id,
        target: nearbySwitch.id,
        type: 'ethernet',
        status: 'active',
        bandwidth: EDGE_TYPES.ethernet.bandwidth,
        latency: EDGE_TYPES.ethernet.latency,
        utilization: random(35, 70),
        alarmIds: []
      });
      edgeId++;
    }
  });

  // Connect switches to cell towers
  const cellTowers = nodes.filter(n => n.type === 'cell_tower');
  switches.forEach(sw => {
    const nearbyCellTowers = cellTowers.filter(ct => ct.region === sw.region);
    nearbyCellTowers.forEach(tower => {
      edges.push({
        id: `edge-${String(edgeId).padStart(3, '0')}`,
        source: sw.id,
        target: tower.id,
        type: 'wireless',
        status: 'active',
        bandwidth: EDGE_TYPES.wireless.bandwidth,
        latency: EDGE_TYPES.wireless.latency + random(0, 10),
        utilization: random(25, 65),
        alarmIds: []
      });
      edgeId++;
    });
  });

  // Connect cell towers to each other for redundancy
  for (let i = 0; i < cellTowers.length - 1; i++) {
    if (random(0, 1)) {
      edges.push({
        id: `edge-${String(edgeId).padStart(3, '0')}`,
        source: cellTowers[i].id,
        target: cellTowers[i + 1].id,
        type: 'microwave',
        status: 'active',
        bandwidth: EDGE_TYPES.microwave.bandwidth,
        latency: EDGE_TYPES.microwave.latency,
        utilization: random(15, 50),
        alarmIds: []
      });
      edgeId++;
    }
  }

  return edges;
};

/**
 * Generate complete network dataset
 * @returns {Object} Complete network dataset with metadata, nodes, and edges
 */
export const generateNetworkDataset = () => {
  const nodes = generateNetworkNodes();
  const edges = generateNetworkEdges(nodes);

  return {
    metadata: {
      version: '1.0',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString(),
      description: 'T-Mobile Network Infrastructure Topology',
      node_count: nodes.length,
      edge_count: edges.length
    },
    nodes,
    edges
  };
};

/**
 * Validate network dataset structure
 * @param {Object} dataset - Dataset to validate
 * @returns {Object} Validation result with isValid flag and errors array
 */
export const validateNetworkDataset = (dataset) => {
  const errors = [];

  if (!dataset || typeof dataset !== 'object') {
    errors.push('Dataset must be an object');
    return { isValid: false, errors };
  }

  if (!dataset.metadata) {
    errors.push('Missing metadata object');
  }

  if (!Array.isArray(dataset.nodes)) {
    errors.push('Nodes must be an array');
  } else {
    dataset.nodes.forEach((node, idx) => {
      if (!node.id) errors.push(`Node ${idx}: Missing id`);
      if (!node.name) errors.push(`Node ${idx}: Missing name`);
      if (!node.type) errors.push(`Node ${idx}: Missing type`);
      if (!node.location) errors.push(`Node ${idx}: Missing location`);
    });
  }

  if (!Array.isArray(dataset.edges)) {
    errors.push('Edges must be an array');
  } else {
    dataset.edges.forEach((edge, idx) => {
      if (!edge.id) errors.push(`Edge ${idx}: Missing id`);
      if (!edge.source) errors.push(`Edge ${idx}: Missing source`);
      if (!edge.target) errors.push(`Edge ${idx}: Missing target`);
      if (!edge.type) errors.push(`Edge ${idx}: Missing type`);
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  generateNetworkNodes,
  generateNetworkEdges,
  generateNetworkDataset,
  validateNetworkDataset,
  NODE_TYPES,
  EDGE_TYPES,
  US_CITIES
};

