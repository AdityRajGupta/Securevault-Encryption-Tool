import { createContext, useContext } from 'react'
import { useTheme } from '@/hooks/useTheme'

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const themeState = useTheme()
  
  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeProvider')
  }
  return context
}
