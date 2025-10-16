import { X, AlertCircle, MapPin, Zap, Activity } from 'lucide-react'
import { NODE_TYPES } from '@/lib/networkDataset'

/**
 * NetworkNodeDetail Component
 * Displays detailed information about a selected network node or edge
 */
const NetworkNodeDetail = ({ item, itemType = 'node', onClose, alarms = [] }) => {
  if (!item) return null

  const isNode = itemType === 'node'
  const typeInfo = isNode ? NODE_TYPES[item.type] : null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isNode && typeInfo && (
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: typeInfo.color }}
                />
              )}
              <h2 className="text-lg font-bold">{item.name}</h2>
            </div>
            <p className="text-xs text-muted-foreground">
              {isNode ? `Type: ${typeInfo?.label}` : `Connection: ${item.type}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Status */}
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.status === 'operational' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="text-sm capitalize">{item.status || 'Unknown'}</span>
            </div>
          </div>

          {/* Location (for nodes) */}
          {isNode && item.location && (
            <div className="bg-background rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">Location</span>
              </div>
              <div className="text-sm space-y-1">
                <p>
                  <span className="text-muted-foreground">City:</span> {item.location.city}
                </p>
                <p>
                  <span className="text-muted-foreground">Coordinates:</span>{' '}
                  {item.location.lat.toFixed(4)}, {item.location.lon.toFixed(4)}
                </p>
                {item.region && (
                  <p>
                    <span className="text-muted-foreground">Region:</span> {item.region}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Capacity/Bandwidth */}
          {(item.capacity || item.bandwidth) && (
            <div className="bg-background rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold">
                  {isNode ? 'Capacity' : 'Bandwidth'}
                </span>
              </div>
              <p className="text-sm">
                {isNode
                  ? `${item.capacity?.toLocaleString()} units`
                  : `${item.bandwidth} Gbps`}
              </p>
            </div>
          )}

          {/* Utilization (for edges) */}
          {!isNode && item.utilization !== undefined && (
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm text-muted-foreground mb-2">Utilization</p>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${item.utilization}%` }}
                />
              </div>
              <p className="text-xs mt-1">{item.utilization}%</p>
            </div>
          )}

          {/* Latency (for edges) */}
          {!isNode && item.latency !== undefined && (
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Latency</p>
              <p className="text-sm font-semibold">{item.latency}ms</p>
            </div>
          )}

          {/* Vendor/Model (for nodes) */}
          {isNode && (item.vendor || item.model) && (
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm font-semibold mb-2">Equipment</p>
              <div className="text-sm space-y-1">
                {item.vendor && (
                  <p>
                    <span className="text-muted-foreground">Vendor:</span> {item.vendor}
                  </p>
                )}
                {item.model && (
                  <p>
                    <span className="text-muted-foreground">Model:</span> {item.model}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Additional Properties */}
          {isNode && item.uptime && (
            <div className="bg-background rounded-lg p-3">
              <p className="text-sm text-muted-foreground">Uptime</p>
              <p className="text-sm font-semibold">{item.uptime.toFixed(2)}%</p>
            </div>
          )}

          {/* Alarms */}
          {alarms && alarms.length > 0 && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <span className="text-sm font-semibold text-destructive">
                  Active Alarms ({alarms.length})
                </span>
              </div>
              <div className="space-y-2">
                {alarms.map((alarm, idx) => (
                  <div key={idx} className="text-xs bg-background rounded p-2">
                    <p className="font-semibold">{alarm.type}</p>
                    <p className="text-muted-foreground">{alarm.description}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      Severity: <span className="capitalize">{alarm.severity}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ID */}
          <div className="bg-background rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Element ID</p>
            <p className="text-xs font-mono break-all">{item.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NetworkNodeDetail

