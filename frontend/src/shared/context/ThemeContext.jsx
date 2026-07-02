import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('fitforge_theme') || 'dark'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'light') {
      root.classList.remove('theme-dark', 'dark')
      root.classList.add('theme-light', 'light')
    } else {
      root.classList.remove('theme-light', 'light')
      root.classList.add('theme-dark', 'dark')
    }
    localStorage.setItem('fitforge_theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
