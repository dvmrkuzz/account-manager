import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { notify } from '@/lib/notifications'

const AuthContext = createContext(null)

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL
const DEFAULT_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD
const PASSWORD_KEY = 'vaultmind_admin_password'

// Get current password (from localStorage if changed, else from .env)
function getCurrentPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('vaultmind_user')
    return saved ? JSON.parse(saved) : null
  })
  const [loading] = useState(false)
  const [theme, setTheme] = useState(() => localStorage.getItem('vaultmind_theme') || 'dark')
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('vaultmind_profile')
    return saved ? JSON.parse(saved) : { name: 'Administrator', photo: null }
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('vaultmind_theme', next)
      return next
    })
  }, [])

  const updateProfile = useCallback(({ name, photo }) => {
    setProfile((prev) => {
      const updated = {
        ...prev,
        ...(name !== undefined && { name }),
        ...(photo !== undefined && { photo }),
      }
      localStorage.setItem('vaultmind_profile', JSON.stringify(updated))
      return updated
    })
    notify.success('Profile Updated!', 'Your profile has been saved.')
  }, [])

  const login = useCallback(async (email, password) => {
    if (email.toLowerCase().trim() !== ADMIN_EMAIL.toLowerCase().trim()) {
      notify.loginFailed('Access denied. You are not authorized to log in.')
      return { error: 'Access denied' }
    }
    if (password !== getCurrentPassword()) {
      notify.loginFailed('Invalid email or password.')
      return { error: 'Invalid password' }
    }
    const userData = { email: ADMIN_EMAIL }
    sessionStorage.setItem('vaultmind_user', JSON.stringify(userData))
    setUser(userData)
    notify.loginSuccess()
    return { data: userData }
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('vaultmind_user')
    setUser(null)
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    if (currentPassword !== getCurrentPassword()) {
      notify.error('Incorrect Password', 'Your current password is wrong.')
      return { error: 'Wrong current password' }
    }
    localStorage.setItem(PASSWORD_KEY, newPassword)
    notify.passwordChanged()
    return { success: true }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, changePassword, theme, toggleTheme, profile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}