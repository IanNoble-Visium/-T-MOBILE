import { AlertCircle, CheckCircle, Trash2, Filter } from 'lucide-react'
import { getSeverityColor, getSeverityIcon, ALARM_SEVERITY } from '@/lib/alarmMapping'

/**
 * AlarmDashboard Component
 * Displays and manages network alarms
 */
const AlarmDashboard = ({
  alarms = [],
  onResolveAlarm = null,
  onRemoveAlarm = null,
  onResolveAll = null,
  onClearAll = null,
  filterSeverity = null,
  onFilterChange = null
}) => {
  const activeAlarms = alarms.filter(a => !a.resolved)
  const resolvedAlarms = alarms.filter(a => a.resolved)

  let displayAlarms = activeAlarms
  if (filterSeverity) {
    displayAlarms = displayAlarms.filter(a => a.severity === filterSeverity)
  }

  const stats = {
    total: alarms.length,
    active: activeAlarms.length,
    resolved: resolvedAlarms.length,
    critical: activeAlarms.filter(a => a.severity === ALARM_SEVERITY.CRITICAL).length,
    high: activeAlarms.filter(a => a.severity === ALARM_SEVERITY.HIGH).length,
    medium: activeAlarms.filter(a => a.severity === ALARM_SEVERITY.MEDIUM).length,
    low: activeAlarms.filter(a => a.severity === ALARM_SEVERITY.LOW).length
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="text-xl font-bold text-primary">{stats.active}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Critical</p>
          <p className="text-xl font-bold text-destructive">{stats.critical}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">High</p>
          <p className="text-xl font-bold text-orange-500">{stats.high}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-3">
          <p className="text-xs text-muted-foreground">Resolved</p>
          <p className="text-xl font-bold text-green-500">{stats.resolved}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <select
            value={filterSeverity || ''}
            onChange={(e) => onFilterChange?.(e.target.value || null)}
            className="px-3 py-1 bg-background border border-border rounded text-sm"
          >
            <option value="">All Severities</option>
            <option value={ALARM_SEVERITY.CRITICAL}>Critical</option>
            <option value={ALARM_SEVERITY.HIGH}>High</option>
            <option value={ALARM_SEVERITY.MEDIUM}>Medium</option>
            <option value={ALARM_SEVERITY.LOW}>Low</option>
          </select>
        </div>

        {onResolveAll && (
          <button
            onClick={onResolveAll}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
          >
            Resolve All
          </button>
        )}

        {onClearAll && (
          <button
            onClick={onClearAll}
            className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Alarms List */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto">
        {displayAlarms.length === 0 ? (
          <div className="bg-background rounded-lg p-6 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
            <p className="text-muted-foreground">No active alarms</p>
          </div>
        ) : (
          displayAlarms.map(alarm => (
            <div
              key={alarm.id}
              className="bg-background rounded-lg border-l-4 p-3 flex items-start justify-between gap-3"
              style={{ borderLeftColor: getSeverityColor(alarm.severity) }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{getSeverityIcon(alarm.severity)}</span>
                  <p className="font-semibold text-sm truncate">{alarm.type}</p>
                  <span className="text-xs px-2 py-0.5 bg-muted rounded capitalize">
                    {alarm.severity}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{alarm.description}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  {alarm.affectedNodeIds.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {alarm.affectedNodeIds.length} node{alarm.affectedNodeIds.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {alarm.affectedEdgeIds.length > 0 && (
                    <span className="px-2 py-0.5 bg-primary/10 text-primary rounded">
                      {alarm.affectedEdgeIds.length} link{alarm.affectedEdgeIds.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <span className="text-muted-foreground">
                    {new Date(alarm.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-1 flex-shrink-0">
                {onResolveAlarm && (
                  <button
                    onClick={() => onResolveAlarm(alarm.id)}
                    className="p-1 text-green-600 hover:bg-green-600/10 rounded transition-colors"
                    title="Resolve alarm"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                {onRemoveAlarm && (
                  <button
                    onClick={() => onRemoveAlarm(alarm.id)}
                    className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                    title="Remove alarm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolved Alarms Summary */}
      {resolvedAlarms.length > 0 && (
        <div className="bg-background rounded-lg p-3 text-sm text-muted-foreground">
          <p>{resolvedAlarms.length} resolved alarm{resolvedAlarms.length !== 1 ? 's' : ''}</p>
        </div>
      )}
    </div>
  )
}

export default AlarmDashboard

