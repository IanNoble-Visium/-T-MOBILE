import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

// Layout components
import Sidebar from './components/Sidebar'
import Header from './components/Header'

// Dashboard components
import ExecutiveDashboard from './components/dashboards/ExecutiveDashboard'
import SASEDashboard from './components/dashboards/SASEDashboard'
import CyberDefenseDashboard from './components/dashboards/CyberDefenseDashboard'
import TPlatformDashboard from './components/dashboards/TPlatformDashboard'
import IoTDashboard from './components/dashboards/IoTDashboard'
import ThreatProtectDashboard from './components/dashboards/ThreatProtectDashboard'
import GraphAnalyticsDashboard from './components/dashboards/GraphAnalyticsDashboard'
import ThreatIntelligenceDashboard from './components/dashboards/ThreatIntelligenceDashboard'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<ExecutiveDashboard />} />
              <Route path="/sase" element={<SASEDashboard />} />
              <Route path="/cyber-defense" element={<CyberDefenseDashboard />} />
              <Route path="/t-platform" element={<TPlatformDashboard />} />
              <Route path="/iot" element={<IoTDashboard />} />
              <Route path="/threat-protect" element={<ThreatProtectDashboard />} />
              <Route path="/graph-analytics" element={<GraphAnalyticsDashboard />} />
              <Route path="/threat-intelligence" element={<ThreatIntelligenceDashboard />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App

