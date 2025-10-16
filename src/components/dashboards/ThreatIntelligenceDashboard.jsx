import { Target, Globe, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { generateThreatEvents } from '@/lib/mockData'

const ThreatIntelligenceDashboard = () => {
  const [threats] = useState(generateThreatEvents(50))
  
  const threatsByType = threats.reduce((acc, threat) => {
    acc[threat.type] = (acc[threat.type] || 0) + 1
    return acc
  }, {})
  
  const threatsByCountry = threats.reduce((acc, threat) => {
    acc[threat.source.country] = (acc[threat.source.country] || 0) + 1
    return acc
  }, {})
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">Threat Intelligence</h1>
          <p className="text-lg opacity-90">
            Global Threat Landscape & Intelligence Feeds
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Target className="w-full h-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Total Threats</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{threats.length}</div>
          <p className="text-sm text-muted-foreground mt-2">Last 7 days</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <Globe className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Source Countries</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{Object.keys(threatsByCountry).length}</div>
          <p className="text-sm text-muted-foreground mt-2">Unique origins</p>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-3 mb-3">
            <Target className="w-6 h-6 text-primary" />
            <h3 className="font-semibold">Threat Types</h3>
          </div>
          <div className="text-3xl font-bold text-primary">{Object.keys(threatsByType).length}</div>
          <p className="text-sm text-muted-foreground mt-2">Attack vectors</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Threats by Type</h3>
          <div className="space-y-3">
            {Object.entries(threatsByType).map(([type, count]) => {
              const percentage = (count / threats.length * 100).toFixed(1)
              return (
                <div key={type} className="p-3 bg-background rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm capitalize">{type.replace('-', ' ')}</span>
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
          <h3 className="font-semibold mb-4">Top Source Countries</h3>
          <div className="space-y-3">
            {Object.entries(threatsByCountry)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([country, count]) => {
                const percentage = (count / threats.length * 100).toFixed(1)
                return (
                  <div key={country} className="p-3 bg-background rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">{country}</span>
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
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">Recent Threat Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-semibold">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Type</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Source</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Target</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Severity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {threats.slice(0, 10).map((threat) => {
                const getSeverityBadge = (severity) => {
                  const colors = {
                    critical: 'bg-red-500/20 text-red-500',
                    high: 'bg-orange-500/20 text-orange-500',
                    medium: 'bg-yellow-500/20 text-yellow-500',
                    low: 'bg-blue-500/20 text-blue-500'
                  }
                  return colors[severity] || colors.low
                }
                
                return (
                  <tr key={threat.id} className="border-b border-border hover:bg-background/50">
                    <td className="py-3 px-4 text-sm">{threat.timestamp.toLocaleTimeString()}</td>
                    <td className="py-3 px-4 text-sm capitalize">{threat.type}</td>
                    <td className="py-3 px-4 text-sm">{threat.source.city}, {threat.source.country}</td>
                    <td className="py-3 px-4 text-sm">{threat.target.city}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getSeverityBadge(threat.severity)}`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm capitalize">{threat.status}</td>
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

export default ThreatIntelligenceDashboard

