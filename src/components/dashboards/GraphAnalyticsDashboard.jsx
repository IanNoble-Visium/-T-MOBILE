import { useState, useEffect } from 'react'
import { GitBranch, Network, Zap } from 'lucide-react'
import { generateGraphData } from '@/lib/mockData'

const GraphAnalyticsDashboard = () => {
  const [graphData] = useState(generateGraphData())
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Graph Analytics</h1>
          <p className="text-lg opacity-90">
            TruContext™ Powered Graph-Based Threat Analysis
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <GitBranch className="w-full h-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <Network className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Network Nodes</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{graphData.nodes.length}</div>
          <p className="text-sm text-muted-foreground mt-2">Total entities in graph</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <GitBranch className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Relationships</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{graphData.edges.length}</div>
          <p className="text-sm text-muted-foreground mt-2">Connections discovered</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Attack Paths</h3>
          </div>
          <div className="text-3xl font-bold text-primary">
            {graphData.nodes.filter(n => n.type === 'threat').length}
          </div>
          <p className="text-sm text-muted-foreground mt-2">Potential threat vectors</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Graph Visualization</h3>
        <div className="bg-background rounded-lg p-8 min-h-[500px] flex items-center justify-center">
          <div className="text-center">
            <GitBranch className="w-24 h-24 mx-auto mb-4 text-primary opacity-50" />
            <h4 className="text-xl font-semibold mb-2">Interactive Graph Visualization</h4>
            <p className="text-muted-foreground max-w-md">
              TruContext's graph-based analytics reveal hidden relationships between threats, 
              users, devices, and applications. Attack paths are visualized in real-time for 
              faster root cause analysis.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Node Types</h3>
          <div className="space-y-3">
            {['platform', 'device', 'threat'].map(type => {
              const count = graphData.nodes.filter(n => n.type === type).length
              const percentage = (count / graphData.nodes.length * 100).toFixed(1)
              
              return (
                <div key={type} className="p-3 bg-background rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm capitalize">{type}s</span>
                    <span className="font-bold">{count}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Key Features</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <div className="font-semibold text-sm">Multi-Hop Analysis</div>
                <div className="text-xs text-muted-foreground">Trace attack paths across multiple systems</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <div className="font-semibold text-sm">Relationship Discovery</div>
                <div className="text-xs text-muted-foreground">Automatically identify hidden connections</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
              <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
              <div>
                <div className="font-semibold text-sm">Pattern Recognition</div>
                <div className="text-xs text-muted-foreground">Detect similar attack patterns</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GraphAnalyticsDashboard

