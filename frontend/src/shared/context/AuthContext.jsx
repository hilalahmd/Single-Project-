import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import API from '../utils/api'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('fitforge_user')
      if (storedUser) {
        // Set stored user immediately so UI doesn't flicker
        setUser(JSON.parse(storedUser))
      }
      try {
        // Always fetch fresh data from DB to get real subscriptionTier
        const res = await fetch(`${API}/auth/me`, { credentials: 'include' })
        if (res.ok) {
          const freshUser = await res.json()
          // Merge with stored user to preserve any local-only fields
          const stored = storedUser ? JSON.parse(storedUser) : {}
          const mergedUser = { ...stored, ...freshUser }
          setUser(mergedUser)
          localStorage.setItem('fitforge_user', JSON.stringify(mergedUser))
        } else {
          // Token invalid/expired — clear stale data
          setUser(null)
          localStorage.removeItem('fitforge_user')
        }
      } catch (e) {
        // Network error — keep localStorage value so app still works offline
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  const register = async (name, email, password, role) => {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role })
    })
    return res.json()
  }

  const verifyOTP = async (userId, otp) => {
    const res = await fetch(`${API}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp })
    })
    return res.json()
  }

  const login = async (email, password) => {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.user) {
      setUser(data.user)
      localStorage.setItem('fitforge_user', JSON.stringify(data.user))
    }
    return data
  }

  const logout = async () => {
    await fetch(`${API}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    })
    setUser(null)
    localStorage.removeItem('fitforge_user')
  }

  const updateSubscription = (tier, userData) => {
    if (user) {
      // If full user data is provided (from assign-trainer API), use it
      const updatedUser = userData ? { ...userData } : { ...user, subscriptionTier: tier }
      setUser(updatedUser)
      localStorage.setItem('fitforge_user', JSON.stringify(updatedUser))
    }
  }

  const value = useMemo(() => ({
    user,
    setUser: (newUser) => {
      setUser(newUser)
      if (newUser) {
        localStorage.setItem('fitforge_user', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('fitforge_user')
      }
    },
    role: user?.role || null,
    subscriptionTier: user?.subscriptionTier || 'free',
    register,
    verifyOTP,
    login,
    logout,
    updateSubscription,
    loading
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
