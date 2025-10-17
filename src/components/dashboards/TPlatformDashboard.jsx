import { Network, Server, TrendingUp } from 'lucide-react'
import KPICard from '../KPICard'
import { generateNetworkMetrics } from '@/lib/mockData'
import { useState } from 'react'

const TPlatformDashboard = () => {
  const [metrics] = useState(generateNetworkMetrics())
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg gradient-trucontext p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">T-Platform Unified Management</h1>
          <p className="text-lg opacity-90">
            Centralized Network & Device Management Portal
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Network className="w-full h-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total Bandwidth"
          value={`${metrics.total_bandwidth} Gbps`}
          subtitle={`${metrics.bandwidth_utilization}% utilization`}
          trend="up"
          trendValue="+5%"
          icon={<Server className="w-6 h-6" />}
          variant="primary"
        />

        <KPICard
          title="Active Connections"
          value={metrics.active_connections.toLocaleString()}
          subtitle="Real-time sessions"
          trend="up"
          trendValue="+8%"
          icon={<Network className="w-6 h-6" />}
          variant="secondary"
        />

        <KPICard
          title="5G Coverage"
          value={`${metrics.five_g_coverage}%`}
          subtitle="Network availability"
          trend="up"
          trendValue="+2%"
          icon={<TrendingUp className="w-6 h-6" />}
          variant="success"
        />
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Network Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.latency_avg}ms</div>
            <div className="text-sm text-muted-foreground">Average Latency</div>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.packet_loss}%</div>
            <div className="text-sm text-muted-foreground">Packet Loss</div>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.network_slices_active}</div>
            <div className="text-sm text-muted-foreground">Active Network Slices</div>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.edge_nodes}</div>
            <div className="text-sm text-muted-foreground">Edge Computing Nodes</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TPlatformDashboard

