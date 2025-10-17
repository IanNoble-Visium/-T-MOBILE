import { useState, useEffect } from 'react'
import { Search, Menu, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearch } from '@/contexts/SearchContext'
import AlarmNotificationDropdown from './AlarmNotificationDropdown'
import UserProfileMenu from './UserProfileMenu'
import UserPreferencesModal from './UserPreferencesModal'
import SettingsPanel from './SettingsPanel'

/**
 * Header Component - Enhanced with interactive features
 * Includes search, notifications, user menu, and settings
 */
const Header = ({
  onMenuClick,
  alarms = [],
  onAlarmClick,
  onResolveAlarm,
  onResolveAllAlarms,
  onLogout
}) => {
  const { searchQuery, updateSearch, clearSearch } = useSearch()
  const [currentTime, setCurrentTime] = useState('')
  const [showPreferences, setShowPreferences] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleSearchChange = (e) => {
    const value = e.target.value
    updateSearch(value)
  }

  const handleClearSearch = () => {
    clearSearch()
  }

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken')
    localStorage.removeItem('userPreferences')
    localStorage.removeItem('appSettings')

    if (onLogout) {
      onLogout()
    }
  }

  return (
    <>
      <header className="bg-card border-b border-border px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-accent transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search threats, devices, incidents..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring w-80"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-sm text-muted-foreground">
              {currentTime}
            </div>

            <div className="flex items-center gap-2">
              {/* Settings Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(true)}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Button>

              {/* Alarm Notifications */}
              <AlarmNotificationDropdown
                alarms={alarms}
                onAlarmClick={onAlarmClick}
                onResolveAlarm={onResolveAlarm}
                onResolveAll={onResolveAllAlarms}
              />

              {/* User Profile Menu */}
              <UserProfileMenu
                userName="Admin User"
                userRole="Security Operations"
                onPreferences={() => setShowPreferences(true)}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <UserPreferencesModal
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
        userName="Admin User"
        userRole="Security Operations"
      />
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  )
}

export default Header

