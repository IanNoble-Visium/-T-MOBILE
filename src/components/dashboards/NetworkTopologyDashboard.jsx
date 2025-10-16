import { useState, useMemo } from 'react'
import { Network, AlertCircle, Filter, X } from 'lucide-react'
import useNetworkDataset from '@/hooks/useNetworkDataset'
import useAlarmSystem from '@/hooks/useAlarmSystem'
import NetworkTopologyVisualization from '@/components/NetworkTopologyVisualization'
import NetworkNodeDetail from '@/components/NetworkNodeDetail'
import AlarmDashboard from '@/components/AlarmDashboard'
import { NODE_TYPES } from '@/lib/networkDataset'
import { generateEventStream, generateThreatEvents, generateIncidents } from '@/lib/mockData'

const NetworkTopologyDashboard = () => {
  const {
    dataset,
    loading,
    error,
    getConnectedEdges,
    getNode,
    getEdge
  } = useNetworkDataset()

  // Generate mock data for alarm mapping (memoized to prevent infinite loops)
  const { eventStream, threatEvents, incidents } = useMemo(() => ({
    eventStream: generateEventStream(5),
    threatEvents: generateThreatEvents(3),
    incidents: generateIncidents(2)
  }), [])

  const {
    alarms,
    getNodeAlarms,
    getEdgeAlarms,
    getAlarmedNodes: getAlarmedNodesFromAlarms,
    getAlarmedEdges: getAlarmedEdgesFromAlarms,
    resolveAlarm,
    removeAlarm,
    resolveAllAlarms,
    clearAllAlarms
  } = useAlarmSystem(dataset, eventStream, threatEvents, incidents)

  const [selectedNode, setSelectedNode] = useState(null)
  const [selectedEdge, setSelectedEdge] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [filterRegion, setFilterRegion] = useState(null)
  const [filterSeverity, setFilterSeverity] = useState(null)
  const [showAlarmPanel, setShowAlarmPanel] = useState(true)
  const [layout, setLayout] = useState('force')

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Network Topology</h1>
          <p className="text-lg opacity-90">Loading network visualization...</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing topology visualization...</p>
        </div>
      </div>
    )
  }

  const alarmedNodeIds = getAlarmedNodesFromAlarms()
  const alarmedEdgeIds = getAlarmedEdgesFromAlarms()

  // Filter nodes based on selected filters
  let filteredNodes = dataset?.nodes || []
  if (filterType) {
    filteredNodes = filteredNodes.filter(n => n.type === filterType)
  }
  if (filterRegion) {
    filteredNodes = filteredNodes.filter(n => n.region === filterRegion)
  }

  // Get edges for filtered nodes
  const filteredNodeIds = new Set(filteredNodes.map(n => n.id))
  let filteredEdges = (dataset?.edges || []).filter(
    e => filteredNodeIds.has(e.source) && filteredNodeIds.has(e.target)
  )

  // Get unique regions
  const regions = [...new Set(dataset?.nodes?.map(n => n.region) || [])]

  const handleNodeClick = (node) => {
    setSelectedNode(node)
    setSelectedEdge(null)
  }

  const handleEdgeClick = (edge) => {
    const sourceNode = getNode(edge.source)
    const targetNode = getNode(edge.target)
    setSelectedEdge({ ...edge, sourceNode, targetNode })
    setSelectedNode(null)
  }

  const getSelectedNodeAlarms = () => {
    if (!selectedNode) return []
    return getNodeAlarms(selectedNode.id)
  }

  const getSelectedEdgeAlarms = () => {
    if (!selectedEdge) return []
    return getEdgeAlarms(selectedEdge.id)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Network Topology</h1>
          <p className="text-lg opacity-90">
            Interactive visualization of T-Mobile network infrastructure
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Network className="w-full h-full" />
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-destructive">Error</p>
            <p className="text-sm text-destructive/80">{error}</p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Nodes</p>
          <p className="text-2xl font-bold text-primary">{filteredNodes.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Total Links</p>
          <p className="text-2xl font-bold text-primary">{filteredEdges.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Alarmed Nodes</p>
          <p className="text-2xl font-bold text-destructive">{alarmedNodeIds.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Alarmed Links</p>
          <p className="text-2xl font-bold text-warning">{alarmedEdgeIds.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Active Alarms</p>
          <p className="text-2xl font-bold text-destructive">{alarms.filter(a => !a.resolved).length}</p>
        </div>
      </div>

      {/* Filters & Layout */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Filters & Layout</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Type Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Node Type</label>
            <select
              value={filterType || ''}
              onChange={(e) => setFilterType(e.target.value || null)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">All Types</option>
              {Object.entries(NODE_TYPES).map(([key, value]) => (
                <option key={key} value={key}>
                  {value.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Region</label>
            <select
              value={filterRegion || ''}
              onChange={(e) => setFilterRegion(e.target.value || null)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">All Regions</option>
              {regions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Layout Selector */}
          <div>
            <label className="text-sm font-medium mb-2 block">Layout</label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="force">Force-Directed</option>
              <option value="hierarchical">Hierarchical</option>
              <option value="circular">Circular</option>
              <option value="grid">Grid</option>
              <option value="radial">Radial</option>
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterType(null)
                setFilterRegion(null)
              }}
              className="w-full px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/90 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Visualization */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Network Graph</h3>
          <button
            onClick={() => setShowAlarmPanel(!showAlarmPanel)}
            className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
          >
            {showAlarmPanel ? 'Hide' : 'Show'} Alarms
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 h-[600px] rounded-lg overflow-hidden">
            <NetworkTopologyVisualization
              nodes={filteredNodes}
              edges={filteredEdges}
              onNodeClick={handleNodeClick}
              onEdgeClick={handleEdgeClick}
              selectedNodeId={selectedNode?.id}
              selectedEdgeId={selectedEdge?.id}
              alarmedNodeIds={alarmedNodeIds}
              alarmedEdgeIds={alarmedEdgeIds}
              layout={layout}
            />
          </div>
          {showAlarmPanel && (
            <div className="h-[600px] overflow-hidden">
              <AlarmDashboard
                alarms={alarms}
                onResolveAlarm={resolveAlarm}
                onRemoveAlarm={removeAlarm}
                onResolveAll={resolveAllAlarms}
                onClearAll={clearAllAlarms}
                filterSeverity={filterSeverity}
                onFilterChange={setFilterSeverity}
              />
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card rounded-lg border border-border p-4">
        <h3 className="font-semibold mb-4">Legend</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(NODE_TYPES).map(([key, value]) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: value.color }}
              />
              <span className="text-sm">{value.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <NetworkNodeDetail
          item={selectedNode}
          itemType="node"
          alarms={getSelectedNodeAlarms()}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Edge Detail Modal */}
      {selectedEdge && (
        <NetworkNodeDetail
          item={selectedEdge}
          itemType="edge"
          alarms={getSelectedEdgeAlarms()}
          onClose={() => setSelectedEdge(null)}
        />
      )}
    </div>
  )
}

export default NetworkTopologyDashboard

