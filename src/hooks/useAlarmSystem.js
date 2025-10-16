import { useState, useEffect, useCallback } from 'react'
import {
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
} from '@/lib/alarmMapping'

/**
 * Custom hook for managing network alarms
 * Integrates alarms from all dashboard sources
 */
export const useAlarmSystem = (dataset, eventStream = [], threatEvents = [], incidents = []) => {
  const [alarms, setAlarms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize alarms from all sources
  useEffect(() => {
    try {
      setLoading(true)
      setError(null)

      // Try to load from localStorage first
      const stored = loadAlarmMappings()
      if (stored && stored.length > 0) {
        setAlarms(stored)
        setLoading(false)
        return
      }

      // Generate alarms from various sources
      if (!dataset || !dataset.nodes || !dataset.edges) {
        setLoading(false)
        return
      }

      const eventAlarms = eventStream.length > 0
        ? mapEventStreamAlarms(eventStream, dataset.nodes)
        : []

      const threatAlarms = threatEvents.length > 0
        ? mapThreatEventAlarms(threatEvents, dataset.nodes)
        : []

      const incidentAlarms = incidents.length > 0
        ? mapIncidentAlarms(incidents, dataset.nodes)
        : []

      const networkAlarms = mapNetworkDegradationAlarms(dataset.edges, dataset.nodes)
      const deviceAlarms = mapDeviceOfflineAlarms(dataset.nodes)

      const consolidated = consolidateAlarms(
        eventAlarms,
        threatAlarms,
        incidentAlarms,
        networkAlarms,
        deviceAlarms
      )

      setAlarms(consolidated)
      saveAlarmMappings(consolidated)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }, [dataset, eventStream, threatEvents, incidents])

  /**
   * Get alarms for a specific node
   */
  const getNodeAlarmsCallback = useCallback((nodeId) => {
    return getNodeAlarms(nodeId, alarms)
  }, [alarms])

  /**
   * Get alarms for a specific edge
   */
  const getEdgeAlarmsCallback = useCallback((edgeId) => {
    return getEdgeAlarms(edgeId, alarms)
  }, [alarms])

  /**
   * Get all active alarms
   */
  const getActiveAlarmsCallback = useCallback(() => {
    return getActiveAlarms(alarms)
  }, [alarms])

  /**
   * Resolve an alarm
   */
  const resolveAlarmCallback = useCallback((alarmId) => {
    const updated = resolveAlarm(alarmId, alarms)
    setAlarms(updated)
    saveAlarmMappings(updated)
  }, [alarms])

  /**
   * Resolve all alarms
   */
  const resolveAllAlarms = useCallback(() => {
    const updated = alarms.map(alarm => ({ ...alarm, resolved: true }))
    setAlarms(updated)
    saveAlarmMappings(updated)
  }, [alarms])

  /**
   * Add a new alarm
   */
  const addAlarm = useCallback((alarm) => {
    const updated = [...alarms, alarm]
    setAlarms(updated)
    saveAlarmMappings(updated)
  }, [alarms])

  /**
   * Remove an alarm
   */
  const removeAlarm = useCallback((alarmId) => {
    const updated = alarms.filter(a => a.id !== alarmId)
    setAlarms(updated)
    saveAlarmMappings(updated)
  }, [alarms])

  /**
   * Clear all alarms
   */
  const clearAllAlarms = useCallback(() => {
    setAlarms([])
    clearAlarmMappings()
  }, [])

  /**
   * Get alarm statistics
   */
  const getStats = useCallback(() => {
    return getAlarmStats(alarms)
  }, [alarms])

  /**
   * Get nodes with active alarms
   */
  const getAlarmedNodes = useCallback(() => {
    const activeAlarms = getActiveAlarms(alarms)
    const nodeIds = new Set()

    activeAlarms.forEach(alarm => {
      alarm.affectedNodeIds.forEach(nodeId => nodeIds.add(nodeId))
    })

    return Array.from(nodeIds)
  }, [alarms])

  /**
   * Get edges with active alarms
   */
  const getAlarmedEdges = useCallback(() => {
    const activeAlarms = getActiveAlarms(alarms)
    const edgeIds = new Set()

    activeAlarms.forEach(alarm => {
      alarm.affectedEdgeIds.forEach(edgeId => edgeIds.add(edgeId))
    })

    return Array.from(edgeIds)
  }, [alarms])

  return {
    // State
    alarms,
    loading,
    error,

    // Query operations
    getNodeAlarms: getNodeAlarmsCallback,
    getEdgeAlarms: getEdgeAlarmsCallback,
    getActiveAlarms: getActiveAlarmsCallback,
    getStats,
    getAlarmedNodes,
    getAlarmedEdges,

    // Mutation operations
    addAlarm,
    removeAlarm,
    resolveAlarm: resolveAlarmCallback,
    resolveAllAlarms,
    clearAllAlarms
  }
}

export default useAlarmSystem

