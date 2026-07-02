import React, { createContext, useContext, useState, useEffect, useMemo } from 'react'
import API from '../utils/api'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('fitforge_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
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

  const updateSubscription = (tier) => {
    if (user) {
      const updatedUser = { ...user, subscriptionTier: tier }
      setUser(updatedUser)
      localStorage.setItem('fitforge_user', JSON.stringify(updatedUser))
    }
  }

  const value = useMemo(() => ({
    user,
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
