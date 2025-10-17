import React, { createContext, useState, useCallback } from 'react'

/**
 * SearchContext - Manages global search state across all dashboards
 * Allows filtering of dashboard content based on user search input
 */
export const SearchContext = createContext()

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  /**
   * Update search query and trigger search
   */
  const updateSearch = useCallback((query) => {
    setSearchQuery(query)
  }, [])

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
  }, [])

  /**
   * Set search results (called by individual dashboard components)
   */
  const setResults = useCallback((results) => {
    setSearchResults(results)
  }, [])

  /**
   * Set searching state
   */
  const setSearchingState = useCallback((state) => {
    setIsSearching(state)
  }, [])

  const value = {
    searchQuery,
    searchResults,
    isSearching,
    updateSearch,
    clearSearch,
    setResults,
    setSearchingState
  }

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  )
}

/**
 * Hook to use search context
 */
export const useSearch = () => {
  const context = React.useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

