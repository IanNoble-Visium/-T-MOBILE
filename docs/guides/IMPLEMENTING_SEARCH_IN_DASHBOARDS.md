# Implementing Search in Dashboard Components

## Quick Start

Add search functionality to any dashboard in 3 simple steps:

### Step 1: Import the useSearch Hook

```javascript
import { useSearch } from '@/contexts/SearchContext'
```

### Step 2: Use the Hook in Your Component

```javascript
function MyDashboard() {
  const { searchQuery, setResults } = useSearch()
  const [data, setData] = useState([])

  // Your component logic...
}
```

### Step 3: Filter Data Based on Search Query

```javascript
useEffect(() => {
  if (searchQuery.trim()) {
    const filtered = data.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setResults(filtered)
  } else {
    setResults([])
  }
}, [searchQuery, data, setResults])
```

## Complete Example

Here's a complete example for a dashboard with searchable items:

```javascript
import { useState, useEffect } from 'react'
import { useSearch } from '@/contexts/SearchContext'

function MyDashboard() {
  const { searchQuery, setResults } = useSearch()
  const [items, setItems] = useState([
    { id: 1, name: 'Item A', type: 'threat' },
    { id: 2, name: 'Item B', type: 'device' },
    { id: 3, name: 'Item C', type: 'incident' }
  ])
  const [displayedItems, setDisplayedItems] = useState(items)

  // Filter items when search query changes
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setDisplayedItems(filtered)
      setResults(filtered)
    } else {
      setDisplayedItems(items)
      setResults([])
    }
  }, [searchQuery, items, setResults])

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Dashboard</h1>
      
      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Found {displayedItems.length} result(s) for "{searchQuery}"
        </p>
      )}

      <div className="grid gap-4">
        {displayedItems.length > 0 ? (
          displayedItems.map(item => (
            <div key={item.id} className="p-4 border rounded-lg">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{item.type}</p>
            </div>
          ))
        ) : searchQuery ? (
          <p className="text-center text-muted-foreground py-8">
            No results found for "{searchQuery}"
          </p>
        ) : (
          <p className="text-center text-muted-foreground py-8">
            Enter a search term to filter items
          </p>
        )}
      </div>
    </div>
  )
}

export default MyDashboard
```

## Advanced Patterns

### Multi-Field Search

Search across multiple fields:

```javascript
const filtered = items.filter(item => {
  const query = searchQuery.toLowerCase()
  return (
    item.name.toLowerCase().includes(query) ||
    item.description.toLowerCase().includes(query) ||
    item.type.toLowerCase().includes(query) ||
    item.severity?.toLowerCase().includes(query)
  )
})
```

### Fuzzy Search

For more flexible matching:

```javascript
function fuzzyMatch(str, pattern) {
  const patternArray = pattern.split('')
  let charIndex = 0
  
  for (let i = 0; i < str.length; i++) {
    if (str[i] === patternArray[charIndex]) {
      charIndex++
    }
  }
  
  return charIndex === patternArray.length
}

const filtered = items.filter(item =>
  fuzzyMatch(item.name.toLowerCase(), searchQuery.toLowerCase())
)
```

### Debounced Search

For performance with large datasets:

```javascript
import { useEffect, useState } from 'react'

function MyDashboard() {
  const { searchQuery } = useSearch()
  const [debouncedQuery, setDebouncedQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Use debouncedQuery for filtering
  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
    setResults(filtered)
  }, [debouncedQuery, setResults])
}
```

### Search with Highlighting

Highlight matching text:

```javascript
function HighlightedText({ text, query }) {
  if (!query) return text

  const parts = text.split(new RegExp(`(${query})`, 'gi'))
  
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-yellow-200">{part}</mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// Usage in your component
<HighlightedText text={item.name} query={searchQuery} />
```

## Search Context API

### Available Methods

```javascript
const {
  // State
  searchQuery,      // Current search input (string)
  searchResults,    // Filtered results (array)
  isSearching,      // Loading state (boolean)
  
  // Methods
  updateSearch,     // Update search query: updateSearch(query)
  clearSearch,      // Clear search: clearSearch()
  setResults,       // Set results: setResults(results)
  setSearchingState  // Set loading: setSearchingState(true/false)
} = useSearch()
```

## Best Practices

### 1. **Case-Insensitive Search**
```javascript
item.name.toLowerCase().includes(searchQuery.toLowerCase())
```

### 2. **Trim Whitespace**
```javascript
if (searchQuery.trim()) {
  // Perform search
}
```

### 3. **Handle Empty Results**
```javascript
{displayedItems.length === 0 ? (
  <p>No results found</p>
) : (
  // Display results
)}
```

### 4. **Show Search Status**
```javascript
{searchQuery && (
  <p>Found {displayedItems.length} result(s)</p>
)}
```

### 5. **Optimize Performance**
- Use `useCallback` for filter functions
- Debounce search for large datasets
- Memoize filtered results with `useMemo`

## Common Patterns by Dashboard Type

### Alarm Dashboard
```javascript
const filtered = alarms.filter(alarm => {
  const query = searchQuery.toLowerCase()
  return (
    alarm.type.toLowerCase().includes(query) ||
    alarm.description.toLowerCase().includes(query) ||
    alarm.severity.toLowerCase().includes(query)
  )
})
```

### Network Topology
```javascript
const filtered = nodes.filter(node => {
  const query = searchQuery.toLowerCase()
  return (
    node.name.toLowerCase().includes(query) ||
    node.id.toLowerCase().includes(query) ||
    node.type.toLowerCase().includes(query)
  )
})
```

### Analytics Dashboard
```javascript
const filtered = metrics.filter(metric => {
  const query = searchQuery.toLowerCase()
  return (
    metric.name.toLowerCase().includes(query) ||
    metric.category.toLowerCase().includes(query)
  )
})
```

## Troubleshooting

### Search Not Working?

1. **Check SearchProvider is wrapping your app:**
   ```javascript
   // In App.jsx
   <SearchProvider>
     <AppContent />
   </SearchProvider>
   ```

2. **Verify useSearch hook is imported:**
   ```javascript
   import { useSearch } from '@/contexts/SearchContext'
   ```

3. **Ensure setResults is called:**
   ```javascript
   setResults(filtered)
   ```

### Performance Issues?

1. **Debounce the search:**
   ```javascript
   const [debouncedQuery, setDebouncedQuery] = useState('')
   useEffect(() => {
     const timer = setTimeout(() => setDebouncedQuery(searchQuery), 300)
     return () => clearTimeout(timer)
   }, [searchQuery])
   ```

2. **Use useMemo for filtering:**
   ```javascript
   const filtered = useMemo(() => {
     return items.filter(/* ... */)
   }, [searchQuery, items])
   ```

## Examples in Codebase

Check these dashboards for search implementation examples:
- `src/components/dashboards/ExecutiveDashboard.jsx`
- `src/components/dashboards/AIAnalyticsDashboard.jsx`
- `src/components/dashboards/NetworkTopologyDashboard.jsx`

---

**Last Updated:** October 17, 2025
**Version:** 1.0

