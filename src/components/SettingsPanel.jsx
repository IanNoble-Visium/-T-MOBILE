import { useState, useEffect } from 'react'
import { X, Settings, Database, Download, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * SettingsPanel - Application-level configuration and settings
 * Includes data source configuration, layout preferences, and export/import
 */
const SettingsPanel = ({ isOpen, onClose }) => {
  const [dataSource, setDataSource] = useState('neo4j')
  const [neo4jStatus, setNeo4jStatus] = useState('connected')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [layoutMode, setLayoutMode] = useState('default')

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      const settings = JSON.parse(saved)
      setDataSource(settings.dataSource || 'neo4j')
      setAutoRefresh(settings.autoRefresh !== false)
      setRefreshInterval(settings.refreshInterval || 30)
      setLayoutMode(settings.layoutMode || 'default')
    }
  }, [isOpen])

  // Check Neo4j connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/network-topology/nodes', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        })
        setNeo4jStatus(response.ok ? 'connected' : 'disconnected')
      } catch (err) {
        setNeo4jStatus('disconnected')
      }
    }

    if (isOpen) {
      checkConnection()
    }
  }, [isOpen])

  const saveSettings = () => {
    const settings = {
      dataSource,
      autoRefresh,
      refreshInterval,
      layoutMode
    }
    localStorage.setItem('appSettings', JSON.stringify(settings))
    onClose()
  }

  const handleExport = () => {
    const data = {
      settings: {
        dataSource,
        autoRefresh,
        refreshInterval,
        layoutMode
      },
      exportDate: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tmobile-settings-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Data Source */}
          <div>
            <label className="text-sm font-medium mb-3 block">Data Source</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dataSource"
                  value="neo4j"
                  checked={dataSource === 'neo4j'}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Neo4j (Live)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="dataSource"
                  value="mock"
                  checked={dataSource === 'mock'}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Mock Data (Demo)</span>
              </label>
            </div>
            <div className="mt-3 p-3 bg-accent/50 rounded-md">
              <p className="text-xs text-muted-foreground mb-1">Neo4j Status:</p>
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${neo4jStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm capitalize">{neo4jStatus}</span>
              </div>
            </div>
          </div>

          {/* Auto Refresh */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-medium">Auto-refresh data</span>
            </label>
            {autoRefresh && (
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">Refresh interval (seconds)</label>
                <input
                  type="number"
                  min="10"
                  max="300"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Layout Mode */}
          <div>
            <label className="text-sm font-medium mb-3 block">Dashboard Layout</label>
            <select
              value={layoutMode}
              onChange={(e) => setLayoutMode(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="default">Default Layout</option>
              <option value="compact">Compact Layout</option>
              <option value="wide">Wide Layout</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-border bg-background/50">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={saveSettings}
            className="flex-1"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel

