# Header Features - Visual Guide

## Header Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  ☰  🔍 Search threats, devices, incidents...        Fri, Oct 17, 2025  ⚙️ 🔔 👤 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Components (Left to Right)

1. **☰ Menu Icon** - Toggle sidebar (mobile only)
2. **🔍 Search Bar** - Real-time search (desktop only)
3. **Time Display** - Current date and time (desktop only)
4. **⚙️ Settings** - Configuration panel
5. **🔔 Bell Icon** - Alarm notifications (with red dot when active)
6. **👤 User Profile** - User menu and preferences

---

## 1. Search Bar

### Inactive State
```
┌─────────────────────────────────────────┐
│ 🔍 Search threats, devices, incidents... │
└─────────────────────────────────────────┘
```

### Active State (with text)
```
┌─────────────────────────────────────────┐
│ 🔍 threat                            ✕  │
└─────────────────────────────────────────┘
```

**Features:**
- Type to search
- Click ✕ to clear
- Real-time filtering
- Cross-dashboard support

---

## 2. Alarm Notification Dropdown

### Bell Icon (No Alarms)
```
┌─────┐
│ 🔔  │
└─────┘
```

### Bell Icon (With Alarms)
```
┌─────┐
│ 🔔● │  ← Red pulsing dot
└─────┘
```

### Dropdown Menu
```
┌──────────────────────────────────────┐
│ 🚨 Active Alarms (3)            ✕   │
├──────────────────────────────────────┤
│ 🔴 Threat Blocked        [CRITICAL] │
│ Malware detected on node-001         │
│ Affected: 1 node, 0 edges           │
│ 14:32:15                        ✓   │
├──────────────────────────────────────┤
│ 🟠 High Latency          [HIGH]     │
│ Network degradation detected         │
│ Affected: 0 nodes, 2 edges          │
│ 14:28:42                        ✓   │
├──────────────────────────────────────┤
│ 🟡 Policy Violation      [MEDIUM]   │
│ Unauthorized access attempt          │
│ Affected: 1 node, 1 edge            │
│ 14:15:30                        ✓   │
├──────────────────────────────────────┤
│ [Resolve All Alarms]                │
└──────────────────────────────────────┘
```

**Severity Colors:**
- 🔴 Critical (Red) - `#E4002B`
- 🟠 High (Orange) - `#FF6B35`
- 🟡 Medium (Yellow) - `#FFB81C`
- 🔵 Low (Blue) - `#0066CC`

---

## 3. User Profile Menu

### Closed State
```
┌──────────────────────────────┐
│ [●] Admin User               │
│     Security Operations  ▼   │
└──────────────────────────────┘
```

### Open State
```
┌──────────────────────────────┐
│ [●] Admin User               │
│     Security Operations  ▲   │
├──────────────────────────────┤
│ Admin User                   │
│ Security Operations          │
├──────────────────────────────┤
│ ⚙️  User Preferences         │
│ 🚪 Logout                    │
└──────────────────────────────┘
```

---

## 4. User Preferences Modal

```
┌─────────────────────────────────────────┐
│ User Preferences                    ✕   │
├─────────────────────────────────────────┤
│                                         │
│ Logged in as                            │
│ Admin User                              │
│ Security Operations                     │
│                                         │
│ Theme                                   │
│ [☀️ Light] [🌙 Dark]                   │
│                                         │
│ Notifications                           │
│ ☑ Enable notifications                 │
│ ☑ Sound alerts                         │
│                                         │
│ Default Dashboard                       │
│ [Executive Dashboard ▼]                │
│                                         │
├─────────────────────────────────────────┤
│ [Cancel]              [Save Preferences]│
└─────────────────────────────────────────┘
```

---

## 5. Settings Panel

```
┌─────────────────────────────────────────┐
│ ⚙️  Settings                        ✕   │
├─────────────────────────────────────────┤
│                                         │
│ Data Source                             │
│ ◉ Neo4j (Live)                         │
│ ○ Mock Data (Demo)                     │
│                                         │
│ Neo4j Status:                           │
│ ● Connected                             │
│                                         │
│ Auto-refresh data                       │
│ ☑ Enabled                              │
│ Refresh interval: [30] seconds          │
│                                         │
│ Dashboard Layout                        │
│ [Default Layout ▼]                     │
│                                         │
├─────────────────────────────────────────┤
│ [⬇️ Export] [Cancel] [Save Settings]   │
└─────────────────────────────────────────┘
```

---

## Responsive Behavior

### Desktop (1920x1080)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ☰  🔍 Search...                    Fri, Oct 17, 2025  ⚙️ 🔔 👤 Admin User  │
└─────────────────────────────────────────────────────────────────────────────┘
```
✅ All elements visible

### Tablet (768x1024)
```
┌──────────────────────────────────────────────────────────────┐
│ ☰  🔍 Search...                    ⚙️ 🔔 👤 Admin User      │
└──────────────────────────────────────────────────────────────┘
```
✅ Search visible, time hidden

### Mobile (375x667)
```
┌──────────────────────────────────────┐
│ ☰  🔍                    ⚙️ 🔔 👤   │
└──────────────────────────────────────┘
```
❌ Search hidden, icons only

---

## User Workflows

### Workflow 1: Search for Threats
```
1. User types "threat" in search bar
   ↓
2. Dashboard filters to show threats
   ↓
3. User clicks ✕ to clear search
   ↓
4. Dashboard shows all items again
```

### Workflow 2: Resolve an Alarm
```
1. User sees red dot on bell icon
   ↓
2. User clicks bell icon
   ↓
3. Dropdown shows active alarms
   ↓
4. User clicks ✓ on alarm
   ↓
5. Alarm removed from list
   ↓
6. Red dot disappears when no alarms left
```

### Workflow 3: Change Theme
```
1. User clicks profile menu
   ↓
2. User clicks "User Preferences"
   ↓
3. Modal opens
   ↓
4. User clicks "Dark" button
   ↓
5. User clicks "Save Preferences"
   ↓
6. Modal closes, theme saved
```

### Workflow 4: Switch Data Source
```
1. User clicks gear icon
   ↓
2. Settings panel opens
   ↓
3. User selects "Mock Data (Demo)"
   ↓
4. User clicks "Save Settings"
   ↓
5. Panel closes, data source switched
```

### Workflow 5: Logout
```
1. User clicks profile menu
   ↓
2. User clicks "Logout"
   ↓
3. Session cleared
   ↓
4. Redirected to login page
```

---

## Color Scheme

### T-Mobile Branding
- **Primary Magenta:** `#E20074`
- **Secondary Blue:** `#0066CC`
- **Success Green:** `#00A651`
- **Warning Yellow:** `#FFB81C`
- **Danger Red:** `#E4002B`

### Alarm Severity
- **Critical:** Red `#E4002B`
- **High:** Orange `#FF6B35`
- **Medium:** Yellow `#FFB81C`
- **Low:** Blue `#0066CC`

---

## Animation Effects

### Pulsing Alarm Indicator
```
Frame 1: ● (opacity: 1.0)
Frame 2: ● (opacity: 0.7)
Frame 3: ● (opacity: 0.4)
Frame 4: ● (opacity: 0.7)
→ Repeat
```

### Dropdown Animation
```
Closed → Open:
  Scale: 0.95 → 1.0
  Opacity: 0 → 1
  Duration: 200ms
```

### Modal Animation
```
Closed → Open:
  Scale: 0.9 → 1.0
  Opacity: 0 → 1
  Duration: 300ms
```

---

## Keyboard Shortcuts (Future)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl+K` | Focus search bar |
| `Escape` | Clear search / Close dropdown |
| `Tab` | Navigate menu items |
| `Enter` | Select item / Submit |

---

## Accessibility Features

- ✅ Keyboard navigation support
- ✅ Focus indicators visible
- ✅ ARIA labels on buttons
- ✅ Color contrast meets WCAG AA
- ✅ Screen reader compatible
- ✅ Logical tab order

---

**Last Updated:** October 17, 2025
**Version:** 1.0

