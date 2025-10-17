import { useEffect, useState } from 'react'
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  DollarSign,
  TrendingUp,
  Zap,
  Globe,
  Server
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts'
import KPICard from '../KPICard'
import { 
  generateKPIMetrics, 
  generateTimeSeriesData, 
  generateEventStream,
  generateCompetitiveData
} from '@/lib/mockData'

const ExecutiveDashboard = () => {
  const [kpiMetrics, setKpiMetrics] = useState(generateKPIMetrics())
  const [timeSeriesData, setTimeSeriesData] = useState(generateTimeSeriesData(30))
  const [eventStream, setEventStream] = useState(generateEventStream(10))
  const [competitiveData, setCompetitiveData] = useState(generateCompetitiveData())
  
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setKpiMetrics(generateKPIMetrics())
      setEventStream(generateEventStream(10))
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Transform competitive data for radar chart
  const radarData = [
    {
      metric: 'Detection Speed',
      'T-Mobile + TruContext': 100,
      'Verizon': 65,
      'AT&T': 60
    },
    {
      metric: 'Coverage',
      'T-Mobile + TruContext': competitiveData.tmobile_trucontext.coverage_score,
      'Verizon': competitiveData.verizon.coverage_score,
      'AT&T': competitiveData.att.coverage_score
    },
    {
      metric: 'Cost Efficiency',
      'T-Mobile + TruContext': competitiveData.tmobile_trucontext.cost_efficiency,
      'Verizon': competitiveData.verizon.cost_efficiency,
      'AT&T': competitiveData.att.cost_efficiency
    },
    {
      metric: 'AI Capabilities',
      'T-Mobile + TruContext': competitiveData.tmobile_trucontext.ai_capabilities,
      'Verizon': competitiveData.verizon.ai_capabilities,
      'AT&T': competitiveData.att.ai_capabilities
    },
    {
      metric: 'Integration',
      'T-Mobile + TruContext': competitiveData.tmobile_trucontext.integration_score,
      'Verizon': competitiveData.verizon.integration_score,
      'AT&T': competitiveData.att.integration_score
    }
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Executive Security Dashboard</h1>
          <p className="text-lg opacity-90">
            Unified Intelligence Platform powered by T-Mobile 5G and TruContext Analytics
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Globe className="w-full h-full" />
        </div>
      </div>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Threats Detected (24h)"
          value={kpiMetrics.threats_detected_24h.toLocaleString()}
          subtitle={`${kpiMetrics.threats_blocked_24h.toLocaleString()} blocked`}
          trend="up"
          trendValue="+12%"
          icon={<Shield className="w-6 h-6" />}
          variant="primary"
        />

        <KPICard
          title="Active Incidents"
          value={kpiMetrics.active_incidents}
          subtitle="Across all platforms"
          trend="down"
          trendValue="-8%"
          icon={<AlertTriangle className="w-6 h-6" />}
          variant="warning"
        />

        <KPICard
          title="Network Health Score"
          value={`${kpiMetrics.network_health_score}%`}
          subtitle="5G Advanced Network"
          trend="up"
          trendValue="+2%"
          icon={<Activity className="w-6 h-6" />}
          variant="success"
        />

        <KPICard
          title="Cost Savings (Annual)"
          value={`$${(kpiMetrics.cost_savings / 1000000).toFixed(1)}M`}
          subtitle="vs. Traditional SIEM"
          trend="up"
          trendValue="+25%"
          icon={<DollarSign className="w-6 h-6" />}
          variant="secondary"
        />
      </div>
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Server className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Protected Assets</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Devices</span>
              <span className="font-bold">{kpiMetrics.protected_devices.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">IoT Devices</span>
              <span className="font-bold">{kpiMetrics.iot_devices.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">SASE Connections</span>
              <span className="font-bold">{kpiMetrics.sase_connections.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Response Metrics</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mean Time to Detect</span>
              <span className="font-bold">{kpiMetrics.mean_time_to_detect} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Mean Time to Respond</span>
              <span className="font-bold">{kpiMetrics.mean_time_to_respond} min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Uptime</span>
              <span className="font-bold">{kpiMetrics.uptime_percentage}%</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Platform Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">SASE Platform</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cyber Defense Center</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">IoT Hub</span>
              <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">Healthy</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Trend Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Threat Detection Trend (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeSeriesData}>
              <defs>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E20074" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#E20074" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0066CC" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#0066CC" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="threats" 
                stroke="#E20074" 
                fillOpacity={1} 
                fill="url(#colorThreats)" 
                name="Threats Detected"
              />
              <Area 
                type="monotone" 
                dataKey="blocked" 
                stroke="#0066CC" 
                fillOpacity={1} 
                fill="url(#colorBlocked)" 
                name="Threats Blocked"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Network Health Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Network Health & Devices (30 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis yAxisId="left" stroke="#888" />
              <YAxis yAxisId="right" orientation="right" stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="network_health" 
                stroke="#00A651" 
                strokeWidth={2}
                name="Network Health %"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="devices" 
                stroke="#FFB81C" 
                strokeWidth={2}
                name="Active Devices"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Competitive Advantage & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Competitive Radar Chart */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Competitive Advantage Analysis</h3>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#333" />
              <PolarAngleAxis dataKey="metric" stroke="#888" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#888" />
              <Radar 
                name="T-Mobile + TruContext" 
                dataKey="T-Mobile + TruContext" 
                stroke="#E20074" 
                fill="#E20074" 
                fillOpacity={0.6} 
              />
              <Radar 
                name="Verizon" 
                dataKey="Verizon" 
                stroke="#888" 
                fill="#888" 
                fillOpacity={0.3} 
              />
              <Radar 
                name="AT&T" 
                dataKey="AT&T" 
                stroke="#666" 
                fill="#666" 
                fillOpacity={0.3} 
              />
              <Legend />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Real-Time Event Stream */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Real-Time Security Events</h3>
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {eventStream.map((event) => {
              const getSeverityColor = (severity) => {
                switch (severity) {
                  case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-500'
                  case 'high': return 'bg-orange-500/20 border-orange-500/50 text-orange-500'
                  case 'medium': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-500'
                  default: return 'bg-blue-500/20 border-blue-500/50 text-blue-500'
                }
              }
              
              return (
                <div 
                  key={event.id} 
                  className={`p-3 rounded-lg border ${getSeverityColor(event.severity)} animate-slide-up`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{event.type}</span>
                    <span className="text-xs opacity-70">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs opacity-80">{event.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExecutiveDashboard

