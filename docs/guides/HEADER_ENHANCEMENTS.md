# Header Component Enhancements

## Overview

The T-Mobile TruContext Intelligence Platform header has been enhanced with interactive features to make the demo more production-ready and improve user experience across all dashboard screens.

## Features Implemented

### 1. **Functional Search Bar**

**Location:** Top-left of header (hidden on mobile, visible on desktop)

**Functionality:**
- Search across current dashboard content
- Real-time filtering as user types
- Clear button (✕) to reset search
- Integrated with global `SearchContext` for cross-dashboard consistency

**Usage:**
```javascript
import { useSearch } from '@/contexts/SearchContext'

function MyDashboard() {
  const { searchQuery, updateSearch, clearSearch } = useSearch()
  
  // Filter data based on searchQuery
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
}
```

### 2. **Alarm Notification Dropdown**

**Location:** Bell icon in header (right side)

**Features:**
- **Visual Indicator:** Red pulsing dot when alarms are active
- **Dropdown Display:** Shows all active alarms with:
  - Severity level (Critical, High, Medium, Low)
  - Alarm type and description
  - Affected nodes and edges count
  - Timestamp
  - Color-coded severity indicator (left border)
- **Interactive Actions:**
  - Click alarm to navigate to relevant dashboard
  - Resolve individual alarms
  - Resolve all alarms at once
- **Integration:** Connected to `useAlarmSystem` hook

**Component:** `AlarmNotificationDropdown.jsx`

**Props:**
```javascript
<AlarmNotificationDropdown
  alarms={alarms}                    // Array of alarm objects
  onAlarmClick={handleAlarmClick}    // Navigate to affected element
  onResolveAlarm={resolveAlarm}      // Resolve single alarm
  onResolveAll={resolveAllAlarms}    // Resolve all alarms
/>
```

### 3. **User Profile Menu**

**Location:** User avatar and name (right side of header)

**Features:**
- **Profile Display:** Shows user name and role
- **Dropdown Menu:**
  - User Preferences (opens modal)
  - Logout (clears session and localStorage)
- **Avatar:** T-Mobile magenta gradient circle with user icon

**Component:** `UserProfileMenu.jsx`

**Props:**
```javascript
<UserProfileMenu
  userName="Admin User"
  userRole="Security Operations"
  onPreferences={handlePreferences}
  onLogout={handleLogout}
/>
```

### 4. **User Preferences Modal**

**Triggered by:** User Profile Menu → "User Preferences"

**Settings:**
- **Theme Selection:** Light/Dark mode toggle
- **Notifications:** Enable/disable notifications
- **Sound Alerts:** Enable/disable sound alerts (requires notifications enabled)
- **Default Dashboard:** Select which dashboard loads on login

**Persistence:** Settings saved to `localStorage` under `userPreferences` key

**Component:** `UserPreferencesModal.jsx`

**Data Structure:**
```javascript
{
  theme: 'dark' | 'light',
  notifications: boolean,
  soundAlerts: boolean,
  defaultDashboard: string
}
```

### 5. **Settings Panel**

**Triggered by:** Gear icon in header (right side)

**Features:**
- **Data Source Configuration:**
  - Neo4j (Live) - connects to Neo4j Aura
  - Mock Data (Demo) - uses generated mock data
  - Real-time connection status indicator
- **Auto-Refresh Settings:**
  - Toggle auto-refresh on/off
  - Configurable refresh interval (10-300 seconds)
- **Dashboard Layout:**
  - Default, Compact, or Wide layout options
- **Export Settings:** Download current settings as JSON

**Persistence:** Settings saved to `localStorage` under `appSettings` key

**Component:** `SettingsPanel.jsx`

**Data Structure:**
```javascript
{
  dataSource: 'neo4j' | 'mock',
  autoRefresh: boolean,
  refreshInterval: number,
  layoutMode: 'default' | 'compact' | 'wide'
}
```

## Architecture

### SearchContext

**File:** `src/contexts/SearchContext.jsx`

Provides global search state management across all dashboards:

```javascript
const {
  searchQuery,        // Current search input
  searchResults,      // Filtered results
  isSearching,        // Loading state
  updateSearch,       // Update search query
  clearSearch,        // Clear search
  setResults,         // Set results (called by dashboards)
  setSearchingState    // Set searching state
} = useSearch()
```

### Integration with App.jsx

The `SearchProvider` wraps the entire application:

```javascript
<Router>
  {isAuthenticated && !isLoading ? (
    <SearchProvider>
      <AppContent />
    </SearchProvider>
  ) : (
    // Login routes
  )}
</Router>
```

### Alarm System Integration

The Header receives alarm data from `useAlarmSystem` hook:

```javascript
const { alarms, resolveAlarm, resolveAllAlarms } = useAlarmSystem(dataset)

<Header
  alarms={alarms}
  onAlarmClick={handleAlarmClick}
  onResolveAlarm={resolveAlarm}
  onResolveAllAlarms={resolveAllAlarms}
  onLogout={handleLogout}
/>
```

## File Structure

```
src/
├── components/
│   ├── Header.jsx                      # Main header component
│   ├── AlarmNotificationDropdown.jsx   # Alarm notifications
│   ├── UserProfileMenu.jsx             # User profile dropdown
│   ├── UserPreferencesModal.jsx        # User preferences modal
│   └── SettingsPanel.jsx               # Settings configuration
├── contexts/
│   └── SearchContext.jsx               # Global search context
└── App.jsx                             # Updated with SearchProvider
```

## Usage Examples

### Implementing Search in a Dashboard

```javascript
import { useSearch } from '@/contexts/SearchContext'

function MyDashboard() {
  const { searchQuery, setResults } = useSearch()
  const [data, setData] = useState([])

  useEffect(() => {
    if (searchQuery) {
      const filtered = data.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filtered)
    } else {
      setResults([])
    }
  }, [searchQuery, data, setResults])

  return (
    <div>
      {/* Display filtered data */}
    </div>
  )
}
```

### Handling Alarm Navigation

When a user clicks an alarm in the notification dropdown, the app navigates to the relevant dashboard:

```javascript
const handleAlarmClick = (alarm) => {
  if (alarm.affectedNodeIds?.length > 0) {
    navigate('/network-topology')
  } else if (alarm.affectedEdgeIds?.length > 0) {
    navigate('/network-topology')
  } else {
    navigate('/dashboard')
  }
}
```

## Styling

All components use:
- **shadcn/ui components** for consistency
- **Tailwind CSS** for styling
- **T-Mobile branding colors:**
  - Primary: `#E20074` (Magenta)
  - Secondary: `#0066CC` (Blue)
  - Success: `#00A651` (Green)
  - Warning: `#FFB81C` (Yellow)
  - Danger: `#E4002B` (Red)

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (responsive design)

## Performance Considerations

- Search is debounced to prevent excessive re-renders
- Alarm dropdown uses virtualization for large alarm lists
- Settings are cached in localStorage for instant access
- Modal animations use CSS transitions for smooth performance

## Future Enhancements

- [ ] Advanced search filters (by severity, type, date range)
- [ ] Alarm sound notifications
- [ ] Custom alarm rules and thresholds
- [ ] Multi-user support with role-based access
- [ ] Dark mode theme implementation
- [ ] Keyboard shortcuts for common actions
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)

