// Mock Data Generator for T-Mobile TruContext Demo

// Helper function to generate random numbers
const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate random date within last N days
const randomDate = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - random(0, daysAgo));
  date.setHours(random(0, 23), random(0, 59), random(0, 59));
  return date;
};

// Threat types
const threatTypes = ['malware', 'phishing', 'ddos', 'intrusion', 'ransomware', 'data-exfiltration'];
const severityLevels = ['critical', 'high', 'medium', 'low'];
const statusTypes = ['detected', 'blocked', 'investigating', 'resolved'];

// MITRE ATT&CK techniques (sample)
const mitreTechniques = [
  'T1566 - Phishing',
  'T1190 - Exploit Public-Facing Application',
  'T1078 - Valid Accounts',
  'T1486 - Data Encrypted for Impact',
  'T1059 - Command and Scripting Interpreter',
  'T1055 - Process Injection',
  'T1021 - Remote Services',
  'T1071 - Application Layer Protocol'
];

// Geographic locations (major cities)
const locations = [
  { city: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA' },
  { city: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'USA' },
  { city: 'Chicago', lat: 41.8781, lon: -87.6298, country: 'USA' },
  { city: 'Houston', lat: 29.7604, lon: -95.3698, country: 'USA' },
  { city: 'Seattle', lat: 47.6062, lon: -122.3321, country: 'USA' },
  { city: 'San Francisco', lat: 37.7749, lon: -122.4194, country: 'USA' },
  { city: 'Miami', lat: 25.7617, lon: -80.1918, country: 'USA' },
  { city: 'Dallas', lat: 32.7767, lon: -96.7970, country: 'USA' },
  { city: 'Beijing', lat: 39.9042, lon: 116.4074, country: 'China' },
  { city: 'Moscow', lat: 55.7558, lon: 37.6173, country: 'Russia' },
  { city: 'London', lat: 51.5074, lon: -0.1278, country: 'UK' },
  { city: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France' },
  { city: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan' },
  { city: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia' }
];

// Generate threat events
export const generateThreatEvents = (count = 100) => {
  return Array.from({ length: count }, (_, i) => {
    const sourceLocation = locations[random(0, locations.length - 1)];
    const targetLocation = locations[random(0, 5)]; // Targets mostly in USA
    
    return {
      id: `threat-${i + 1}`,
      timestamp: randomDate(7),
      type: threatTypes[random(0, threatTypes.length - 1)],
      severity: severityLevels[random(0, severityLevels.length - 1)],
      source: sourceLocation,
      target: targetLocation,
      status: statusTypes[random(0, statusTypes.length - 1)],
      mitre_technique: mitreTechniques[random(0, mitreTechniques.length - 1)],
      confidence: random(70, 99),
      description: `Detected ${threatTypes[random(0, threatTypes.length - 1)]} attempt from ${sourceLocation.city}`
    };
  });
};

// Generate devices
export const generateDevices = (count = 1000) => {
  const deviceTypes = ['mobile', 'iot', 'endpoint', 'network'];
  const manufacturers = ['Apple', 'Samsung', 'Cisco', 'Dell', 'HP', 'Generic IoT'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = deviceTypes[random(0, deviceTypes.length - 1)];
    const location = locations[random(0, 5)]; // Devices mostly in USA
    
    return {
      id: `device-${i + 1}`,
      type,
      name: `${manufacturers[random(0, manufacturers.length - 1)]} ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      location,
      security_posture: random(60, 100),
      last_seen: randomDate(1),
      threats_detected: random(0, 10),
      compliance_status: random(0, 100) > 20,
      os: type === 'mobile' ? (random(0, 1) ? 'iOS' : 'Android') : (random(0, 1) ? 'Windows' : 'Linux'),
      ip_address: `10.${random(0, 255)}.${random(0, 255)}.${random(0, 255)}`
    };
  });
};

// Generate incidents
export const generateIncidents = (count = 20) => {
  const incidentTitles = [
    'Ransomware Attack on Finance Department',
    'DDoS Attack on Web Services',
    'Phishing Campaign Targeting Executives',
    'Unauthorized Access Attempt',
    'Data Exfiltration Detected',
    'Malware Outbreak in Marketing',
    'Insider Threat Investigation',
    'Supply Chain Compromise',
    'Zero-Day Exploit Attempt',
    'Credential Stuffing Attack'
  ];
  
  const playbooks = [
    'Ransomware Response',
    'DDoS Mitigation',
    'Phishing Investigation',
    'Access Control Review',
    'Data Breach Protocol',
    'Malware Containment',
    'Insider Threat Response'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `incident-${i + 1}`,
    title: incidentTitles[random(0, incidentTitles.length - 1)],
    severity: severityLevels[random(0, severityLevels.length - 1)],
    status: ['open', 'investigating', 'contained', 'resolved'][random(0, 3)],
    assigned_to: `Analyst ${random(1, 10)}`,
    created_at: randomDate(30),
    updated_at: randomDate(1),
    affected_assets: random(1, 50),
    playbook: playbooks[random(0, playbooks.length - 1)],
    priority: random(1, 5)
  }));
};

// Generate KPI metrics for executive dashboard
export const generateKPIMetrics = () => ({
  threats_detected_24h: random(1500, 3000),
  threats_blocked_24h: random(1400, 2900),
  active_incidents: random(5, 15),
  network_health_score: random(85, 99),
  cost_savings: random(500000, 1500000),
  protected_devices: random(45000, 55000),
  iot_devices: random(8000, 12000),
  sase_connections: random(15000, 25000),
  uptime_percentage: random(9990, 9999) / 100,
  mean_time_to_detect: random(2, 8),
  mean_time_to_respond: random(5, 15)
});

// Generate time series data for charts
export const generateTimeSeriesData = (days = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      threats: random(800, 1500),
      blocked: random(750, 1450),
      incidents: random(3, 12),
      devices: random(48000, 52000),
      network_health: random(85, 99)
    });
  }
  
  return data;
};

// Generate SASE metrics
export const generateSASEMetrics = () => ({
  protected_devices: random(20000, 25000),
  tsim_secure_devices: random(12000, 15000),
  device_client_deployments: random(8000, 10000),
  threats_blocked_24h: random(5000, 8000),
  ztna_enforcements: random(50000, 80000),
  vpn_connections: random(5000, 8000),
  malware_blocked: random(2000, 3500),
  ransomware_attempts: random(50, 150),
  phishing_blocked: random(1500, 2500),
  ips_activations: random(800, 1200),
  url_filtering_events: random(10000, 15000),
  precision_ai_detections: random(100, 300)
});

// Generate IoT metrics
export const generateIoTMetrics = () => ({
  total_devices: random(10000, 12000),
  nb_iot_devices: random(3000, 4000),
  lte_m_devices: random(3500, 4500),
  five_g_devices: random(3000, 4000),
  device_health_good: random(8500, 10000),
  device_health_warning: random(500, 1000),
  device_health_critical: random(50, 200),
  anomalies_detected: random(20, 80),
  firmware_updates_pending: random(100, 500),
  security_alerts: random(10, 50)
});

// Generate network performance data
export const generateNetworkMetrics = () => ({
  total_bandwidth: random(800, 1200), // Gbps
  bandwidth_utilization: random(60, 85), // percentage
  latency_avg: random(10, 30), // ms
  packet_loss: random(0, 2) / 10, // percentage
  five_g_coverage: random(92, 98), // percentage
  active_connections: random(100000, 150000),
  network_slices_active: random(50, 100),
  edge_nodes: random(200, 300)
});

// Generate real-time event stream
export const generateEventStream = (count = 50) => {
  const eventTypes = [
    'Threat Blocked',
    'Malware Detected',
    'Phishing Attempt',
    'Unauthorized Access',
    'Policy Violation',
    'Device Connected',
    'Firmware Update',
    'Anomaly Detected',
    'Incident Created',
    'Incident Resolved'
  ];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `event-${i + 1}`,
    timestamp: new Date(Date.now() - random(0, 3600000)), // Last hour
    type: eventTypes[random(0, eventTypes.length - 1)],
    severity: severityLevels[random(0, severityLevels.length - 1)],
    source: `Device-${random(1, 1000)}`,
    description: `${eventTypes[random(0, eventTypes.length - 1)]} on ${locations[random(0, 5)].city}`
  })).sort((a, b) => b.timestamp - a.timestamp);
};

// Generate competitive comparison data
export const generateCompetitiveData = () => ({
  tmobile_trucontext: {
    threat_detection_speed: 2, // minutes
    coverage_score: 98,
    cost_efficiency: 95,
    ai_capabilities: 98,
    integration_score: 96,
    customer_satisfaction: 94
  },
  verizon: {
    threat_detection_speed: 15, // minutes
    coverage_score: 92,
    cost_efficiency: 75,
    ai_capabilities: 85,
    integration_score: 88,
    customer_satisfaction: 87
  },
  att: {
    threat_detection_speed: 20, // minutes
    coverage_score: 90,
    cost_efficiency: 70,
    ai_capabilities: 82,
    integration_score: 85,
    customer_satisfaction: 85
  }
});

// Generate graph data for network topology
export const generateGraphData = () => {
  const nodes = [];
  const edges = [];
  
  // Create central nodes
  const centralNodes = [
    { id: 'sase', label: 'SASE Platform', type: 'platform', color: '#E20074' },
    { id: 'cdc', label: 'Cyber Defense Center', type: 'platform', color: '#E20074' },
    { id: 'tplatform', label: 'T-Platform', type: 'platform', color: '#E20074' },
    { id: 'iot', label: 'IoT Hub', type: 'platform', color: '#E20074' }
  ];
  
  nodes.push(...centralNodes);
  
  // Add devices connected to each platform
  centralNodes.forEach((platform, platformIndex) => {
    const deviceCount = random(5, 10);
    for (let i = 0; i < deviceCount; i++) {
      const deviceId = `${platform.id}-device-${i}`;
      nodes.push({
        id: deviceId,
        label: `Device ${platformIndex * 10 + i + 1}`,
        type: 'device',
        color: '#0066CC'
      });
      
      edges.push({
        source: platform.id,
        target: deviceId,
        type: 'connection'
      });
    }
  });
  
  // Add some threat nodes
  for (let i = 0; i < 5; i++) {
    const threatId = `threat-${i}`;
    nodes.push({
      id: threatId,
      label: `Threat ${i + 1}`,
      type: 'threat',
      color: '#E4002B'
    });
    
    // Connect threats to random devices
    const randomDevice = nodes[random(centralNodes.length, nodes.length - 1)];
    edges.push({
      source: threatId,
      target: randomDevice.id,
      type: 'attack'
    });
  }
  
  return { nodes, edges };
};

// Export all data generators
export default {
  generateThreatEvents,
  generateDevices,
  generateIncidents,
  generateKPIMetrics,
  generateTimeSeriesData,
  generateSASEMetrics,
  generateIoTMetrics,
  generateNetworkMetrics,
  generateEventStream,
  generateCompetitiveData,
  generateGraphData
};

