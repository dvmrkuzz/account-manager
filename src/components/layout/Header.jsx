import { Menu, Bell } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Manage your saved credentials' },
  '/calendar': { title: 'Calendar', subtitle: 'Schedule and view your events' },
  '/settings': { title: 'Settings', subtitle: 'Account preferences & security' },
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation()
  const { theme } = useAuth()
  const info = PAGE_TITLES[pathname] || { title: 'VaultMind', subtitle: '' }

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 h-16 border-b backdrop-blur-xl"
      style={{
        background: theme === 'light'
          ? 'rgba(255, 255, 255, 0.7)'
          : 'rgba(10, 10, 26, 0.8)',
        borderColor: theme === 'light'
          ? 'rgba(99, 102, 241, 0.1)'
          : 'rgba(255, 255, 255, 0.06)',
      }}
    >
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="btn-icon lg:hidden" aria-label="Open sidebar">
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-base font-semibold leading-tight"
            style={{ color: theme === 'light' ? '#1e293b' : '#f1f5f9' }}>
            {info.title}
          </h1>
          {info.subtitle && (
            <p className="text-xs leading-tight hidden sm:block"
              style={{ color: theme === 'light' ? '#94a3b8' : '#475569' }}>
              {info.subtitle}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="btn-icon relative" aria-label="Notifications">
          <Bell size={18} />
        </button>
      </div>
    </header>
  )
}