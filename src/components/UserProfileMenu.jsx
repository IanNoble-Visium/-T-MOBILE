import { useState } from 'react'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

/**
 * UserProfileMenu - User profile dropdown menu
 * Includes profile info, preferences, and logout
 */
const UserProfileMenu = ({
  userName = 'Admin User',
  userRole = 'Security Operations',
  onPreferences,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    setIsOpen(false)
    if (onLogout) {
      onLogout()
    }
  }

  const handlePreferences = () => {
    setIsOpen(false)
    if (onPreferences) {
      onPreferences()
    }
  }

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 pl-2 border-l border-border hover:bg-accent/50 rounded-md px-2 py-1 transition-colors"
      >
        <div className="w-8 h-8 rounded-full gradient-tmobile flex items-center justify-center flex-shrink-0">
          <User className="w-5 h-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium">{userName}</p>
          <p className="text-xs text-muted-foreground">{userRole}</p>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg z-50">
          {/* Profile Info */}
          <div className="p-4 border-b border-border">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handlePreferences}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-accent transition-colors"
            >
              <Settings className="w-4 h-4" />
              User Preferences
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Backdrop to close menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default UserProfileMenu

