import { useState, useEffect } from 'react'
import { Eye, EyeOff, RefreshCw } from 'lucide-react'
import { decrypt } from '@/lib/encryption'

const INITIAL = {
  platform_name: '',
  email: '',
  username: '',
  password: '',
  description: '',
}

function generatePassword(length = 20) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+'
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join('')
}

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 14) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++

  const levels = [
    { label: 'Very Weak', color: 'bg-red-500' },
    { label: 'Weak', color: 'bg-orange-500' },
    { label: 'Fair', color: 'bg-amber-400' },
    { label: 'Strong', color: 'bg-emerald-500' },
    { label: 'Very Strong', color: 'bg-emerald-400' },
  ]
  return { score, ...levels[Math.min(score, 4)] }
}

export default function AccountForm({ account, onSubmit, onCancel, submitting }) {
  const isEdit = Boolean(account)
  const [form, setForm] = useState(INITIAL)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    if (account) {
      setForm({
        platform_name: account.platform_name || '',
        email: account.email || '',
        username: account.username || '',
        password: '',
        description: account.description || '',
      })
    } else {
      setForm(INITIAL)
    }
  }, [account])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  const strength = passwordStrength(form.password)

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Platform */}
      <div>
        <label className="input-label">Platform / Service Name *</label>
        <input
          type="text"
          value={form.platform_name}
          onChange={set('platform_name')}
          className="input-field"
          placeholder="e.g. GitHub, Netflix, Bank…"
          required
        />
      </div>

      {/* Email + Username row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="input-label">Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            className="input-field"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="input-label">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={set('username')}
            className="input-field"
            placeholder="johndoe"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="input-label">
          Password {isEdit && <span className="text-slate-500 font-normal">(leave blank to keep current)</span>}
        </label>
        <div className="relative">
          <input
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            className="input-field pr-20"
            placeholder={isEdit ? '••••••••' : 'Enter password'}
            required={!isEdit}
            autoComplete="new-password"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, password: generatePassword() }))}
              className="btn-icon w-7 h-7 text-slate-500 hover:text-indigo-400"
              title="Generate password"
            >
              <RefreshCw size={13} />
            </button>
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="btn-icon w-7 h-7 text-slate-500 hover:text-slate-300"
            >
              {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>

        {/* Strength meter */}
        {form.password && (
          <div className="mt-2">
            <div className="flex gap-1 mb-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                    i < strength.score ? strength.color : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">{strength.label}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="input-label">Description / Notes</label>
        <textarea
          value={form.description}
          onChange={set('description')}
          className="input-field resize-none"
          rows={3}
          placeholder="What is this account used for?"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Saving…' : isEdit ? 'Update Account' : 'Save Account'}
        </button>
      </div>
    </form>
  )
}
