import { useState, useEffect, useCallback } from 'react'
import { generateNetworkDataset, validateNetworkDataset } from '@/lib/networkDataset'

const STORAGE_KEY = 'tmobile_network_dataset'

/**
 * Custom hook for managing network dataset state
 * Handles loading, saving, and updating network topology data
 */
export const useNetworkDataset = () => {
  const [dataset, setDataset] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize dataset from localStorage or generate new one
  useEffect(() => {
    const initializeDataset = () => {
      try {
        setLoading(true)
        setError(null)

        // Try to load from localStorage
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          const validation = validateNetworkDataset(parsed)
          if (validation.isValid) {
            setDataset(parsed)
            setLoading(false)
            return
          }
        }

        // Generate new dataset if not found or invalid
        const newDataset = generateNetworkDataset()
        setDataset(newDataset)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newDataset))
        setLoading(false)
      } catch (err) {
        setError(err.message)
        // Fallback: generate new dataset
        const newDataset = generateNetworkDataset()
        setDataset(newDataset)
        setLoading(false)
      }
    }

    initializeDataset()
  }, [])

  /**
   * Update the entire dataset
   */
  const updateDataset = useCallback((newDataset) => {
    try {
      const validation = validateNetworkDataset(newDataset)
      if (!validation.isValid) {
        setError(`Invalid dataset: ${validation.errors.join(', ')}`)
        return false
      }

      // Update metadata
      newDataset.metadata.last_updated = new Date().toISOString()
      newDataset.metadata.node_count = newDataset.nodes.length
      newDataset.metadata.edge_count = newDataset.edges.length

      setDataset(newDataset)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newDataset))
      setError(null)
      return true
    } catch (err) {
      setError(err.message)
      return false
    }
  }, [])

  /**
   * Add alarm to a node
   */
  const addAlarmToNode = useCallback((nodeId, alarmId) => {
    if (!dataset) return false

    const updatedDataset = JSON.parse(JSON.stringify(dataset))
    const node = updatedDataset.nodes.find(n => n.id === nodeId)
    
    if (node && !node.alarmIds.includes(alarmId)) {
      node.alarmIds.push(alarmId)
      return updateDataset(updatedDataset)
    }
    return false
  }, [dataset, updateDataset])

  /**
   * Remove alarm from a node
   */
  const removeAlarmFromNode = useCallback((nodeId, alarmId) => {
    if (!dataset) return false

    const updatedDataset = JSON.parse(JSON.stringify(dataset))
    const node = updatedDataset.nodes.find(n => n.id === nodeId)
    
    if (node) {
      node.alarmIds = node.alarmIds.filter(id => id !== alarmId)
      return updateDataset(updatedDataset)
    }
    return false
  }, [dataset, updateDataset])

  /**
   * Add alarm to an edge
   */
  const addAlarmToEdge = useCallback((edgeId, alarmId) => {
    if (!dataset) return false

    const updatedDataset = JSON.parse(JSON.stringify(dataset))
    const edge = updatedDataset.edges.find(e => e.id === edgeId)
    
    if (edge && !edge.alarmIds.includes(alarmId)) {
      edge.alarmIds.push(alarmId)
      return updateDataset(updatedDataset)
    }
    return false
  }, [dataset, updateDataset])

  /**
   * Remove alarm from an edge
   */
  const removeAlarmFromEdge = useCallback((edgeId, alarmId) => {
    if (!dataset) return false

    const updatedDataset = JSON.parse(JSON.stringify(dataset))
    const edge = updatedDataset.edges.find(e => e.id === edgeId)
    
    if (edge) {
      edge.alarmIds = edge.alarmIds.filter(id => id !== alarmId)
      return updateDataset(updatedDataset)
    }
    return false
  }, [dataset, updateDataset])

  /**
   * Get all alarms for a node
   */
  const getNodeAlarms = useCallback((nodeId) => {
    if (!dataset) return []
    const node = dataset.nodes.find(n => n.id === nodeId)
    return node ? node.alarmIds : []
  }, [dataset])

  /**
   * Get all alarms for an edge
   */
  const getEdgeAlarms = useCallback((edgeId) => {
    if (!dataset) return []
    const edge = dataset.edges.find(e => e.id === edgeId)
    return edge ? edge.alarmIds : []
  }, [dataset])

  /**
   * Get node by ID
   */
  const getNode = useCallback((nodeId) => {
    if (!dataset) return null
    return dataset.nodes.find(n => n.id === nodeId)
  }, [dataset])

  /**
   * Get edge by ID
   */
  const getEdge = useCallback((edgeId) => {
    if (!dataset) return null
    return dataset.edges.find(e => e.id === edgeId)
  }, [dataset])

  /**
   * Get all nodes of a specific type
   */
  const getNodesByType = useCallback((type) => {
    if (!dataset) return []
    return dataset.nodes.filter(n => n.type === type)
  }, [dataset])

  /**
   * Get all nodes in a specific region
   */
  const getNodesByRegion = useCallback((region) => {
    if (!dataset) return []
    return dataset.nodes.filter(n => n.region === region)
  }, [dataset])

  /**
   * Get all edges connected to a node
   */
  const getConnectedEdges = useCallback((nodeId) => {
    if (!dataset) return []
    return dataset.edges.filter(e => e.source === nodeId || e.target === nodeId)
  }, [dataset])

  /**
   * Get all nodes with active alarms
   */
  const getAlarmedNodes = useCallback(() => {
    if (!dataset) return []
    return dataset.nodes.filter(n => n.alarmIds && n.alarmIds.length > 0)
  }, [dataset])

  /**
   * Get all edges with active alarms
   */
  const getAlarmedEdges = useCallback(() => {
    if (!dataset) return []
    return dataset.edges.filter(e => e.alarmIds && e.alarmIds.length > 0)
  }, [dataset])

  /**
   * Export dataset as JSON string
   */
  const exportDataset = useCallback(() => {
    if (!dataset) return null
    return JSON.stringify(dataset, null, 2)
  }, [dataset])

  /**
   * Import dataset from JSON string
   */
  const importDataset = useCallback((jsonString) => {
    try {
      const parsed = JSON.parse(jsonString)
      return updateDataset(parsed)
    } catch (err) {
      setError(`Failed to parse JSON: ${err.message}`)
      return false
    }
  }, [updateDataset])

  /**
   * Reset to default dataset
   */
  const resetDataset = useCallback(() => {
    const newDataset = generateNetworkDataset()
    updateDataset(newDataset)
  }, [updateDataset])

  /**
   * Clear all alarms from dataset
   */
  const clearAllAlarms = useCallback(() => {
    if (!dataset) return false

    const updatedDataset = JSON.parse(JSON.stringify(dataset))
    updatedDataset.nodes.forEach(node => {
      node.alarmIds = []
    })
    updatedDataset.edges.forEach(edge => {
      edge.alarmIds = []
    })
    return updateDataset(updatedDataset)
  }, [dataset, updateDataset])

  return {
    // State
    dataset,
    loading,
    error,

    // Dataset operations
    updateDataset,
    resetDataset,
    exportDataset,
    importDataset,

    // Alarm operations
    addAlarmToNode,
    removeAlarmFromNode,
    addAlarmToEdge,
    removeAlarmFromEdge,
    getNodeAlarms,
    getEdgeAlarms,
    clearAllAlarms,

    // Query operations
    getNode,
    getEdge,
    getNodesByType,
    getNodesByRegion,
    getConnectedEdges,
    getAlarmedNodes,
    getAlarmedEdges
  }
}

export default useNetworkDataset

