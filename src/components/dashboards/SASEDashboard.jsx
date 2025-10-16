import { useState, useEffect } from 'react'
import { Shield, Lock, Globe, Users, Zap, AlertCircle } from 'lucide-react'
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
import KPICard from '../KPICard'
import { generateSASEMetrics, generateTimeSeriesData } from '@/lib/mockData'

const SASEDashboard = () => {
  const [metrics, setMetrics] = useState(generateSASEMetrics())
  const [timeSeriesData] = useState(generateTimeSeriesData(7))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateSASEMetrics())
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  const deviceDistribution = [
    { name: 'T-SIMsecure', value: metrics.tsim_secure_devices, color: '#E20074' },
    { name: 'Device Client', value: metrics.device_client_deployments, color: '#0066CC' }
  ]
  
  const threatBlocking = [
    { category: 'Malware', count: metrics.malware_blocked },
    { category: 'Ransomware', count: metrics.ransomware_attempts },
    { category: 'Phishing', count: metrics.phishing_blocked },
    { category: 'IPS Events', count: metrics.ips_activations }
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden rounded-lg gradient-tmobile p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">SASE Security Platform</h1>
          <p className="text-lg opacity-90">
            Powered by T-Mobile 5G and Palo Alto Networks Precision AI
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Shield className="w-full h-full" />
        </div>
      </div>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Protected Devices"
          value={metrics.protected_devices.toLocaleString()}
          subtitle="Total SASE coverage"
          trend="up"
          trendValue="+5%"
          icon={Shield}
          variant="primary"
        />
        
        <KPICard
          title="Threats Blocked (24h)"
          value={metrics.threats_blocked_24h.toLocaleString()}
          subtitle="Real-time protection"
          trend="up"
          trendValue="+12%"
          icon={AlertCircle}
          variant="danger"
        />
        
        <KPICard
          title="ZTNA Enforcements"
          value={metrics.ztna_enforcements.toLocaleString()}
          subtitle="Zero Trust policies"
          trend="up"
          trendValue="+8%"
          icon={Lock}
          variant="secondary"
        />
        
        <KPICard
          title="Precision AI Detections"
          value={metrics.precision_ai_detections}
          subtitle="Never-before-seen threats"
          trend="up"
          trendValue="+15%"
          icon={Zap}
          variant="warning"
        />
      </div>
      
      {/* Device Protection Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Device Protection Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm">T-SIMsecure Devices</span>
              <span className="font-bold text-primary">{metrics.tsim_secure_devices.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm">Device Client Deployments</span>
              <span className="font-bold text-secondary">{metrics.device_client_deployments.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-background rounded-lg">
              <span className="text-sm">VPN Connections</span>
              <span className="font-bold text-muted-foreground">{metrics.vpn_connections.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Threat Blocking Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={threatBlocking}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="category" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Bar dataKey="count" fill="#E20074" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* SASE Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Private Access */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">Private Access (ZTNA)</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Zero Trust Enforcements</span>
                <span className="font-bold text-primary">{metrics.ztna_enforcements.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">Least Privileged Access</span>
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">Active</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">Micro-Segmentation</span>
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">Enabled</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                <span className="text-sm">Cloud App Access</span>
                <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-semibold">Secured</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Secure Internet Access */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">Secure Internet Access</h3>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">URL Filtering Events</span>
                <span className="font-bold text-primary">{metrics.url_filtering_events.toLocaleString()}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-background rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{metrics.malware_blocked.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Malware Blocked</div>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{metrics.phishing_blocked.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">Phishing Blocked</div>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{metrics.ransomware_attempts}</div>
                <div className="text-xs text-muted-foreground mt-1">Ransomware Stopped</div>
              </div>
              <div className="p-3 bg-background rounded-lg text-center">
                <div className="text-2xl font-bold text-primary">{metrics.ips_activations.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">IPS Activations</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Palo Alto Networks Precision AI */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="w-6 h-6 text-primary" />
          <h3 className="font-semibold text-lg">Palo Alto Networks Precision AI</h3>
          <span className="ml-auto px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
            8.95M threats detected daily
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-background rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">{metrics.precision_ai_detections}</div>
            <div className="text-sm text-muted-foreground">Never-Before-Seen Threats (24h)</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Real-time detection active
            </div>
          </div>
          
          <div className="p-4 bg-background rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">99.8%</div>
            <div className="text-sm text-muted-foreground">Threat Detection Accuracy</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Behavioral analysis enabled
            </div>
          </div>
          
          <div className="p-4 bg-background rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">&lt;1s</div>
            <div className="text-sm text-muted-foreground">Average Response Time</div>
            <div className="mt-3 flex items-center gap-2 text-xs text-green-500">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Automated blocking active
            </div>
          </div>
        </div>
      </div>
      
      {/* Security Trend */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">SASE Security Trend (7 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeSeriesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="date" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="threats" 
              stroke="#E20074" 
              strokeWidth={2}
              name="Threats Detected"
            />
            <Line 
              type="monotone" 
              dataKey="blocked" 
              stroke="#00A651" 
              strokeWidth={2}
              name="Threats Blocked"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SASEDashboard

