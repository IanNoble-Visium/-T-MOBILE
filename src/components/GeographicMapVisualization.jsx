import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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
 * Custom marker component for network nodes
 */
const NodeMarker = ({ node, isAlarmed, isSelected, onNodeClick }) => {
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
        click: () => onNodeClick?.(node)
      }}
    >
      <Popup>
        <div className="text-sm">
          <p className="font-bold">{node.name}</p>
          <p className="text-xs text-gray-600">{typeInfo?.label}</p>
          <p className="text-xs text-gray-600">{node.location.city || 'Unknown'}</p>
          <p className="text-xs text-gray-600">
            {(node.location.lat || 0).toFixed(4)}, {(node.location.lon || 0).toFixed(4)}
          </p>
          {isAlarmed && (
            <p className="text-xs text-red-600 font-semibold mt-1">⚠️ Active Alarms</p>
          )}
        </div>
      </Popup>
    </Marker>
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
 * GeographicMapVisualization Component
 * Renders an interactive Leaflet map with network nodes
 */
const GeographicMapVisualization = ({
  nodes = [],
  onNodeClick = null,
  selectedNodeId = null,
  alarmedNodeIds = [],
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

        {/* Render node markers */}
        {nodes.map(node => (
          <NodeMarker
            key={node.id}
            node={node}
            isAlarmed={alarmedNodeIds.includes(node.id)}
            isSelected={selectedNodeId === node.id}
            onNodeClick={onNodeClick}
          />
        ))}
      </MapContainer>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 text-xs text-white bg-black/60 p-2 rounded z-10">
        <p>Scroll to zoom • Drag to pan • Click markers for details</p>
      </div>
    </div>
  )
}

export default GeographicMapVisualization

