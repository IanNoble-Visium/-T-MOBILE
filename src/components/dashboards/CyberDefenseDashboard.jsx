import { useState, useEffect } from 'react'
import { ShieldAlert, Users, Target, FileSearch, Activity, Clock } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import KPICard from '../KPICard'
import { generateIncidents, generateEventStream, generateTimeSeriesData } from '@/lib/mockData'

const CyberDefenseDashboard = () => {
  const [incidents, setIncidents] = useState(generateIncidents(15))
  const [eventStream, setEventStream] = useState(generateEventStream(8))
  const [timeSeriesData] = useState(generateTimeSeriesData(7))
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEventStream(generateEventStream(8))
    }, 5000)
    return () => clearInterval(interval)
  }, [])
  
  const activeIncidents = incidents.filter(i => i.status !== 'resolved')
  const criticalIncidents = incidents.filter(i => i.severity === 'critical')
  
  const incidentsByStatus = [
    { status: 'Open', count: incidents.filter(i => i.status === 'open').length },
    { status: 'Investigating', count: incidents.filter(i => i.status === 'investigating').length },
    { status: 'Contained', count: incidents.filter(i => i.status === 'contained').length },
    { status: 'Resolved', count: incidents.filter(i => i.status === 'resolved').length }
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with NEW badge */}
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold">Cyber Defense Center</h1>
            <span className="px-3 py-1 rounded-full bg-yellow-500 text-black text-sm font-bold animate-pulse-glow">
              NEW - Launched Oct 15, 2025
            </span>
          </div>
          <p className="text-lg opacity-90">
            24/7 Threat Detection, Incident Response & Digital Forensics
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <ShieldAlert className="w-full h-full" />
        </div>
      </div>
      
      {/* KPI Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Active Incidents"
          value={activeIncidents.length}
          subtitle={`${criticalIncidents.length} critical`}
          trend="down"
          trendValue="-15%"
          icon={<ShieldAlert className="w-6 h-6" />}
          variant="danger"
        />

        <KPICard
          title="Threat Hunting Ops"
          value="12"
          subtitle="In progress"
          trend="up"
          trendValue="+3"
          icon={<Target className="w-6 h-6" />}
          variant="primary"
        />

        <KPICard
          title="Digital Forensics"
          value="8"
          subtitle="Active investigations"
          trend="up"
          trendValue="+2"
          icon={<FileSearch className="w-6 h-6" />}
          variant="secondary"
        />

        <KPICard
          title="Mean Time to Contain"
          value="12 min"
          subtitle="Average response"
          trend="down"
          trendValue="-25%"
          icon={<Clock className="w-6 h-6" />}
          variant="success"
        />
      </div>
      
      {/* Command Center View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Monitoring */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">Active Monitoring</h3>
          </div>
          <div className="space-y-3">
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Network Sensors</span>
                <span className="text-green-500 font-bold">247 Active</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '98%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Endpoint Agents</span>
                <span className="text-green-500 font-bold">48,523 Online</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '96%' }}></div>
              </div>
            </div>
            
            <div className="p-4 bg-background rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Threat Intelligence Feeds</span>
                <span className="text-green-500 font-bold">15 Sources</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Response Team Status */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <h3 className="font-semibold text-lg">Response Team</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <div className="font-semibold">Tier 1 Analysts</div>
                <div className="text-xs text-muted-foreground">Monitoring & Triage</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-semibold">
                8 Active
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <div className="font-semibold">Tier 2 Analysts</div>
                <div className="text-xs text-muted-foreground">Investigation</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-semibold">
                5 Active
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <div className="font-semibold">Incident Commanders</div>
                <div className="text-xs text-muted-foreground">Coordination</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-semibold">
                2 On Duty
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
              <div>
                <div className="font-semibold">Forensics Specialists</div>
                <div className="text-xs text-muted-foreground">Deep Analysis</div>
              </div>
              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-sm font-semibold">
                3 Available
              </span>
            </div>
          </div>
        </div>
        
        {/* Real-Time Alerts */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Real-Time Alerts</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {eventStream.map((event) => {
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
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      
      {/* Incident Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Incidents by Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={incidentsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="status" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
              <Bar dataKey="count" fill="#E20074" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Incident Response Trend (7 Days)</h3>
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
                dataKey="incidents" 
                stroke="#E20074" 
                strokeWidth={2}
                name="New Incidents"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Active Incidents Table */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Active Incidents</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Title</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Assigned To</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Playbook</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Age</th>
              </tr>
            </thead>
            <tbody>
              {activeIncidents.slice(0, 10).map((incident) => {
                const getSeverityBadge = (severity) => {
                  const colors = {
                    critical: 'bg-red-500/20 text-red-500',
                    high: 'bg-orange-500/20 text-orange-500',
                    medium: 'bg-yellow-500/20 text-yellow-500',
                    low: 'bg-blue-500/20 text-blue-500'
                  }
                  return colors[severity] || colors.low
                }
                
                const getStatusBadge = (status) => {
                  const colors = {
                    open: 'bg-red-500/20 text-red-500',
                    investigating: 'bg-yellow-500/20 text-yellow-500',
                    contained: 'bg-blue-500/20 text-blue-500',
                    resolved: 'bg-green-500/20 text-green-500'
                  }
                  return colors[status] || colors.open
                }
                
                const getAge = (date) => {
                  const hours = Math.floor((new Date() - new Date(date)) / (1000 * 60 * 60))
                  if (hours < 1) return 'Just now'
                  if (hours < 24) return `${hours}h ago`
                  return `${Math.floor(hours / 24)}d ago`
                }
                
                return (
                  <tr key={incident.id} className="border-b border-border hover:bg-background/50 transition-colors">
                    <td className="py-3 px-4 text-sm font-mono">{incident.id}</td>
                    <td className="py-3 px-4 text-sm">{incident.title}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(incident.status)}`}>
                        {incident.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm">{incident.assigned_to}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{incident.playbook}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{getAge(incident.created_at)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default CyberDefenseDashboard

