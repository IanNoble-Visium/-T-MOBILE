import { useState, useEffect } from 'react'
import { ShieldCheck, Shield, Lock, Globe, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import axios from 'axios'
import KPICard from '../KPICard'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const ThreatProtectDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [kpiMetrics, setKpiMetrics] = useState(null)
  const [networkMetrics, setNetworkMetrics] = useState(null)
  const [threatEvents, setThreatEvents] = useState([])
  const [deviceStats, setDeviceStats] = useState(null)
  const [eventStream, setEventStream] = useState([])
  const [threatStats, setThreatStats] = useState(null)
  
  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpi, network, threats, devices, events, stats] = await Promise.all([
          axios.get(`${API_BASE_URL}/data/kpi-metrics/latest`).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/data/network-metrics/latest`).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/data/threat-events?limit=20`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/data/devices/stats`).catch(() => ({ data: null })),
          axios.get(`${API_BASE_URL}/data/event-stream?limit=10`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/data/threat-stats`).catch(() => ({ data: null }))
        ])
        
        setKpiMetrics(kpi.data)
        setNetworkMetrics(network.data)
        setThreatEvents(threats.data)
        setDeviceStats(devices.data)
        setEventStream(events.data)
        setThreatStats(stats.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Use mock data as fallback
        setKpiMetrics(getMockKPI())
        setNetworkMetrics(getMockNetwork())
        setThreatEvents(getMockThreats())
        setDeviceStats(getMockDeviceStats())
        setEventStream(getMockEvents())
        setThreatStats(getMockThreatStats())
        setLoading(false)
      }
    }
    
    fetchData()
    
    // Refresh data every 10 seconds
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])
  
  // Mock data fallbacks
  const getMockKPI = () => ({
    threats_detected_24h: 2847,
    threats_blocked_24h: 2721,
    protected_devices: 48523
  })
  
  const getMockNetwork = () => ({
    vpn_connections: 12847,
    malware_blocked: 1245,
    phishing_blocked: 876,
    ransomware_attempts: 34,
    url_filtering_events: 45678
  })
  
  const getMockThreats = () => [
    { id: 'T001', type: 'Malware', severity: 'critical', status: 'blocked', timestamp: new Date().toISOString(), source_country: 'Russia' },
    { id: 'T002', type: 'Phishing', severity: 'high', status: 'blocked', timestamp: new Date().toISOString(), source_country: 'China' },
    { id: 'T003', type: 'Ransomware', severity: 'critical', status: 'blocked', timestamp: new Date().toISOString(), source_country: 'Iran' }
  ]
  
  const getMockDeviceStats = () => ({
    total: 48523,
    iot_devices: 12000,
    mobile_devices: 15000,
    endpoint_devices: 18000,
    network_devices: 3523,
    avg_security_posture: 87,
    compliant_devices: 46234
  })
  
  const getMockEvents = () => [
    { id: 'E001', type: 'Threat Blocked', severity: 'high', description: 'Malware blocked on endpoint', timestamp: new Date().toISOString() },
    { id: 'E002', type: 'VPN Connected', severity: 'info', description: 'User authenticated via VPN', timestamp: new Date().toISOString() }
  ]
  
  const getMockThreatStats = () => ({
    total_threats: 2847,
    critical: 342,
    high: 876,
    medium: 1234,
    low: 395,
    blocked: 2721
  })
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  // Calculate metrics
  const protectedDevices = deviceStats?.total || 0
  const threatsBlocked24h = kpiMetrics?.threats_blocked_24h || 0
  const vpnConnections = networkMetrics?.vpn_connections || 0
  const maliciousSitesBlocked = networkMetrics?.url_filtering_events || 0
  const blockRate = kpiMetrics?.threats_detected_24h > 0 
    ? ((kpiMetrics.threats_blocked_24h / kpiMetrics.threats_detected_24h) * 100).toFixed(1)
    : 95.6
  
  // Device protection breakdown
  const deviceProtection = [
    { name: 'Endpoints', value: deviceStats?.endpoint_devices || 18000, color: '#E20074' },
    { name: 'Mobile', value: deviceStats?.mobile_devices || 15000, color: '#0066CC' },
    { name: 'IoT', value: deviceStats?.iot_devices || 12000, color: '#00A651' },
    { name: 'Network', value: deviceStats?.network_devices || 3500, color: '#FFB81C' }
  ]
  
  // Threat types breakdown
  const threatTypes = [
    { type: 'Malware', count: networkMetrics?.malware_blocked || 1245 },
    { type: 'Phishing', count: networkMetrics?.phishing_blocked || 876 },
    { type: 'Ransomware', count: networkMetrics?.ransomware_attempts || 34 },
    { type: 'Other', count: 567 }
  ]
  
  // Threat severity breakdown
  const threatSeverity = [
    { name: 'Critical', value: threatStats?.critical || 342, color: '#E4002B' },
    { name: 'High', value: threatStats?.high || 876, color: '#FF6B35' },
    { name: 'Medium', value: threatStats?.medium || 1234, color: '#FFB81C' },
    { name: 'Low', value: threatStats?.low || 395, color: '#0066CC' }
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg gradient-tmobile p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Threat Protect</h1>
          <p className="text-lg opacity-90">
            Always-On Protection Across All Devices & Networks
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <ShieldCheck className="w-full h-full" />
        </div>
      </div>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Protected Endpoints"
          value={protectedDevices.toLocaleString()}
          subtitle="Total devices monitored"
          trend="up"
          trendValue="+8%"
          icon={Shield}
          variant="primary"
        />
        
        <KPICard
          title="Threats Blocked (24h)"
          value={threatsBlocked24h.toLocaleString()}
          subtitle={`${blockRate}% block rate`}
          trend="up"
          trendValue="+12%"
          icon={ShieldCheck}
          variant="success"
        />
        
        <KPICard
          title="VPN Connections"
          value={vpnConnections.toLocaleString()}
          subtitle="Secure encrypted traffic"
          trend="up"
          trendValue="+5%"
          icon={Lock}
          variant="secondary"
        />
        
        <KPICard
          title="Malicious Sites Blocked"
          value={maliciousSitesBlocked.toLocaleString()}
          subtitle="URL filtering events"
          trend="up"
          trendValue="+15%"
          icon={Globe}
          variant="warning"
        />
      </div>
      
      {/* Protection Status & Real-Time Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Protection Status */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">Protection Status</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Endpoint Protection</span>
                <span className="text-green-500 font-bold">Active</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '98%' }}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {(deviceStats?.endpoint_devices || 18000).toLocaleString()} devices protected
              </div>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">VPN Security</span>
                <span className="text-green-500 font-bold">Active</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '96%' }}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {vpnConnections.toLocaleString()} secure connections
              </div>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Threat Intelligence</span>
                <span className="text-green-500 font-bold">Active</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                15 threat feeds synchronized
              </div>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">URL Filtering</span>
                <span className="text-green-500 font-bold">Active</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '94%' }}></div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {maliciousSitesBlocked.toLocaleString()} sites blocked
              </div>
            </div>
          </div>
        </div>
        
        {/* Device Protection Breakdown */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Device Protection Coverage</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={deviceProtection}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceProtection.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {deviceProtection.map((item) => (
              <div key={item.name} className="flex justify-between items-center p-2 bg-background rounded">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-bold">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Real-Time Threat Feed */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Real-Time Threat Feed</h3>
          <div className="space-y-2 max-h-[350px] overflow-y-auto">
            {eventStream.length > 0 ? eventStream.map((event) => {
              const getSeverityColor = (severity) => {
                switch (severity) {
                  case 'critical': return 'border-l-red-500 bg-red-500/10'
                  case 'high': return 'border-l-orange-500 bg-orange-500/10'
                  case 'medium': return 'border-l-yellow-500 bg-yellow-500/10'
                  default: return 'border-l-blue-500 bg-blue-500/10'
                }
              }
              
              return (
                <div 
                  key={event.id} 
                  className={`p-3 rounded-lg border-l-4 ${getSeverityColor(event.severity)} animate-slide-up`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">{event.type}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.description || event.source}</p>
                </div>
              )
            }) : (
              <div className="text-center text-muted-foreground py-8">
                No recent events
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Threat Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Threats by Type (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={threatTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="type" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Bar dataKey="count" fill="#E20074" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Threats by Severity (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={threatSeverity}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {threatSeverity.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* VPN & URL Filtering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* VPN Security */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">VPN Security</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{vpnConnections.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Active Connections</div>
              </div>
              <div className="p-4 bg-background rounded-lg text-center">
                <div className="text-3xl font-bold text-green-500">100%</div>
                <div className="text-sm text-muted-foreground mt-1">Encryption Rate</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">AES-256 Encryption</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">Split Tunneling</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">Kill Switch Enabled</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">DNS Leak Protection</span>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Malicious Site Blocking */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">Malicious Site Blocking</h3>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{(networkMetrics?.malware_blocked || 1245).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Malware Sites</div>
              </div>
              <div className="p-4 bg-background rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{(networkMetrics?.phishing_blocked || 876).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Phishing Sites</div>
              </div>
              <div className="p-4 bg-background rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{(networkMetrics?.ransomware_attempts || 34).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Ransomware</div>
              </div>
              <div className="p-4 bg-background rounded-lg text-center">
                <div className="text-3xl font-bold text-primary">{maliciousSitesBlocked.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Blocked</div>
              </div>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">URL Categories Filtered</span>
                <span className="font-bold text-primary">28 Active</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {['Malware', 'Phishing', 'Gambling', 'Adult', 'Spam'].map((category) => (
                  <span key={category} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Threats Table */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Recent Threats Blocked</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Source Country</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Time</th>
              </tr>
            </thead>
            <tbody>
              {threatEvents.slice(0, 10).map((threat) => {
                const getSeverityBadge = (severity) => {
                  const colors = {
                    critical: 'bg-red-500/20 text-red-500',
                    high: 'bg-orange-500/20 text-orange-500',
                    medium: 'bg-yellow-500/20 text-yellow-500',
                    low: 'bg-blue-500/20 text-blue-500'
                  }
                  return colors[severity] || colors.low
                }
                
                const getStatusIcon = (status) => {
                  if (status === 'blocked') {
                    return <CheckCircle className="w-4 h-4 text-green-500" />
                  }
                  return <XCircle className="w-4 h-4 text-red-500" />
                }
                
                return (
                  <tr key={threat.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{threat.id}</td>
                    <td className="py-3 px-4 text-sm">{threat.type}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{threat.source_country}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(threat.status)}
                        <span className="text-sm capitalize">{threat.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">
                      {new Date(threat.timestamp).toLocaleTimeString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Security Posture Summary */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Overall Security Posture</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-green-500 mb-2">{blockRate}%</div>
            <div className="text-sm text-muted-foreground">Block Rate</div>
            <div className="mt-2 text-xs text-green-500">Excellent</div>
          </div>
          
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-green-500 mb-2">
              {deviceStats?.avg_security_posture || 87}
            </div>
            <div className="text-sm text-muted-foreground">Avg Security Score</div>
            <div className="mt-2 text-xs text-green-500">Strong</div>
          </div>
          
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-green-500 mb-2">
              {deviceStats?.compliant_devices ? 
                ((deviceStats.compliant_devices / deviceStats.total) * 100).toFixed(1) : 
                95.3}%
            </div>
            <div className="text-sm text-muted-foreground">Compliance Rate</div>
            <div className="mt-2 text-xs text-green-500">Excellent</div>
          </div>
          
          <div className="text-center p-6 bg-background rounded-lg">
            <div className="text-4xl font-bold text-green-500 mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Protection Coverage</div>
            <div className="mt-2 text-xs text-green-500">Always-On</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ThreatProtectDashboard
