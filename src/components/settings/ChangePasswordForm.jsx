import { useState } from 'react'
import { Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ChangePasswordForm() {
  const { changePassword } = useAuth()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [show, setShow] = useState({ current: false, new: false, confirm: false })
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((err) => ({ ...err, [field]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.currentPassword) errs.currentPassword = 'Please enter your current password.'
    if (form.newPassword.length < 8) errs.newPassword = 'Password must be at least 8 characters.'
    if (form.newPassword !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    const result = await changePassword(form.currentPassword, form.newPassword)
    setSubmitting(false)
    if (!result.error) {
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
          <ShieldCheck size={20} className="text-indigo-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-100">Change Password</h3>
          <p className="text-sm text-slate-500">Update your admin login password</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Current Password */}
        <div>
          <label className="input-label">Current Password</label>
          <div className="relative">
            <input
              type={show.current ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={set('currentPassword')}
              className={`input-field pr-10 ${errors.currentPassword ? 'border-red-500' : ''}`}
              placeholder="Enter current password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, current: !s.current }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {show.current ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.currentPassword && <p className="mt-1 text-xs text-red-400">{errors.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div>
          <label className="input-label">New Password</label>
          <div className="relative">
            <input
              type={show.new ? 'text' : 'password'}
              value={form.newPassword}
              onChange={set('newPassword')}
              className={`input-field pr-10 ${errors.newPassword ? 'border-red-500' : ''}`}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, new: !s.new }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {show.new ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="input-label">Confirm New Password</label>
          <div className="relative">
            <input
              type={show.confirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={set('confirmPassword')}
              className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
              placeholder="Confirm new password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>}
        </div>

        <div className="pt-1">
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? 'Updating…' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  )
}