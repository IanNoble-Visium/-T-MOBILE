import { useState } from 'react'
import { Cpu, MapPin, AlertTriangle, Activity } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import KPICard from '../KPICard'
import { generateIoTMetrics } from '@/lib/mockData'

const IoTDashboard = () => {
  const [metrics] = useState(generateIoTMetrics())
  
  const devicesByTechnology = [
    { name: 'NB-IoT', value: metrics.nb_iot_devices, color: '#E20074' },
    { name: 'LTE-M', value: metrics.lte_m_devices, color: '#0066CC' },
    { name: '5G', value: metrics.five_g_devices, color: '#00A651' }
  ]
  
  const deviceHealth = [
    { name: 'Good', value: metrics.device_health_good, color: '#00A651' },
    { name: 'Warning', value: metrics.device_health_warning, color: '#FFB81C' },
    { name: 'Critical', value: metrics.device_health_critical, color: '#E4002B' }
  ]
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative overflow-hidden rounded-lg gradient-cyber p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-2">IoT Security Hub</h1>
          <p className="text-lg opacity-90">
            Comprehensive IoT Device Management & Security Monitoring
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
          <Cpu className="w-full h-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total IoT Devices"
          value={metrics.total_devices.toLocaleString()}
          subtitle="Across all networks"
          trend="up"
          trendValue="+12%"
          icon={Cpu}
          variant="primary"
        />
        
        <KPICard
          title="Healthy Devices"
          value={metrics.device_health_good.toLocaleString()}
          subtitle={`${((metrics.device_health_good / metrics.total_devices) * 100).toFixed(1)}% of total`}
          trend="up"
          trendValue="+3%"
          icon={Activity}
          variant="success"
        />
        
        <KPICard
          title="Anomalies Detected"
          value={metrics.anomalies_detected}
          subtitle="Last 24 hours"
          trend="down"
          trendValue="-15%"
          icon={AlertTriangle}
          variant="warning"
        />
        
        <KPICard
          title="Security Alerts"
          value={metrics.security_alerts}
          subtitle="Active alerts"
          trend="down"
          trendValue="-20%"
          icon={AlertTriangle}
          variant="danger"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Devices by Network Technology</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={devicesByTechnology}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {devicesByTechnology.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold mb-4">Device Health Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceHealth}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {deviceHealth.map((entry, index) => (
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
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="font-semibold mb-4">IoT Operations Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.firmware_updates_pending}</div>
            <div className="text-sm text-muted-foreground">Firmware Updates Pending</div>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.anomalies_detected}</div>
            <div className="text-sm text-muted-foreground">Behavioral Anomalies</div>
          </div>
          <div className="p-4 bg-background rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.security_alerts}</div>
            <div className="text-sm text-muted-foreground">Security Alerts</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IoTDashboard

