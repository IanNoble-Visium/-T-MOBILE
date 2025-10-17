# Network Topology & Geographic Mapping Implementation Plan

## Executive Summary
Enhance the T-Mobile demo with network topology visualization and geographic mapping capabilities, integrating with existing alarms and AI analytics.

## 1. JSON Schema Design

### Network Dataset Structure
```json
{
  "metadata": {
    "version": "1.0",
    "created_at": "2025-10-16T00:00:00Z",
    "last_updated": "2025-10-16T00:00:00Z",
    "description": "T-Mobile Network Infrastructure"
  },
  "nodes": [
    {
      "id": "node-001",
      "name": "NYC Data Center",
      "type": "data_center",
      "location": { "lat": 40.7128, "lon": -74.0060, "city": "New York" },
      "status": "operational",
      "capacity": 10000,
      "vendor": "Cisco",
      "model": "ASR 9000",
      "region": "Northeast",
      "alarmIds": []
    }
  ],
  "edges": [
    {
      "id": "edge-001",
      "source": "node-001",
      "target": "node-002",
      "type": "fiber",
      "bandwidth": 100,
      "status": "active",
      "latency": 5,
      "alarmIds": []
    }
  ]
}
```

### Node Types
- `data_center`: Regional data centers
- `cell_tower`: Cell tower infrastructure
- `router`: Network routers
- `switch`: Network switches
- `gateway`: Network gateways
- `firewall`: Security firewalls

### Edge Types
- `fiber`: Fiber optic connections
- `microwave`: Microwave links
- `ethernet`: Ethernet connections
- `wireless`: Wireless links

## 2. Implementation Phases

### Phase 2: Network Dataset & Mock Data
**Deliverables:**
- Generate 25 network nodes across 8 US cities
- Create 40 network edges with realistic connections
- Implement dataset upload/download functionality
- Add JSON schema validation
- Store dataset in localStorage for persistence

**Files to Create:**
- `src/lib/networkDataset.js` - Dataset generator and utilities
- `src/components/DatasetManager.jsx` - Upload/download UI component

### Phase 3: Network Topology Dashboard
**Deliverables:**
- Interactive graph visualization using D3.js or React Flow
- Visual alarm indicators (flashing/color-coded nodes)
- Node/edge click handlers showing details
- Real-time alarm state updates
- Zoom and pan controls

**Files to Create:**
- `src/components/dashboards/NetworkTopologyDashboard.jsx`
- `src/components/NetworkTopologyVisualization.jsx`
- `src/components/NetworkNodeDetail.jsx`

### Phase 4: Geographic Map Dashboard
**Deliverables:**
- Interactive map using Leaflet or Mapbox
- Network elements positioned by lat/long
- Alarm state color coding on map
- Hover tooltips with element details
- Zoom to location functionality

**Files to Create:**
- `src/components/dashboards/GeographicMapDashboard.jsx`
- `src/components/GeographicMapVisualization.jsx`

### Phase 5: Alarm Integration
**Deliverables:**
- Map all existing alarms to network nodes/edges
- Bidirectional alarm-element binding
- Alarm state synchronization across dashboards
- Click element → show related alarms
- Click alarm → highlight element

**Alarm Sources to Map:**
- SASE Dashboard: Threat blocking events
- Cyber Defense Center: Incidents and alerts
- IoT Dashboard: Device alerts
- Threat Protect: Threat events
- Executive Dashboard: Event stream

### Phase 6: AI Integration
**Deliverables:**
- Expose network dataset to AI context
- Enable AI queries about topology
- Support geographic queries
- Provide alarm correlation insights

## 3. Technology Stack

### New Dependencies
- `react-flow-renderer` or `d3` for topology visualization
- `leaflet` or `mapbox-gl` for geographic mapping
- `zustand` for state management (optional)

### Existing Dependencies to Leverage
- Recharts for charts
- Framer Motion for animations
- Lucide React for icons

## 4. Data Flow Architecture

```
Network Dataset (JSON)
    ↓
localStorage (persistence)
    ↓
├─→ Topology Dashboard (D3/React Flow)
├─→ Geographic Map Dashboard (Leaflet/Mapbox)
├─→ Alarm Synchronization System
└─→ AI Context Provider
```

## 5. Alarm Mapping Strategy

### Alarm-to-Node Binding
- Each alarm has `affectedNodeIds: []`
- Each node has `alarmIds: []`
- Bidirectional relationship maintained

### Alarm States
- `critical`: Red, fast pulse
- `high`: Orange, medium pulse
- `medium`: Yellow, slow pulse
- `low`: Blue, no pulse

## 6. Success Criteria

✅ Network dataset with 25+ nodes and 40+ edges
✅ Interactive topology visualization with alarm indicators
✅ Geographic map showing all network elements
✅ All existing alarms mapped to network elements
✅ Bidirectional alarm-element interaction
✅ AI can query network topology and alarms
✅ Dataset upload/download functionality
✅ Real-time alarm synchronization
✅ Responsive design on all screen sizes
✅ Performance: <2s load time, 60fps animations

## 7. File Structure

```
src/
├── components/
│   ├── dashboards/
│   │   ├── NetworkTopologyDashboard.jsx (NEW)
│   │   └── GeographicMapDashboard.jsx (NEW)
│   ├── NetworkTopologyVisualization.jsx (NEW)
│   ├── GeographicMapVisualization.jsx (NEW)
│   ├── NetworkNodeDetail.jsx (NEW)
│   └── DatasetManager.jsx (NEW)
├── lib/
│   ├── networkDataset.js (NEW)
│   └── alarmMapping.js (NEW)
└── hooks/
    └── useNetworkDataset.js (NEW)
```

## 8. Neo4j Integration (Future)

Store network topology in Neo4j for:
- Persistent storage
- Advanced graph queries
- Real-time synchronization
- Multi-user collaboration

Credentials provided in requirements.

