# React Best Practices - Lessons from Header Implementation

## Overview

This guide documents best practices learned during the header component implementation, including how to avoid common pitfalls like the "Maximum update depth exceeded" error.

---

## 1. Dependency Array Management

### ❌ WRONG: Mutable Dependencies

```javascript
// DON'T DO THIS - causes infinite loops
export const useAlarmSystem = (dataset, eventStream = [], threatEvents = []) => {
  const [alarms, setAlarms] = useState([])

  useEffect(() => {
    // Initialize alarms
    setAlarms(consolidated)
  }, [dataset, eventStream, threatEvents])  // ❌ Arrays recreated on every render
}
```

**Why it's wrong:**
- Arrays are recreated on every parent render
- React compares by reference, not value
- New references trigger effect → setState → re-render → new references → infinite loop

### ✅ CORRECT: Empty Dependency Array for Mount-Only Effects

```javascript
// DO THIS - runs only once on mount
export const useAlarmSystem = (dataset, eventStream = [], threatEvents = []) => {
  const [alarms, setAlarms] = useState([])
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    // Initialize alarms
    setAlarms(consolidated)
  }, [])  // ✅ Empty array - runs only once
}
```

### ✅ CORRECT: Stable References with useMemo

```javascript
// Alternative: Stabilize array references
export const useAlarmSystem = (dataset, eventStream = [], threatEvents = []) => {
  const [alarms, setAlarms] = useState([])
  
  // Memoize arrays to prevent recreation
  const memoizedEventStream = useMemo(() => eventStream, [eventStream])
  const memoizedThreatEvents = useMemo(() => threatEvents, [threatEvents])

  useEffect(() => {
    setAlarms(consolidated)
  }, [memoizedEventStream, memoizedThreatEvents])
}
```

---

## 2. Initialization Guards with useRef

### Pattern: Prevent Multiple Initializations

```javascript
const MyComponent = () => {
  const [data, setData] = useState(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    // Guard: Only initialize once
    if (initializedRef.current) return
    initializedRef.current = true

    // Initialization code here
    fetchData().then(setData)
  }, [])

  return <div>{data}</div>
}
```

**Benefits:**
- Prevents multiple initializations
- Useful for API calls, localStorage loading, etc.
- Doesn't cause re-renders (unlike state)
- Persists across renders

---

## 3. Context Best Practices

### ✅ CORRECT: Create Context with Default Value

```javascript
export const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const value = {
    searchQuery,
    updateSearch: (query) => setSearchQuery(query),
    clearSearch: () => setSearchQuery('')
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}
```

**Best Practices:**
- Create custom hook for context access
- Throw error if used outside provider
- Memoize context value to prevent unnecessary re-renders

### ✅ CORRECT: Memoize Context Value

```javascript
export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')

  // Memoize value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    searchQuery,
    updateSearch: (query) => setSearchQuery(query),
    clearSearch: () => setSearchQuery('')
  }), [searchQuery])

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}
```

---

## 4. Modal & Dropdown Patterns

### ✅ CORRECT: Controlled Modal State

```javascript
const UserPreferencesModal = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState('dark')

  // Load from localStorage when modal opens
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('userPreferences')
      if (saved) {
        const prefs = JSON.parse(saved)
        setTheme(prefs.theme)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="modal">
      {/* Modal content */}
    </div>
  )
}
```

**Best Practices:**
- Use `isOpen` prop to control visibility
- Load data when modal opens
- Return null when closed (don't render)
- Provide onClose callback

### ✅ CORRECT: Dropdown with Backdrop

```javascript
const Dropdown = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={onClose}
        />
      )}
      {isOpen && (
        <div className="dropdown z-50">
          {/* Dropdown content */}
        </div>
      )}
    </>
  )
}
```

**Best Practices:**
- Use backdrop to close on outside click
- Ensure proper z-index layering
- Render conditionally for performance

---

## 5. Event Handling Patterns

### ✅ CORRECT: Stop Propagation

```javascript
const AlarmItem = ({ alarm, onResolve }) => {
  const handleResolve = (e) => {
    e.stopPropagation()  // Prevent parent click
    onResolve(alarm.id)
  }

  return (
    <div onClick={() => handleAlarmClick(alarm)}>
      <button onClick={handleResolve}>✓</button>
    </div>
  )
}
```

**Best Practices:**
- Use `stopPropagation()` to prevent bubbling
- Use `preventDefault()` for form submissions
- Handle events at the right level

---

## 6. Responsive Design Patterns

### ✅ CORRECT: Responsive Components

```javascript
const Header = () => {
  return (
    <header className="flex items-center justify-between">
      {/* Mobile: Show only icons */}
      <div className="lg:hidden flex gap-2">
        <button>☰</button>
        <button>🔔</button>
      </div>

      {/* Desktop: Show full header */}
      <div className="hidden lg:flex gap-4">
        <input placeholder="Search..." />
        <span>Time</span>
        <button>⚙️</button>
        <button>🔔</button>
      </div>
    </header>
  )
}
```

**Best Practices:**
- Use Tailwind responsive classes
- Hide/show elements based on breakpoints
- Test on multiple device sizes

---

## 7. Performance Optimization

### ✅ CORRECT: Memoize Callbacks

```javascript
const Header = ({ onAlarmClick }) => {
  // Memoize callback to prevent unnecessary re-renders
  const handleAlarmClick = useCallback((alarm) => {
    navigate('/network-topology')
    onAlarmClick(alarm)
  }, [onAlarmClick, navigate])

  return (
    <AlarmDropdown onAlarmClick={handleAlarmClick} />
  )
}
```

### ✅ CORRECT: Memoize Components

```javascript
const AlarmItem = memo(({ alarm, onResolve }) => {
  return (
    <div>
      {alarm.type}
      <button onClick={() => onResolve(alarm.id)}>✓</button>
    </div>
  )
})
```

---

## 8. Error Handling

### ✅ CORRECT: Try-Catch in Effects

```javascript
useEffect(() => {
  try {
    const stored = localStorage.getItem('userPreferences')
    if (stored) {
      const prefs = JSON.parse(stored)
      setPreferences(prefs)
    }
  } catch (err) {
    console.error('Failed to load preferences:', err)
    setError(err.message)
  }
}, [])
```

### ✅ CORRECT: Error Boundaries

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>
    }
    return this.props.children
  }
}
```

---

## 9. Common Pitfalls to Avoid

### ❌ DON'T: Call Hooks Conditionally

```javascript
// WRONG
if (condition) {
  const [state, setState] = useState(0)  // ❌ Breaks hook rules
}
```

### ❌ DON'T: Use Index as Key

```javascript
// WRONG
{items.map((item, index) => (
  <div key={index}>{item}</div>  // ❌ Can cause issues with reordering
))}

// RIGHT
{items.map((item) => (
  <div key={item.id}>{item}</div>  // ✅ Use unique identifier
))}
```

### ❌ DON'T: Mutate State Directly

```javascript
// WRONG
state.name = 'New Name'  // ❌ Direct mutation

// RIGHT
setState({ ...state, name: 'New Name' })  // ✅ Create new object
```

---

## 10. Testing Best Practices

### ✅ CORRECT: Test Component Behavior

```javascript
describe('AlarmDropdown', () => {
  it('should display active alarms', () => {
    const alarms = [{ id: 1, type: 'Threat' }]
    render(<AlarmDropdown alarms={alarms} />)
    expect(screen.getByText('Threat')).toBeInTheDocument()
  })

  it('should resolve alarm on button click', () => {
    const onResolve = jest.fn()
    render(<AlarmDropdown alarms={[...]} onResolveAlarm={onResolve} />)
    fireEvent.click(screen.getByRole('button', { name: /resolve/i }))
    expect(onResolve).toHaveBeenCalled()
  })
})
```

---

## Summary Checklist

- [ ] Use empty dependency array for mount-only effects
- [ ] Use `useRef` for initialization guards
- [ ] Memoize context values
- [ ] Stabilize array/object references with `useMemo`
- [ ] Use `useCallback` for event handlers
- [ ] Stop event propagation when needed
- [ ] Handle errors with try-catch
- [ ] Test component behavior
- [ ] Avoid direct state mutations
- [ ] Use unique keys in lists

---

**Last Updated:** October 17, 2025
**Version:** 1.0

