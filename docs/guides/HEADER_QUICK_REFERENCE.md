# Header Features - Quick Reference Guide

## 🔍 Search Bar

**Location:** Top-left of header (desktop only)

**How to use:**
1. Click on search bar
2. Type your search term
3. Results filter in real-time
4. Click ✕ to clear search

**Keyboard shortcuts:**
- `Ctrl+K` or `Cmd+K` - Focus search (future enhancement)
- `Escape` - Clear search

**For developers:**
```javascript
import { useSearch } from '@/contexts/SearchContext'
const { searchQuery, updateSearch, clearSearch } = useSearch()
```

---

## 🔔 Alarm Notifications

**Location:** Bell icon (right side of header)

**Visual indicators:**
- 🔴 Red pulsing dot = Active alarms
- No dot = No active alarms

**How to use:**
1. Click bell icon to open dropdown
2. View all active alarms
3. Click alarm to navigate to affected element
4. Click ✓ to resolve individual alarm
5. Click "Resolve All Alarms" to clear all

**Alarm severity colors:**
- 🔴 Critical (Red) - `#E4002B`
- 🟠 High (Orange) - `#FF6B35`
- 🟡 Medium (Yellow) - `#FFB81C`
- 🔵 Low (Blue) - `#0066CC`

**Alarm information shown:**
- Type (e.g., "Threat Blocked")
- Description
- Affected nodes and edges
- Timestamp
- Severity level

---

## 👤 User Profile Menu

**Location:** User avatar + name (right side of header)

**How to use:**
1. Click on user profile area
2. Select from menu:
   - **User Preferences** - Open settings modal
   - **Logout** - Exit application

**Profile info displayed:**
- User name: "Admin User"
- Role: "Security Operations"
- Avatar: T-Mobile magenta gradient circle

---

## ⚙️ User Preferences

**Triggered by:** User Profile Menu → "User Preferences"

**Settings available:**

### Theme
- Light mode
- Dark mode

### Notifications
- Enable/disable notifications
- Enable/disable sound alerts (requires notifications enabled)

### Default Dashboard
- Executive Dashboard
- AI Analytics
- Network Topology
- Geographic Map
- Cyber Defense Center

**How to save:**
1. Make changes
2. Click "Save Preferences"
3. Settings saved to localStorage

**How to cancel:**
1. Click "Cancel" button
2. Changes discarded

---

## ⚙️ Settings Panel

**Triggered by:** Gear icon (right side of header)

**Settings available:**

### Data Source
- **Neo4j (Live)** - Connect to Neo4j Aura database
- **Mock Data (Demo)** - Use generated demo data
- Connection status indicator (Connected/Disconnected)

### Auto-Refresh
- Toggle auto-refresh on/off
- Set refresh interval (10-300 seconds)
- Default: 30 seconds

### Dashboard Layout
- Default Layout
- Compact Layout
- Wide Layout

### Export Settings
- Click "Export" button
- Downloads JSON file with current settings
- Filename: `tmobile-settings-[timestamp].json`

**How to save:**
1. Make changes
2. Click "Save Settings"
3. Settings saved to localStorage

**How to cancel:**
1. Click "Cancel" button
2. Changes discarded

---

## 🚪 Logout

**Location:** User Profile Menu → "Logout"

**What happens:**
1. Session cleared
2. localStorage cleaned:
   - `authToken` removed
   - `userPreferences` removed
   - `appSettings` removed
3. Redirected to login page

---

## 📱 Responsive Behavior

### Desktop (1920x1080+)
- ✅ Search bar visible
- ✅ All icons visible
- ✅ Time display visible
- ✅ User name and role visible

### Tablet (768x1024)
- ✅ Search bar visible
- ✅ All icons visible
- ⚠️ User name/role may be hidden
- ✅ Time display visible

### Mobile (375x667)
- ❌ Search bar hidden
- ✅ Menu icon visible
- ✅ All icons visible
- ❌ Time display hidden
- ❌ User name/role hidden

---

## 💾 LocalStorage Keys

### User Preferences
```javascript
localStorage.getItem('userPreferences')
// Returns:
{
  theme: 'dark' | 'light',
  notifications: boolean,
  soundAlerts: boolean,
  defaultDashboard: string
}
```

### App Settings
```javascript
localStorage.getItem('appSettings')
// Returns:
{
  dataSource: 'neo4j' | 'mock',
  autoRefresh: boolean,
  refreshInterval: number,
  layoutMode: 'default' | 'compact' | 'wide'
}
```

### Auth Token
```javascript
localStorage.getItem('authToken')
// Returns: JWT token string
```

---

## 🎨 Component Files

| Component | File | Purpose |
|-----------|------|---------|
| Header | `src/components/Header.jsx` | Main header component |
| Alarms | `src/components/AlarmNotificationDropdown.jsx` | Alarm notifications |
| User Menu | `src/components/UserProfileMenu.jsx` | User profile dropdown |
| Preferences | `src/components/UserPreferencesModal.jsx` | User settings modal |
| Settings | `src/components/SettingsPanel.jsx` | App settings panel |
| Search Context | `src/contexts/SearchContext.jsx` | Global search state |

---

## 🔗 Integration Points

### For Dashboard Developers

**Add search to your dashboard:**
```javascript
import { useSearch } from '@/contexts/SearchContext'

function MyDashboard() {
  const { searchQuery, setResults } = useSearch()
  
  // Filter data based on searchQuery
  // Call setResults() with filtered data
}
```

**Access user preferences:**
```javascript
const prefs = JSON.parse(localStorage.getItem('userPreferences'))
console.log(prefs.theme) // 'dark' or 'light'
```

**Access app settings:**
```javascript
const settings = JSON.parse(localStorage.getItem('appSettings'))
console.log(settings.dataSource) // 'neo4j' or 'mock'
```

---

## 🐛 Troubleshooting

### Search not working?
- [ ] Check SearchProvider wraps App
- [ ] Verify useSearch hook imported
- [ ] Check console for errors
- [ ] Verify setResults() called

### Alarms not showing?
- [ ] Check useAlarmSystem hook initialized
- [ ] Verify alarms passed to Header
- [ ] Check console for errors
- [ ] Verify alarm data structure

### Settings not saving?
- [ ] Check localStorage is enabled
- [ ] Verify JSON is valid
- [ ] Check browser console for errors
- [ ] Try clearing localStorage and retry

### Logout not working?
- [ ] Check onLogout callback passed to Header
- [ ] Verify navigate('/login') works
- [ ] Check localStorage is cleared
- [ ] Check console for errors

---

## 📚 Documentation

- **Detailed Guide:** `docs/guides/HEADER_ENHANCEMENTS.md`
- **Search Implementation:** `docs/guides/IMPLEMENTING_SEARCH_IN_DASHBOARDS.md`
- **Testing Guide:** `docs/guides/TESTING_HEADER_FEATURES.md`
- **Implementation Summary:** `HEADER_ENHANCEMENTS_SUMMARY.md`

---

## 🎯 Common Tasks

### Change theme
1. Click user profile
2. Click "User Preferences"
3. Select Light or Dark
4. Click "Save Preferences"

### Resolve an alarm
1. Click bell icon
2. Click ✓ on alarm
3. Alarm removed from list

### Switch to mock data
1. Click gear icon
2. Select "Mock Data (Demo)"
3. Click "Save Settings"

### Export settings
1. Click gear icon
2. Click "Export" button
3. JSON file downloads

### Clear all alarms
1. Click bell icon
2. Click "Resolve All Alarms"
3. All alarms cleared

---

**Last Updated:** October 17, 2025
**Version:** 1.0

