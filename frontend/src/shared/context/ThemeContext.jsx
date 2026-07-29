import React, { createContext, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const theme = 'dark'

  useEffect(() => {
    const root = window.document.documentElement
    // Force dark theme classes and remove any lingering light theme classes
    root.classList.remove('theme-light', 'light')
    root.classList.add('theme-dark', 'dark')
    // Clear the local storage so it doesn't remember any light mode preference
    localStorage.removeItem('fitforge_theme')
    localStorage.setItem('fitforge_theme', 'dark')
  }, [])

  // Dummy toggle function so nothing breaks if it's called elsewhere
  const toggleTheme = () => {}

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
