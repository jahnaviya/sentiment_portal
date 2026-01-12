import { createContext, useContext, useState, useEffect } from 'react'
import loginApi from '../apis/LoginApis'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in (e.g., from sessionStorage)
    const storedAuth = sessionStorage.getItem('isAuthenticated')
    const storedUser = sessionStorage.getItem('user')
    
    if (storedAuth === 'true' && storedUser) {
      setIsAuthenticated(true)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    // Real login via API
    const username = credentials.username || credentials.email
    const password = credentials.password

    if (!username || !password) {
      return { success: false, error: 'Username and password are required' }
    }

    try {
      const result = await loginApi({ username, password })

      // Support multiple backend response shapes including wrapped RESULT arrays:
      // - { status: 'S', message, username, user_id }
      // - { p_out_mssg_flg: 'S', p_out_mssg: 'Login successful', ... }
      // - { success: true, user: {...}, token }
      // - { RESULT: [ { status: 'S', message: 'Login successful', username, user_id } ] }

      // Normalize possible response shapes
      let entry = result
      if (result && Array.isArray(result.RESULT) && result.RESULT.length > 0) {
        entry = result.RESULT[0]
      }

      const flag = entry?.status || entry?.p_out_mssg_flg || (entry?.success ? 'S' : (result?.success ? 'S' : 'F'))
      const success = (flag && String(flag).toUpperCase() === 'S') || entry?.success === true || result?.success === true

      if (!success) {
        return { success: false, error: entry?.message || entry?.p_out_mssg || result?.message || 'Invalid username or password' }
      }

      const user = {
        id: entry?.user_id || entry?.user?.id || null,
        name: entry?.username || entry?.user?.name || username,
        raw: result,
      }

      const token = entry?.token || result?.token || result?.auth_token || null

      setIsAuthenticated(true)
      setUser(user)
      sessionStorage.setItem('isAuthenticated', 'true')
      sessionStorage.setItem('user', JSON.stringify(user))
      if (token) sessionStorage.setItem('auth_token', token)

      return { success: true, data: result }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || 'Network error'
      return { success: false, error: message }
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('user')
  }

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}