import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Shield, 
  ShieldAlert, 
  Network, 
  Cpu, 
  ShieldCheck,
  GitBranch,
  Target,
  Brain,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation()
  
  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Executive Dashboard' },
    { path: '/ai-analytics', icon: Brain, label: 'AI Analytics' },
    { path: '/sase', icon: Shield, label: 'SASE Platform' },
    { path: '/cyber-defense', icon: ShieldAlert, label: 'Cyber Defense Center' },
    { path: '/t-platform', icon: Network, label: 'T-Platform' },
    { path: '/iot', icon: Cpu, label: 'IoT Security Hub' },
    { path: '/threat-protect', icon: ShieldCheck, label: 'Threat Protect' },
    { path: '/graph-analytics', icon: GitBranch, label: 'Graph Analytics' },
    { path: '/threat-intelligence', icon: Target, label: 'Threat Intelligence' }
  ]
  
  return (
    <div 
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col ${
        isOpen ? 'w-64' : 'w-16'
      }`}
    >
      {/* Logo and Brand */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex-1 animate-fade-in">
              <h1 className="text-lg font-bold gradient-tmobile bg-clip-text text-transparent">
                T-Mobile
              </h1>
              <p className="text-xs text-muted-foreground">TruContext Intelligence</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-1 rounded-md hover:bg-sidebar-accent transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'animate-pulse-glow' : ''}`} />
                  {isOpen && (
                    <span className="text-sm font-medium animate-fade-in">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        {isOpen ? (
          <div className="text-xs text-muted-foreground animate-fade-in">
            <p className="font-semibold">Powered by</p>
            <p className="gradient-trucontext bg-clip-text text-transparent font-bold">
              Visium TruContext™
            </p>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full gradient-cyber flex items-center justify-center text-xs font-bold">
              TC
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
