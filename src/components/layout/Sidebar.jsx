import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, CalendarDays, Settings, LogOut, X, KeyRound, Sun, Moon } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { notify } from '@/lib/notifications'

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout, theme, toggleTheme, profile } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    const result = await notify.confirm({
      title: 'Sign Out?',
      text: 'You will be returned to the login screen.',
      confirmText: 'Sign Out',
      icon: 'question',
    })
    if (result.isConfirmed) {
      await logout()
      navigate('/login')
    }
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 z-50 h-full w-64 border-r flex flex-col transition-transform duration-300 ease-in-out
        ${theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className={`flex items-center justify-between px-5 py-5 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <KeyRound size={16} className="text-white" />
            </div>
            <span className={`font-bold text-lg tracking-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>VaultMind</span>
          </div>
          <button onClick={onClose} className="btn-icon lg:hidden">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className={`px-3 pb-2 text-xs font-semibold uppercase tracking-widest ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>
            Navigation
          </p>
          {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Theme toggle */}
        <div className={`px-4 py-3 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center justify-between px-2">
            <span className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </span>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-300
                ${theme === 'dark' ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full bg-white shadow transform transition-transform duration-300
                ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0.5'}`}>
                {theme === 'dark' ? <Moon size={11} className="text-indigo-600" /> : <Sun size={11} className="text-amber-500" />}
              </span>
            </button>
          </div>
        </div>

        {/* User section */}
        <div className={`px-3 pb-4 border-t pt-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3 px-3 py-2.5 mb-2">
            {profile.photo ? (
              <img src={profile.photo} alt="avatar" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                {profile.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <div className="min-w-0">
              <p className={`text-xs font-medium truncate ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{profile.name}</p>
              <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10">
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}