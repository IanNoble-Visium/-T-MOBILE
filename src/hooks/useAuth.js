import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [authData, setAuthData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check for existing auth data on mount
  useEffect(() => {
    const checkAuth = () => {
      // Try localStorage first (Remember me)
      let storedAuth = localStorage.getItem('authData')
      
      // Fall back to sessionStorage
      if (!storedAuth) {
        storedAuth = sessionStorage.getItem('authData')
      }

      if (storedAuth) {
        try {
          const auth = JSON.parse(storedAuth)
          setAuthData(auth)
          setIsAuthenticated(true)
        } catch (err) {
          console.error('Failed to parse auth data:', err)
          logout()
        }
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = (auth) => {
    setAuthData(auth)
    setIsAuthenticated(true)
    // Auth data is stored in LoginPage component
  }

  const logout = () => {
    setAuthData(null)
    setIsAuthenticated(false)
    localStorage.removeItem('authData')
    sessionStorage.removeItem('authData')
  }

  return {
    authData,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
