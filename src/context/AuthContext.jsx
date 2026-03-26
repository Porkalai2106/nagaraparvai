import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, setCurrentUser, clearCurrentUser } from '../utils/storage'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const u = getCurrentUser()
    if (u) setUser(u)
    setLoading(false)
  }, [])

  const login = (u) => {
    setCurrentUser(u)
    setUser(u)
  }

  const logout = () => {
    clearCurrentUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
