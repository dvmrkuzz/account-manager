import { useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  const { theme } = useAuth()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md animate-fade-in"
        style={{ background: theme === 'light' ? 'rgba(99,102,241,0.08)' : 'rgba(0,0,0,0.5)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative w-full ${sizeClasses[size]} animate-scale-in overflow-hidden rounded-2xl`}
        style={{
          background: theme === 'light'
            ? 'rgba(255,255,255,0.85)'
            : 'rgba(15,10,40,0.85)',
          border: theme === 'light'
            ? '1px solid rgba(99,102,241,0.2)'
            : '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(30px)',
          WebkitBackdropFilter: 'blur(30px)',
          boxShadow: theme === 'light'
            ? '0 25px 50px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.9)'
            : '0 25px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        }}
      >
        {/* Top gradient bar */}
        <div className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            borderBottom: theme === 'light'
              ? '1px solid rgba(99,102,241,0.1)'
              : '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: theme === 'light' ? '#1e293b' : '#f1f5f9' }}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="btn-icon"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}