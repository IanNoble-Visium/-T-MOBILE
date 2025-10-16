import { useEffect, useState, useMemo } from 'react'
import { Network, AlertCircle, Zap } from 'lucide-react'
import useNetworkDataset from '@/hooks/useNetworkDataset'
import useAlarmSystem from '@/hooks/useAlarmSystem'
import {
  generateNetworkAIContext,
  formatNetworkContextForPrompt,
  generateSuggestedNetworkQueries
} from '@/lib/networkAIContext'
import { generateEventStream, generateThreatEvents, generateIncidents } from '@/lib/mockData'

/**
 * NetworkAIContext Component
 * Provides network topology and alarm context to AI system
 * Can be used to enhance AI queries with network-specific information
 */
const NetworkAIContext = ({ onContextReady = null, onSuggestedQueries = null }) => {
  const { dataset, loading: datasetLoading } = useNetworkDataset()

  // Memoize mock data to prevent infinite loops
  const { eventStream, threatEvents, incidents } = useMemo(() => ({
    eventStream: generateEventStream(5),
    threatEvents: generateThreatEvents(3),
    incidents: generateIncidents(2)
  }), [])

  const { alarms, loading: alarmsLoading } = useAlarmSystem(
    dataset,
    eventStream,
    threatEvents,
    incidents
  )

  const [context, setContext] = useState(null)
  const [suggestedQueries, setSuggestedQueries] = useState([])
  const [loading, setLoading] = useState(true)

  // Generate context when data is ready
  useEffect(() => {
    if (!datasetLoading && !alarmsLoading && dataset) {
      const networkContext = generateNetworkAIContext(dataset, alarms)
      const contextString = formatNetworkContextForPrompt(dataset, alarms)
      const queries = generateSuggestedNetworkQueries(dataset, alarms)

      setContext({
        ...networkContext,
        contextString
      })
      setSuggestedQueries(queries)

      // Notify parent component
      onContextReady?.({
        ...networkContext,
        contextString
      })
      onSuggestedQueries?.(queries)

      setLoading(false)
    }
  }, [dataset, alarms, datasetLoading, alarmsLoading, onContextReady, onSuggestedQueries])

  if (loading) {
    return null
  }

  if (!context) {
    return null
  }

  return (
    <div className="hidden">
      {/* This component provides context to the AI system but doesn't render UI */}
      <div id="network-ai-context" data-context={JSON.stringify(context)}>
        {context.contextString}
      </div>
    </div>
  )
}

/**
 * Hook to get network AI context
 */
export const useNetworkAIContext = () => {
  const { dataset, loading: datasetLoading } = useNetworkDataset()

  // Memoize mock data to prevent infinite loops
  const { eventStream, threatEvents, incidents } = useMemo(() => ({
    eventStream: generateEventStream(5),
    threatEvents: generateThreatEvents(3),
    incidents: generateIncidents(2)
  }), [])

  const { alarms, loading: alarmsLoading } = useAlarmSystem(
    dataset,
    eventStream,
    threatEvents,
    incidents
  )

  const [context, setContext] = useState(null)
  const [suggestedQueries, setSuggestedQueries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!datasetLoading && !alarmsLoading && dataset) {
      const networkContext = generateNetworkAIContext(dataset, alarms)
      const contextString = formatNetworkContextForPrompt(dataset, alarms)
      const queries = generateSuggestedNetworkQueries(dataset, alarms)

      setContext({
        ...networkContext,
        contextString
      })
      setSuggestedQueries(queries)
      setLoading(false)
    }
  }, [dataset, alarms, datasetLoading, alarmsLoading])

  return {
    context,
    suggestedQueries,
    loading,
    contextString: context?.contextString || ''
  }
}

export default NetworkAIContext

