import { useState, useEffect } from 'react'
import { X, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * UserPreferencesModal - User settings and preferences
 * Includes theme switching, notification settings, and other UI preferences
 */
const UserPreferencesModal = ({ isOpen, onClose, userName = 'Admin User', userRole = 'Security Operations' }) => {
  const [theme, setTheme] = useState('dark')
  const [notifications, setNotifications] = useState(true)
  const [soundAlerts, setSoundAlerts] = useState(true)
  const [defaultDashboard, setDefaultDashboard] = useState('dashboard')

  // Load preferences from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('userPreferences')
    if (saved) {
      const prefs = JSON.parse(saved)
      setTheme(prefs.theme || 'dark')
      setNotifications(prefs.notifications !== false)
      setSoundAlerts(prefs.soundAlerts !== false)
      setDefaultDashboard(prefs.defaultDashboard || 'dashboard')
    }
  }, [isOpen])

  // Save preferences to localStorage
  const savePreferences = () => {
    const prefs = {
      theme,
      notifications,
      soundAlerts,
      defaultDashboard
    }
    localStorage.setItem('userPreferences', JSON.stringify(prefs))
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-lg w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold">User Preferences</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* User Info */}
          <div className="pb-4 border-b border-border">
            <p className="text-sm font-medium text-muted-foreground mb-2">Logged in as</p>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-muted-foreground">{userRole}</p>
          </div>

          {/* Theme Selection */}
          <div>
            <label className="text-sm font-medium mb-3 block">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  theme === 'light'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                  theme === 'dark'
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'border-border hover:bg-accent'
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <label className="text-sm font-medium mb-3 block">Notifications</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Enable notifications</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                  disabled={!notifications}
                />
                <span className="text-sm">Sound alerts</span>
              </label>
            </div>
          </div>

          {/* Default Dashboard */}
          <div>
            <label className="text-sm font-medium mb-3 block">Default Dashboard</label>
            <select
              value={defaultDashboard}
              onChange={(e) => setDefaultDashboard(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dashboard">Executive Dashboard</option>
              <option value="ai-analytics">AI Analytics</option>
              <option value="network-topology">Network Topology</option>
              <option value="geographic-map">Geographic Map</option>
              <option value="cyber-defense">Cyber Defense Center</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border bg-background/50">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={savePreferences}
            className="flex-1"
          >
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserPreferencesModal

