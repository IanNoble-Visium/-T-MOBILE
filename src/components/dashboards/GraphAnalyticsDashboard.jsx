import { useState } from 'react'
import { GitBranch, Network, Zap, AlertCircle } from 'lucide-react'
import useNetworkDataset from '@/hooks/useNetworkDataset'
import DatasetManager from '@/components/DatasetManager'
import { NODE_TYPES } from '@/lib/networkDataset'

const GraphAnalyticsDashboard = () => {
  const {
    dataset,
    loading,
    error,
    updateDataset,
    resetDataset,
    exportDataset,
    importDataset,
    getNodesByType,
    getAlarmedNodes,
    getAlarmedEdges
  } = useNetworkDataset()

  const [selectedNodeType, setSelectedNodeType] = useState(null)

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">Graph Analytics</h1>
          <p className="text-lg opacity-90">Loading network topology...</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Initializing network dataset...</p>
        </div>
      </div>
    )
  }

  const nodeTypeStats = Object.keys(NODE_TYPES).map(type => ({
    type,
    count: getNodesByType(type).length,
    label: NODE_TYPES[type].label,
    color: NODE_TYPES[type].color
  }))

  const alarmedNodes = getAlarmedNodes()
  const alarmedEdges = getAlarmedEdges()

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Graph Analytics</h1>
          <p className="text-lg opacity-90">
            TruContext™ Network Topology & Infrastructure Analysis
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <GitBranch className="w-full h-full" />
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

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <Network className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Network Nodes</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{dataset?.nodes?.length || 0}</div>
          <p className="text-sm text-muted-foreground mt-2">Infrastructure elements</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Connections</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{dataset?.edges?.length || 0}</div>
          <p className="text-sm text-muted-foreground mt-2">Network links</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h3 className="font-semibold">Alarmed Nodes</h3>
          </div>
          <div className="text-3xl font-bold text-destructive">{alarmedNodes.length}</div>
          <p className="text-sm text-muted-foreground mt-2">Active alarms</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-warning" />
            <h3 className="font-semibold">Alarmed Links</h3>
          </div>
          <div className="text-3xl font-bold text-warning">{alarmedEdges.length}</div>
          <p className="text-sm text-muted-foreground mt-2">Connection issues</p>
        </div>
      </div>

      {/* Node Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Infrastructure by Type</h3>
          <div className="space-y-3">
            {nodeTypeStats.map(stat => (
              <div
                key={stat.type}
                className="p-3 bg-background rounded-lg cursor-pointer hover:bg-background/80 transition-colors"
                onClick={() => setSelectedNodeType(selectedNodeType === stat.type ? null : stat.type)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    ></div>
                    <span className="text-sm font-medium">{stat.label}</span>
                  </div>
                  <span className="font-bold">{stat.count}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(stat.count / (dataset?.nodes?.length || 1)) * 100}%`,
                      backgroundColor: stat.color
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Network Statistics</h3>
          <div className="space-y-3">
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">Total Capacity</p>
              <p className="text-lg font-bold">
                {dataset?.nodes?.reduce((sum, n) => sum + (n.capacity || 0), 0).toLocaleString()} units
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">Avg Link Utilization</p>
              <p className="text-lg font-bold">
                {dataset?.edges?.length > 0
                  ? (dataset.edges.reduce((sum, e) => sum + (e.utilization || 0), 0) / dataset.edges.length).toFixed(1)
                  : 0
                }%
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">Regions Covered</p>
              <p className="text-lg font-bold">
                {new Set(dataset?.nodes?.map(n => n.region)).size}
              </p>
            </div>
            <div className="p-3 bg-background rounded-lg">
              <p className="text-sm text-muted-foreground">Dataset Version</p>
              <p className="text-lg font-bold">{dataset?.metadata?.version || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dataset Manager */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Dataset Management</h3>
        <DatasetManager
          dataset={dataset}
          onImport={importDataset}
          onReset={resetDataset}
          onExport={exportDataset}
        />
      </div>

      {/* Network Topology Visualization Placeholder */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Interactive Network Topology</h3>
        <div className="bg-background rounded-lg p-8 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <GitBranch className="w-24 h-24 mx-auto mb-4 text-primary opacity-50" />
            <h4 className="text-xl font-semibold mb-2">Network Topology Visualization</h4>
            <p className="text-muted-foreground max-w-md">
              Interactive graph visualization coming in Phase 3. Currently showing {dataset?.nodes?.length} nodes
              and {dataset?.edges?.length} connections across {new Set(dataset?.nodes?.map(n => n.region)).size} regions.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphAnalyticsDashboard

