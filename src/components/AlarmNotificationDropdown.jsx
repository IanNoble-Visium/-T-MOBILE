import { useState } from 'react'
import { Bell, AlertCircle, CheckCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getSeverityColor, getSeverityIcon } from '@/lib/alarmMapping'

/**
 * AlarmNotificationDropdown - Shows active alarms in a dropdown
 * Displays alarm details and allows navigation to affected elements
 */
const AlarmNotificationDropdown = ({ alarms = [], onAlarmClick, onResolveAlarm, onResolveAll }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Filter active alarms
  const activeAlarms = alarms.filter(alarm => !alarm.resolved)
  const hasAlarms = activeAlarms.length > 0

  const handleAlarmClick = (alarm) => {
    if (onAlarmClick) {
      onAlarmClick(alarm)
    }
  }

  const handleResolve = (e, alarmId) => {
    e.stopPropagation()
    if (onResolveAlarm) {
      onResolveAlarm(alarmId)
    }
  }

  const handleResolveAll = () => {
    if (onResolveAll) {
      onResolveAll()
    }
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {hasAlarms && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-glow"></span>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold">
                Active Alarms ({activeAlarms.length})
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-accent rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Alarms List */}
          <div className="flex-1 overflow-y-auto">
            {activeAlarms.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No active alarms</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {activeAlarms.map((alarm) => (
                  <div
                    key={alarm.id}
                    onClick={() => handleAlarmClick(alarm)}
                    className="p-3 hover:bg-accent/50 cursor-pointer transition-colors border-l-4"
                    style={{ borderLeftColor: getSeverityColor(alarm.severity) }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getSeverityIcon(alarm.severity)}</span>
                          <p className="font-medium text-sm truncate">{alarm.type}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground capitalize">
                            {alarm.severity}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {alarm.description}
                        </p>
                        <div className="text-xs text-muted-foreground">
                          <p>
                            Affected: {alarm.affectedNodeIds?.length || 0} node(s), {alarm.affectedEdgeIds?.length || 0} edge(s)
                          </p>
                          <p>
                            {new Date(alarm.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleResolve(e, alarm.id)}
                        className="p-1 hover:bg-background rounded-md transition-colors flex-shrink-0"
                        title="Resolve alarm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {activeAlarms.length > 0 && (
            <div className="p-3 border-t border-border bg-background/50">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleResolveAll}
              >
                Resolve All Alarms
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default AlarmNotificationDropdown

