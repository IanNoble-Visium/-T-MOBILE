import { useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, useMap, Polyline, Tooltip } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NODE_TYPES } from '@/lib/networkDataset'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
})

/**
 * Helper function to get edge color based on alarm severity or utilization
 */
const getEdgeColor = (edge, isAlarmed, edgeAlarms) => {
  // Check if edge has alarms
  const edgeAlarm = edgeAlarms?.find(a => a.targetId === edge.id && !a.resolved)
  if (edgeAlarm) {
    // Color based on alarm severity
    switch (edgeAlarm.severity) {
      case 'critical':
        return '#E4002B' // Red
      case 'high':
        return '#FF6B35' // Orange
      case 'medium':
        return '#FFB81C' // Yellow
      case 'low':
        return '#0066CC' // Blue
      default:
        return '#00A651' // Green (normal)
    }
  }
  
  // Fallback to utilization-based color if no alarms
  const utilization = edge.utilization || 0
  if (utilization < 40) {
    return '#00A651' // Green - low utilization
  } else if (utilization < 70) {
    return '#FFB81C' // Yellow - medium utilization
  } else {
    return '#E4002B' // Red - high utilization
  }
}

/**
 * Helper function to get edge thickness based on bandwidth
 */
const getEdgeThickness = (edge) => {
  const bandwidth = edge.bandwidth || 10
  // Map bandwidth (10-100) to thickness (2-8)
  const minBandwidth = 10
  const maxBandwidth = 100
  const minThickness = 2
  const maxThickness = 8
  
  const thickness = minThickness + (bandwidth - minBandwidth) / (maxBandwidth - minBandwidth) * (maxThickness - minThickness)
  return Math.max(minThickness, Math.min(maxThickness, thickness))
}

/**
 * Helper function to get dash array based on latency
 */
const getDashArray = (edge) => {
  const latency = edge.latency || 0
  // High latency (>50ms) = dashed, low latency = solid
  if (latency > 50) {
    return '10, 5' // Dashed pattern
  }
  return null // Solid line
}

/**
 * Custom marker component for network nodes
 */
const NodeMarker = ({ node, isAlarmed, isSelected, onNodeClick, onNodeRightClick }) => {
  const typeInfo = NODE_TYPES[node.type]

  // Validate location data
  if (!node.location || typeof node.location.lat !== 'number' || typeof node.location.lon !== 'number') {
    console.warn('Invalid location data for node:', node.id, node.location);
    return null;
  }

  // Create custom icon
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background-color: ${isAlarmed ? '#E4002B' : typeInfo?.color || '#0066CC'};
        border: ${isSelected ? '3px solid #E20074' : isAlarmed ? '2px solid #E4002B' : '2px solid white'};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        animation: ${isAlarmed ? 'pulse 1s infinite' : 'none'};
      ">
        ${typeInfo?.icon || '📍'}
      </div>
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      </style>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  })

  return (
    <Marker
      position={[node.location.lat, node.location.lon]}
      icon={icon}
      eventHandlers={{
        click: (e) => {
          // Prevent default Leaflet popup from opening
          e.originalEvent.stopPropagation()
          onNodeClick?.(node)
        },
        contextmenu: (e) => {
          e.originalEvent.preventDefault()
          e.originalEvent.stopPropagation()
          onNodeRightClick?.(node)
        }
      }}
      // Disable default popup behavior - we use NetworkNodeDetail modal instead
    />
  )
}

/**
 * Map controller component to handle zoom/pan
 */
const MapController = ({ center, zoom }) => {
  const map = useMap()

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom)
    }
  }, [center, zoom, map])

  return null
}

/**
 * Edge Connection Component
 * Renders a polyline for a network edge/connection
 */
const EdgeConnection = ({ edge, sourceNode, targetNode, isAlarmed, isSelected, onEdgeClick, edgeAlarms }) => {
  if (!sourceNode?.location || !targetNode?.location) {
    return null
  }

  const positions = [
    [sourceNode.location.lat, sourceNode.location.lon],
    [targetNode.location.lat, targetNode.location.lon]
  ]

  const color = getEdgeColor(edge, isAlarmed, edgeAlarms)
  const weight = isAlarmed ? getEdgeThickness(edge) + 2 : getEdgeThickness(edge)
  const dashArray = getDashArray(edge)
  const opacity = isAlarmed ? 0.9 : 0.6

  return (
    <Polyline
      positions={positions}
      pathOptions={{
        color: isSelected ? '#E20074' : color,
        weight: isSelected ? weight + 1 : weight,
        opacity,
        dashArray
      }}
      eventHandlers={{
        click: (e) => {
          e.originalEvent.stopPropagation()
          onEdgeClick?.(edge)
        }
      }}
    >
      <Tooltip permanent={false} direction="center" className="edge-tooltip">
        <div className="text-xs">
          <p className="font-semibold">{edge.bandwidth || 'N/A'} Gbps</p>
          <p>Latency: {edge.latency || 'N/A'}ms</p>
          {edge.utilization !== undefined && (
            <p>Utilization: {edge.utilization}%</p>
          )}
        </div>
      </Tooltip>
    </Polyline>
  )
}

/**
 * GeographicMapVisualization Component
 * Renders an interactive Leaflet map with network nodes and edges
 */
const GeographicMapVisualization = ({
  nodes = [],
  edges = [],
  onNodeClick = null,
  onEdgeClick = null,
  onNodeRightClick = null,
  selectedNodeId = null,
  selectedEdgeId = null,
  alarmedNodeIds = [],
  alarmedEdgeIds = [],
  edgeAlarms = [],
  getNode = null,
  center = [39.8283, -98.5795], // Center of USA
  zoom = 4
}) => {
  // Calculate bounds to fit all nodes
  const calculateBounds = () => {
    if (nodes.length === 0) return null

    const lats = nodes.map(n => n.location.lat)
    const lons = nodes.map(n => n.location.lon)

    const minLat = Math.min(...lats)
    const maxLat = Math.max(...lats)
    const minLon = Math.min(...lons)
    const maxLon = Math.max(...lons)

    return [[minLat, minLon], [maxLat, maxLon]]
  }

  const bounds = calculateBounds()

  // Create node lookup map for efficient edge rendering
  const nodeMap = useMemo(() => {
    const map = new Map()
    nodes.forEach(node => {
      map.set(node.id, node)
    })
    return map
  }, [nodes])

  // Filter edges to only include those with valid source and target nodes
  const validEdges = useMemo(() => {
    return edges.filter(edge => {
      const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source
      const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target
      return nodeMap.has(sourceId) && nodeMap.has(targetId)
    })
  }, [edges, nodeMap])

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        bounds={bounds}
        boundsOptions={{ padding: [50, 50] }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MapController center={center} zoom={zoom} />

        {/* Render edge connections (below markers for proper z-index) */}
        {validEdges.map(edge => {
          const sourceId = typeof edge.source === 'object' ? edge.source.id : edge.source
          const targetId = typeof edge.target === 'object' ? edge.target.id : edge.target
          const sourceNode = nodeMap.get(sourceId)
          const targetNode = nodeMap.get(targetId)
          
          if (!sourceNode || !targetNode) return null

          return (
            <EdgeConnection
              key={edge.id}
              edge={edge}
              sourceNode={sourceNode}
              targetNode={targetNode}
              isAlarmed={alarmedEdgeIds.includes(edge.id)}
              isSelected={selectedEdgeId === edge.id}
              onEdgeClick={onEdgeClick}
              edgeAlarms={edgeAlarms.filter(a => a.targetId === edge.id)}
            />
          )
        })}

        {/* Render node markers */}
        {nodes.map(node => (
          <NodeMarker
            key={node.id}
            node={node}
            isAlarmed={alarmedNodeIds.includes(node.id)}
            isSelected={selectedNodeId === node.id}
            onNodeClick={onNodeClick}
            onNodeRightClick={onNodeRightClick}
          />
        ))}
      </MapContainer>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-white bg-black/60 p-2 rounded z-[1000]">
        <p>Scroll to zoom • Drag to pan • Click markers/edges for details • Right-click nodes to regenerate image</p>
      </div>
    </div>
  )
}

export default GeographicMapVisualization

