import { Bell, Search, Menu, User } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Header = ({ onMenuClick }) => {
  const currentTime = new Date().toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
  
  return (
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
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search threats, devices, incidents..."
              className="pl-10 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring w-80"
            />
          </div>
        </div>
        
        {/* Right side */}
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {currentTime}
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-glow"></span>
            </Button>
            
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full gradient-tmobile flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">Security Operations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header

