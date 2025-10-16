/**
 * Alarm Mapping System
 * Maps alarms from various dashboards to network topology nodes and edges
 */

// Alarm severity levels
export const ALARM_SEVERITY = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low'
}

// Alarm types
export const ALARM_TYPES = {
  THREAT_BLOCKED: 'Threat Blocked',
  MALWARE_DETECTED: 'Malware Detected',
  PHISHING_ATTEMPT: 'Phishing Attempt',
  UNAUTHORIZED_ACCESS: 'Unauthorized Access',
  POLICY_VIOLATION: 'Policy Violation',
  DEVICE_CONNECTED: 'Device Connected',
  FIRMWARE_UPDATE: 'Firmware Update',
  ANOMALY_DETECTED: 'Anomaly Detected',
  INCIDENT_CREATED: 'Incident Created',
  INCIDENT_RESOLVED: 'Incident Resolved',
  NETWORK_DEGRADATION: 'Network Degradation',
  HIGH_LATENCY: 'High Latency',
  BANDWIDTH_EXCEEDED: 'Bandwidth Exceeded',
  DEVICE_OFFLINE: 'Device Offline'
}

// Storage key for alarm mappings
const ALARM_MAPPING_STORAGE_KEY = 'tmobile_alarm_mappings'

/**
 * Create an alarm object
 */
export const createAlarm = (id, type, severity, description, affectedNodeIds = [], affectedEdgeIds = []) => {
  return {
    id,
    type,
    severity,
    description,
    timestamp: new Date().toISOString(),
    affectedNodeIds,
    affectedEdgeIds,
    resolved: false
  }
}

/**
 * Get severity color
 */
export const getSeverityColor = (severity) => {
  switch (severity) {
    case ALARM_SEVERITY.CRITICAL:
      return '#E4002B' // Red
    case ALARM_SEVERITY.HIGH:
      return '#FF6B35' // Orange
    case ALARM_SEVERITY.MEDIUM:
      return '#FFB81C' // Yellow
    case ALARM_SEVERITY.LOW:
      return '#0066CC' // Blue
    default:
      return '#999'
  }
}

/**
 * Get severity icon
 */
export const getSeverityIcon = (severity) => {
  switch (severity) {
    case ALARM_SEVERITY.CRITICAL:
      return '🔴'
    case ALARM_SEVERITY.HIGH:
      return '🟠'
    case ALARM_SEVERITY.MEDIUM:
      return '🟡'
    case ALARM_SEVERITY.LOW:
      return '🔵'
    default:
      return '⚪'
  }
}

/**
 * Map event stream alarms to network nodes
 * Simulates mapping from Executive Dashboard event stream
 */
export const mapEventStreamAlarms = (eventStream, nodes) => {
  const alarms = []

  eventStream.forEach((event, idx) => {
    // Map events to random nodes based on severity
    const affectedNodeCount = event.severity === 'critical' ? 2 : 1
    const randomNodes = nodes
      .sort(() => Math.random() - 0.5)
      .slice(0, affectedNodeCount)

    const alarm = createAlarm(
      `alarm-event-${idx}`,
      event.type,
      event.severity,
      event.description,
      randomNodes.map(n => n.id),
      []
    )

    alarms.push(alarm)
  })

  return alarms
}

/**
 * Map threat events to network nodes
 * Simulates mapping from Threat Intelligence Dashboard
 */
export const mapThreatEventAlarms = (threatEvents, nodes) => {
  const alarms = []

  threatEvents.forEach((threat, idx) => {
    // Map threats to data centers and gateways
    const targetNodes = nodes.filter(n =>
      n.type === 'data_center' || n.type === 'gateway' || n.type === 'firewall'
    )

    const randomNodes = targetNodes
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(2, targetNodes.length))

    const alarm = createAlarm(
      `alarm-threat-${idx}`,
      ALARM_TYPES.THREAT_BLOCKED,
      threat.severity,
      `Threat detected: ${threat.type}`,
      randomNodes.map(n => n.id),
      []
    )

    alarms.push(alarm)
  })

  return alarms
}

/**
 * Map incident alarms to network nodes
 * Simulates mapping from Cyber Defense Dashboard
 */
export const mapIncidentAlarms = (incidents, nodes) => {
  const alarms = []

  incidents.forEach((incident, idx) => {
    // Map incidents to affected infrastructure
    const randomNodes = nodes
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, nodes.length))

    const alarm = createAlarm(
      `alarm-incident-${idx}`,
      ALARM_TYPES.INCIDENT_CREATED,
      incident.severity,
      incident.title,
      randomNodes.map(n => n.id),
      []
    )

    alarms.push(alarm)
  })

  return alarms
}

/**
 * Map network degradation alarms to edges
 * Simulates network performance issues
 */
export const mapNetworkDegradationAlarms = (edges, nodes) => {
  const alarms = []

  // Randomly select edges with high utilization
  const degradedEdges = edges
    .filter(e => e.utilization > 75)
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(1, Math.floor(edges.length * 0.1)))

  degradedEdges.forEach((edge, idx) => {
    const sourceNode = nodes.find(n => n.id === edge.source)
    const targetNode = nodes.find(n => n.id === edge.target)

    const alarm = createAlarm(
      `alarm-network-${idx}`,
      ALARM_TYPES.NETWORK_DEGRADATION,
      edge.utilization > 90 ? ALARM_SEVERITY.CRITICAL : ALARM_SEVERITY.HIGH,
      `High utilization on link: ${sourceNode?.name} → ${targetNode?.name}`,
      [],
      [edge.id]
    )

    alarms.push(alarm)
  })

  return alarms
}

/**
 * Map device offline alarms to cell towers
 */
export const mapDeviceOfflineAlarms = (nodes) => {
  const alarms = []

  // Randomly select cell towers as offline
  const cellTowers = nodes.filter(n => n.type === 'cell_tower')
  const offlineTowers = cellTowers
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.max(1, Math.floor(cellTowers.length * 0.15)))

  offlineTowers.forEach((tower, idx) => {
    const alarm = createAlarm(
      `alarm-offline-${idx}`,
      ALARM_TYPES.DEVICE_OFFLINE,
      ALARM_SEVERITY.HIGH,
      `Cell tower offline: ${tower.name}`,
      [tower.id],
      []
    )

    alarms.push(alarm)
  })

  return alarms
}

/**
 * Consolidate all alarms from various sources
 */
export const consolidateAlarms = (
  eventStreamAlarms = [],
  threatAlarms = [],
  incidentAlarms = [],
  networkAlarms = [],
  deviceAlarms = []
) => {
  return [
    ...eventStreamAlarms,
    ...threatAlarms,
    ...incidentAlarms,
    ...networkAlarms,
    ...deviceAlarms
  ]
}

/**
 * Save alarm mappings to localStorage
 */
export const saveAlarmMappings = (alarms) => {
  try {
    localStorage.setItem(ALARM_MAPPING_STORAGE_KEY, JSON.stringify(alarms))
    return true
  } catch (err) {
    console.error('Failed to save alarm mappings:', err)
    return false
  }
}

/**
 * Load alarm mappings from localStorage
 */
export const loadAlarmMappings = () => {
  try {
    const stored = localStorage.getItem(ALARM_MAPPING_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (err) {
    console.error('Failed to load alarm mappings:', err)
    return []
  }
}

/**
 * Clear all alarm mappings
 */
export const clearAlarmMappings = () => {
  try {
    localStorage.removeItem(ALARM_MAPPING_STORAGE_KEY)
    return true
  } catch (err) {
    console.error('Failed to clear alarm mappings:', err)
    return false
  }
}

/**
 * Get alarms for a specific node
 */
export const getNodeAlarms = (nodeId, alarms) => {
  return alarms.filter(alarm => alarm.affectedNodeIds.includes(nodeId))
}

/**
 * Get alarms for a specific edge
 */
export const getEdgeAlarms = (edgeId, alarms) => {
  return alarms.filter(alarm => alarm.affectedEdgeIds.includes(edgeId))
}

/**
 * Get all active alarms (not resolved)
 */
export const getActiveAlarms = (alarms) => {
  return alarms.filter(alarm => !alarm.resolved)
}

/**
 * Resolve an alarm
 */
export const resolveAlarm = (alarmId, alarms) => {
  return alarms.map(alarm =>
    alarm.id === alarmId ? { ...alarm, resolved: true } : alarm
  )
}

/**
 * Get alarm statistics
 */
export const getAlarmStats = (alarms) => {
  const active = alarms.filter(a => !a.resolved)
  const bySeverity = {
    critical: active.filter(a => a.severity === ALARM_SEVERITY.CRITICAL).length,
    high: active.filter(a => a.severity === ALARM_SEVERITY.HIGH).length,
    medium: active.filter(a => a.severity === ALARM_SEVERITY.MEDIUM).length,
    low: active.filter(a => a.severity === ALARM_SEVERITY.LOW).length
  }

  return {
    total: alarms.length,
    active: active.length,
    resolved: alarms.filter(a => a.resolved).length,
    bySeverity
  }
}

export default {
  ALARM_SEVERITY,
  ALARM_TYPES,
  createAlarm,
  getSeverityColor,
  getSeverityIcon,
  mapEventStreamAlarms,
  mapThreatEventAlarms,
  mapIncidentAlarms,
  mapNetworkDegradationAlarms,
  mapDeviceOfflineAlarms,
  consolidateAlarms,
  saveAlarmMappings,
  loadAlarmMappings,
  clearAlarmMappings,
  getNodeAlarms,
  getEdgeAlarms,
  getActiveAlarms,
  resolveAlarm,
  getAlarmStats
}

