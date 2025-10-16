import { useState, useMemo } from 'react'
import { MapPin, AlertCircle, Filter } from 'lucide-react'
import useNetworkDataset from '@/hooks/useNetworkDataset'
import useAlarmSystem from '@/hooks/useAlarmSystem'
import GeographicMapVisualization from '@/components/GeographicMapVisualization'
import NetworkNodeDetail from '@/components/NetworkNodeDetail'
import AlarmDashboard from '@/components/AlarmDashboard'
import { NODE_TYPES } from '@/lib/networkDataset'
import { generateEventStream, generateThreatEvents, generateIncidents } from '@/lib/mockData'

const GeographicMapDashboard = () => {
  const {
    dataset,
    loading,
    error,
    getNodesByType,
    getNodesByRegion
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
    getAlarmedNodes: getAlarmedNodesFromAlarms,
    resolveAlarm,
    removeAlarm,
    resolveAllAlarms,
    clearAllAlarms
  } = useAlarmSystem(dataset, eventStream, threatEvents, incidents)

  const [selectedNode, setSelectedNode] = useState(null)
  const [filterType, setFilterType] = useState(null)
  const [filterRegion, setFilterRegion] = useState(null)
  const [filterSeverity, setFilterSeverity] = useState(null)
  const [showAlarmPanel, setShowAlarmPanel] = useState(true)
  const [mapCenter, setMapCenter] = useState([39.8283, -98.5795])
  const [mapZoom, setMapZoom] = useState(4)

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Geographic Map</h1>
          <p className="text-lg opacity-90">Loading geographic visualization...</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing map...</p>
        </div>
      </div>
    )
  }

  const alarmedNodeIds = getAlarmedNodesFromAlarms()

  // Filter nodes based on selected filters
  let filteredNodes = dataset?.nodes || []
  if (filterType) {
    filteredNodes = filteredNodes.filter(n => n.type === filterType)
  }
  if (filterRegion) {
    filteredNodes = filteredNodes.filter(n => n.region === filterRegion)
  }

  // Get unique regions
  const regions = [...new Set(dataset?.nodes?.map(n => n.region) || [])]

  // Get alarmed nodes in filtered set
  const filteredAlarmedNodeIds = alarmedNodeIds.filter(nodeId =>
    filteredNodes.some(fn => fn.id === nodeId)
  )

  const handleNodeClick = (node) => {
    setSelectedNode(node)
    // Optionally zoom to node
    setMapCenter([node.location.lat, node.location.lon])
    setMapZoom(8)
  }

  const handleZoomToRegion = (region) => {
    const regionNodes = getNodesByRegion(region)
    if (regionNodes.length === 0) return

    const lats = regionNodes.map(n => n.location.lat)
    const lons = regionNodes.map(n => n.location.lon)

    const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2
    const centerLon = (Math.min(...lons) + Math.max(...lons)) / 2

    setMapCenter([centerLat, centerLon])
    setMapZoom(6)
  }

  const handleZoomToAll = () => {
    setMapCenter([39.8283, -98.5795])
    setMapZoom(4)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Geographic Map</h1>
          <p className="text-lg opacity-90">
            Network infrastructure distribution across regions
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <MapPin className="w-full h-full" />
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
          <p className="text-sm text-muted-foreground">Regions</p>
          <p className="text-2xl font-bold text-primary">{regions.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Alarmed Nodes</p>
          <p className="text-2xl font-bold text-destructive">{filteredAlarmedNodeIds.length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Active Alarms</p>
          <p className="text-2xl font-bold text-destructive">{alarms.filter(a => !a.resolved).length}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <p className="text-sm text-muted-foreground">Selected</p>
          <p className="text-2xl font-bold text-primary">{selectedNode ? 1 : 0}</p>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Filters & Controls</h3>
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

          {/* Zoom Controls */}
          <div>
            <label className="text-sm font-medium mb-2 block">Zoom to Region</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  handleZoomToRegion(e.target.value)
                  e.target.value = ''
                }
              }}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
            >
              <option value="">Select region...</option>
              {regions.map(region => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Button */}
          <div className="flex items-end gap-2">
            <button
              onClick={() => {
                setFilterType(null)
                setFilterRegion(null)
              }}
              className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm hover:bg-secondary/90 transition-colors"
            >
              Reset Filters
            </button>
            <button
              onClick={handleZoomToAll}
              className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors"
            >
              Zoom All
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Network Distribution</h3>
          {!showAlarmPanel && (
            <button
              onClick={() => setShowAlarmPanel(true)}
              className="text-sm px-3 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
            >
              Show Alarms
            </button>
          )}
        </div>
        <div className="h-[600px] rounded-lg overflow-hidden">
          <GeographicMapVisualization
            nodes={filteredNodes}
            onNodeClick={handleNodeClick}
            selectedNodeId={selectedNode?.id}
            alarmedNodeIds={filteredAlarmedNodeIds}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>
      </div>

      {/* Regional Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold mb-4">Regional Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map(region => {
              const regionNodes = getNodesByRegion(region)
              const regionAlarmedNodeIds = alarmedNodeIds.filter(nodeId =>
                regionNodes.some(n => n.id === nodeId)
              )
              return (
                <div
                  key={region}
                  className="bg-background rounded-lg p-4 cursor-pointer hover:border-primary transition-colors border border-border"
                  onClick={() => handleZoomToRegion(region)}
                >
                  <p className="font-semibold mb-2">{region}</p>
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">
                      Nodes: <span className="font-bold text-primary">{regionNodes.length}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Alarms: <span className="font-bold text-destructive">{regionAlarmedNodeIds.length}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alarm Panel */}
        {showAlarmPanel && (
          <div className="bg-card rounded-lg border border-border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Active Alarms</h3>
              <button
                onClick={() => setShowAlarmPanel(false)}
                className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
              >
                Hide
              </button>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
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
          </div>
        )}
      </div>

      {/* Node Detail Modal */}
      {selectedNode && (
        <NetworkNodeDetail
          item={selectedNode}
          itemType="node"
          alarms={[]}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}

export default GeographicMapDashboard

