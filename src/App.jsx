import { useState, useCallback } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import './App.css'

// Layout components
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import LoginPage from './components/LoginPage'

// Context
import { SearchProvider } from './contexts/SearchContext'

// Hooks
import { useAuth } from './hooks/useAuth'
import { useNetworkDataset } from './hooks/useNetworkDataset'
import { useAlarmSystem } from './hooks/useAlarmSystem'

// Dashboard components
import ExecutiveDashboard from './components/dashboards/ExecutiveDashboard'
import SASEDashboard from './components/dashboards/SASEDashboard'
import CyberDefenseDashboard from './components/dashboards/CyberDefenseDashboard'
import TPlatformDashboard from './components/dashboards/TPlatformDashboard'
import IoTDashboard from './components/dashboards/IoTDashboard'
import ThreatProtectDashboard from './components/dashboards/ThreatProtectDashboard'
import GraphAnalyticsDashboard from './components/dashboards/GraphAnalyticsDashboard'
import NetworkTopologyDashboard from './components/dashboards/NetworkTopologyDashboard'
import GeographicMapDashboard from './components/dashboards/GeographicMapDashboard'
import ThreatIntelligenceDashboard from './components/dashboards/ThreatIntelligenceDashboard'
import AIAnalyticsDashboard from './components/dashboards/AIAnalyticsDashboard'
import AIAgentDashboard from './components/dashboards/AIAgentDashboard'

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 w-12 h-12 border-4 border-[#E20074]/20 border-t-[#E20074] rounded-full animate-spin mx-auto"></div>
          <p className="text-white/60">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />
}

// Inner component that uses Router hooks
function AppContent() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const { dataset } = useNetworkDataset()
  const { alarms, resolveAlarm, resolveAllAlarms } = useAlarmSystem(dataset)

  const handleAlarmClick = useCallback((alarm) => {
    // Navigate to relevant dashboard based on alarm type
    if (alarm.affectedNodeIds?.length > 0) {
      navigate('/network-topology')
    } else if (alarm.affectedEdgeIds?.length > 0) {
      navigate('/network-topology')
    } else {
      navigate('/dashboard')
    }
  }, [navigate])

  const handleLogout = useCallback(() => {
    navigate('/login')
  }, [navigate])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          alarms={alarms}
          onAlarmClick={handleAlarmClick}
          onResolveAlarm={resolveAlarm}
          onResolveAllAlarms={resolveAllAlarms}
          onLogout={handleLogout}
        />

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
            <Route path="/network-topology" element={<NetworkTopologyDashboard />} />
            <Route path="/geographic-map" element={<GeographicMapDashboard />} />
            <Route path="/threat-intelligence" element={<ThreatIntelligenceDashboard />} />
            <Route path="/ai-analytics" element={<AIAnalyticsDashboard />} />
            <Route path="/ai-agents" element={<AIAgentDashboard />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  const { authData, isAuthenticated, isLoading, login } = useAuth()

  return (
    <Router>
      {isAuthenticated && !isLoading ? (
        <SearchProvider>
          <AppContent />
        </SearchProvider>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={login} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  )
}

export default App
