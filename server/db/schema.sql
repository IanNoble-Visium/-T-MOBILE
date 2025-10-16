-- T-Mobile TruContext Demo Database Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS event_stream CASCADE;
DROP TABLE IF EXISTS network_metrics CASCADE;
DROP TABLE IF EXISTS kpi_metrics CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS threat_events CASCADE;

-- Threat Events Table
CREATE TABLE threat_events (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    source_city VARCHAR(100) NOT NULL,
    source_lat DECIMAL(10, 8) NOT NULL,
    source_lon DECIMAL(11, 8) NOT NULL,
    source_country VARCHAR(100) NOT NULL,
    target_city VARCHAR(100) NOT NULL,
    target_lat DECIMAL(10, 8) NOT NULL,
    target_lon DECIMAL(11, 8) NOT NULL,
    target_country VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    mitre_technique VARCHAR(200),
    confidence INTEGER NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_threat_events_timestamp ON threat_events(timestamp);
CREATE INDEX idx_threat_events_severity ON threat_events(severity);
CREATE INDEX idx_threat_events_type ON threat_events(type);
CREATE INDEX idx_threat_events_status ON threat_events(status);

-- Devices Table
CREATE TABLE devices (
    id VARCHAR(50) PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(200) NOT NULL,
    location_city VARCHAR(100) NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lon DECIMAL(11, 8) NOT NULL,
    location_country VARCHAR(100) NOT NULL,
    security_posture INTEGER NOT NULL,
    last_seen TIMESTAMP NOT NULL,
    threats_detected INTEGER NOT NULL,
    compliance_status BOOLEAN NOT NULL,
    os VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_devices_type ON devices(type);
CREATE INDEX idx_devices_security_posture ON devices(security_posture);
CREATE INDEX idx_devices_last_seen ON devices(last_seen);

-- Incidents Table
CREATE TABLE incidents (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    assigned_to VARCHAR(100),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    affected_assets INTEGER NOT NULL,
    playbook VARCHAR(200),
    priority INTEGER NOT NULL
);

CREATE INDEX idx_incidents_severity ON incidents(severity);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);

-- KPI Metrics Table (Time-series data)
CREATE TABLE kpi_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    threats_detected_24h INTEGER NOT NULL,
    threats_blocked_24h INTEGER NOT NULL,
    active_incidents INTEGER NOT NULL,
    network_health_score INTEGER NOT NULL,
    cost_savings BIGINT NOT NULL,
    protected_devices INTEGER NOT NULL,
    iot_devices INTEGER NOT NULL,
    sase_connections INTEGER NOT NULL,
    uptime_percentage DECIMAL(5, 2) NOT NULL,
    mean_time_to_detect INTEGER NOT NULL,
    mean_time_to_respond INTEGER NOT NULL
);

CREATE INDEX idx_kpi_metrics_timestamp ON kpi_metrics(timestamp);

-- Network Metrics Table
CREATE TABLE network_metrics (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_bandwidth INTEGER NOT NULL,
    bandwidth_utilization INTEGER NOT NULL,
    latency_avg INTEGER NOT NULL,
    packet_loss DECIMAL(4, 2) NOT NULL,
    five_g_coverage INTEGER NOT NULL,
    active_connections INTEGER NOT NULL,
    network_slices_active INTEGER NOT NULL,
    edge_nodes INTEGER NOT NULL,
    -- SASE specific metrics
    sase_protected_devices INTEGER,
    tsim_secure_devices INTEGER,
    device_client_deployments INTEGER,
    sase_threats_blocked_24h INTEGER,
    ztna_enforcements INTEGER,
    vpn_connections INTEGER,
    malware_blocked INTEGER,
    ransomware_attempts INTEGER,
    phishing_blocked INTEGER,
    ips_activations INTEGER,
    url_filtering_events INTEGER,
    precision_ai_detections INTEGER,
    -- IoT specific metrics
    total_iot_devices INTEGER,
    nb_iot_devices INTEGER,
    lte_m_devices INTEGER,
    five_g_devices INTEGER,
    device_health_good INTEGER,
    device_health_warning INTEGER,
    device_health_critical INTEGER,
    anomalies_detected INTEGER,
    firmware_updates_pending INTEGER,
    security_alerts INTEGER
);

CREATE INDEX idx_network_metrics_timestamp ON network_metrics(timestamp);

-- Event Stream Table (Real-time events)
CREATE TABLE event_stream (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    source VARCHAR(200) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_stream_timestamp ON event_stream(timestamp);
CREATE INDEX idx_event_stream_severity ON event_stream(severity);

-- Create a view for easy dashboard queries
CREATE OR REPLACE VIEW dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM threat_events WHERE timestamp > NOW() - INTERVAL '24 hours') as threats_24h,
    (SELECT COUNT(*) FROM threat_events WHERE status = 'blocked' AND timestamp > NOW() - INTERVAL '24 hours') as blocked_24h,
    (SELECT COUNT(*) FROM incidents WHERE status IN ('open', 'investigating')) as active_incidents,
    (SELECT COUNT(*) FROM devices) as total_devices,
    (SELECT COUNT(*) FROM devices WHERE type = 'iot') as iot_devices,
    (SELECT AVG(security_posture)::INTEGER FROM devices) as avg_security_posture,
    (SELECT COUNT(*) FROM event_stream WHERE timestamp > NOW() - INTERVAL '1 hour') as events_last_hour;
