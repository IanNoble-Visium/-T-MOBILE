import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool, { transaction } from './connection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// MITRE ATT&CK techniques
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

// Geographic locations
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

// Run schema setup
async function setupSchema() {
  console.log('Setting up database schema...');
  const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schemaSQL);
  console.log('✓ Schema created successfully');
}

// Migrate threat events
async function migrateThreatEvents(count = 500) {
  console.log(`Migrating ${count} threat events...`);
  
  const values = [];
  for (let i = 0; i < count; i++) {
    const sourceLocation = locations[random(0, locations.length - 1)];
    const targetLocation = locations[random(0, 5)];
    
    values.push([
      `threat-${i + 1}`,
      randomDate(7),
      threatTypes[random(0, threatTypes.length - 1)],
      severityLevels[random(0, severityLevels.length - 1)],
      sourceLocation.city,
      sourceLocation.lat,
      sourceLocation.lon,
      sourceLocation.country,
      targetLocation.city,
      targetLocation.lat,
      targetLocation.lon,
      targetLocation.country,
      statusTypes[random(0, statusTypes.length - 1)],
      mitreTechniques[random(0, mitreTechniques.length - 1)],
      random(70, 99),
      `Detected ${threatTypes[random(0, threatTypes.length - 1)]} attempt from ${sourceLocation.city}`
    ]);
  }
  
  const query = `
    INSERT INTO threat_events (
      id, timestamp, type, severity, source_city, source_lat, source_lon, source_country,
      target_city, target_lat, target_lon, target_country, status, mitre_technique, 
      confidence, description
    ) VALUES ${values.map((_, i) => `($${i * 16 + 1}, $${i * 16 + 2}, $${i * 16 + 3}, $${i * 16 + 4}, $${i * 16 + 5}, $${i * 16 + 6}, $${i * 16 + 7}, $${i * 16 + 8}, $${i * 16 + 9}, $${i * 16 + 10}, $${i * 16 + 11}, $${i * 16 + 12}, $${i * 16 + 13}, $${i * 16 + 14}, $${i * 16 + 15}, $${i * 16 + 16})`).join(', ')}
  `;
  
  await pool.query(query, values.flat());
  console.log(`✓ Migrated ${count} threat events`);
}

// Migrate devices
async function migrateDevices(count = 1000) {
  console.log(`Migrating ${count} devices...`);
  
  const deviceTypes = ['mobile', 'iot', 'endpoint', 'network'];
  const manufacturers = ['Apple', 'Samsung', 'Cisco', 'Dell', 'HP', 'Generic IoT'];
  
  const values = [];
  for (let i = 0; i < count; i++) {
    const type = deviceTypes[random(0, deviceTypes.length - 1)];
    const location = locations[random(0, 5)];
    
    values.push([
      `device-${i + 1}`,
      type,
      `${manufacturers[random(0, manufacturers.length - 1)]} ${type.charAt(0).toUpperCase() + type.slice(1)} ${i + 1}`,
      location.city,
      location.lat,
      location.lon,
      location.country,
      random(60, 100),
      randomDate(1),
      random(0, 10),
      random(0, 100) > 20,
      type === 'mobile' ? (random(0, 1) ? 'iOS' : 'Android') : (random(0, 1) ? 'Windows' : 'Linux'),
      `10.${random(0, 255)}.${random(0, 255)}.${random(0, 255)}`
    ]);
  }
  
  const query = `
    INSERT INTO devices (
      id, type, name, location_city, location_lat, location_lon, location_country,
      security_posture, last_seen, threats_detected, compliance_status, os, ip_address
    ) VALUES ${values.map((_, i) => `($${i * 13 + 1}, $${i * 13 + 2}, $${i * 13 + 3}, $${i * 13 + 4}, $${i * 13 + 5}, $${i * 13 + 6}, $${i * 13 + 7}, $${i * 13 + 8}, $${i * 13 + 9}, $${i * 13 + 10}, $${i * 13 + 11}, $${i * 13 + 12}, $${i * 13 + 13})`).join(', ')}
  `;
  
  await pool.query(query, values.flat());
  console.log(`✓ Migrated ${count} devices`);
}

// Migrate incidents
async function migrateIncidents(count = 20) {
  console.log(`Migrating ${count} incidents...`);
  
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
  
  const values = [];
  for (let i = 0; i < count; i++) {
    values.push([
      `incident-${i + 1}`,
      incidentTitles[random(0, incidentTitles.length - 1)],
      severityLevels[random(0, severityLevels.length - 1)],
      ['open', 'investigating', 'contained', 'resolved'][random(0, 3)],
      `Analyst ${random(1, 10)}`,
      randomDate(30),
      randomDate(1),
      random(1, 50),
      playbooks[random(0, playbooks.length - 1)],
      random(1, 5)
    ]);
  }
  
  const query = `
    INSERT INTO incidents (
      id, title, severity, status, assigned_to, created_at, updated_at,
      affected_assets, playbook, priority
    ) VALUES ${values.map((_, i) => `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5}, $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`).join(', ')}
  `;
  
  await pool.query(query, values.flat());
  console.log(`✓ Migrated ${count} incidents`);
}

// Migrate KPI metrics
async function migrateKPIMetrics(count = 30) {
  console.log(`Migrating ${count} days of KPI metrics...`);
  
  const values = [];
  for (let i = 0; i < count; i++) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - (count - 1 - i));
    
    values.push([
      timestamp,
      random(1500, 3000),
      random(1400, 2900),
      random(5, 15),
      random(85, 99),
      random(500000, 1500000),
      random(45000, 55000),
      random(8000, 12000),
      random(15000, 25000),
      random(9990, 9999) / 100,
      random(2, 8),
      random(5, 15)
    ]);
  }
  
  const query = `
    INSERT INTO kpi_metrics (
      timestamp, threats_detected_24h, threats_blocked_24h, active_incidents,
      network_health_score, cost_savings, protected_devices, iot_devices,
      sase_connections, uptime_percentage, mean_time_to_detect, mean_time_to_respond
    ) VALUES ${values.map((_, i) => `($${i * 12 + 1}, $${i * 12 + 2}, $${i * 12 + 3}, $${i * 12 + 4}, $${i * 12 + 5}, $${i * 12 + 6}, $${i * 12 + 7}, $${i * 12 + 8}, $${i * 12 + 9}, $${i * 12 + 10}, $${i * 12 + 11}, $${i * 12 + 12})`).join(', ')}
  `;
  
  await pool.query(query, values.flat());
  console.log(`✓ Migrated ${count} days of KPI metrics`);
}

// Migrate network metrics
async function migrateNetworkMetrics(count = 30) {
  console.log(`Migrating ${count} days of network metrics...`);
  
  const values = [];
  for (let i = 0; i < count; i++) {
    const timestamp = new Date();
    timestamp.setDate(timestamp.getDate() - (count - 1 - i));
    
    values.push([
      timestamp,
      random(800, 1200),
      random(60, 85),
      random(10, 30),
      random(0, 2) / 10,
      random(92, 98),
      random(100000, 150000),
      random(50, 100),
      random(200, 300),
      random(20000, 25000),
      random(12000, 15000),
      random(8000, 10000),
      random(5000, 8000),
      random(50000, 80000),
      random(5000, 8000),
      random(2000, 3500),
      random(50, 150),
      random(1500, 2500),
      random(800, 1200),
      random(10000, 15000),
      random(100, 300),
      random(10000, 12000),
      random(3000, 4000),
      random(3500, 4500),
      random(3000, 4000),
      random(8500, 10000),
      random(500, 1000),
      random(50, 200),
      random(20, 80),
      random(100, 500),
      random(10, 50)
    ]);
  }
  
  const query = `
    INSERT INTO network_metrics (
      timestamp, total_bandwidth, bandwidth_utilization, latency_avg, packet_loss,
      five_g_coverage, active_connections, network_slices_active, edge_nodes,
      sase_protected_devices, tsim_secure_devices, device_client_deployments,
      sase_threats_blocked_24h, ztna_enforcements, vpn_connections, malware_blocked,
      ransomware_attempts, phishing_blocked, ips_activations, url_filtering_events,
      precision_ai_detections, total_iot_devices, nb_iot_devices, lte_m_devices,
      five_g_devices, device_health_good, device_health_warning, device_health_critical,
      anomalies_detected, firmware_updates_pending, security_alerts
    ) VALUES ${values.map((_, i) => {
      const base = i * 31 + 1;
      return `($${base}, $${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8}, $${base + 9}, $${base + 10}, $${base + 11}, $${base + 12}, $${base + 13}, $${base + 14}, $${base + 15}, $${base + 16}, $${base + 17}, $${base + 18}, $${base + 19}, $${base + 20}, $${base + 21}, $${base + 22}, $${base + 23}, $${base + 24}, $${base + 25}, $${base + 26}, $${base + 27}, $${base + 28}, $${base + 29}, $${base + 30})`;
    }).join(', ')}
  `;
  
  await pool.query(query, values.flat());
  console.log(`✓ Migrated ${count} days of network metrics`);
}

// Migrate event stream
async function migrateEventStream(count = 100) {
  console.log(`Migrating ${count} event stream entries...`);
  
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
  
  const values = [];
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - random(0, 3600000));
    
    values.push([
      `event-${i + 1}`,
      timestamp,
      eventTypes[random(0, eventTypes.length - 1)],
      severityLevels[random(0, severityLevels.length - 1)],
      `Device-${random(1, 1000)}`,
      `${eventTypes[random(0, eventTypes.length - 1)]} on ${locations[random(0, 5)].city}`
    ]);
  }
  
  const query = `
    INSERT INTO event_stream (
      id, timestamp, type, severity, source, description
    ) VALUES ${values.map((_, i) => `($${i * 6 + 1}, $${i * 6 + 2}, $${i * 6 + 3}, $${i * 6 + 4}, $${i * 6 + 5}, $${i * 6 + 6})`).join(', ')}
  `;
  
  await pool.query(query, values.flat());
  console.log(`✓ Migrated ${count} event stream entries`);
}

// Main migration function
async function migrate() {
  try {
    console.log('Starting database migration...\n');
    
    await setupSchema();
    await migrateThreatEvents(500);
    await migrateDevices(1000);
    await migrateIncidents(20);
    await migrateKPIMetrics(30);
    await migrateNetworkMetrics(30);
    await migrateEventStream(100);
    
    console.log('\n✓ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrate();
