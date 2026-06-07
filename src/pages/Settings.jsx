import { useState, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ChangePasswordForm from '@/components/settings/ChangePasswordForm'
import { Shield, User, Camera } from 'lucide-react'

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm text-slate-300 font-medium">{value}</span>
    </div>
  )
}

export default function Settings() {
  const { user, profile, updateProfile } = useAuth()
  const [name, setName] = useState(profile.name)
  const fileRef = useRef()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updateProfile({ photo: ev.target.result })
    reader.readAsDataURL(file)
  }

  const handleNameSave = () => {
    if (name.trim()) updateProfile({ name: name.trim() })
  }

  return (
    <div className="max-w-2xl space-y-6">

      {/* Profile Editor */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <User size={20} className="text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Profile</h3>
            <p className="text-sm text-slate-500">Update your name and photo</p>
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-5">
          <div className="relative">
            {profile.photo ? (
              <img src={profile.photo} alt="avatar" className="w-20 h-20 rounded-full object-cover ring-2 ring-indigo-500/40" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold">
                {profile.name?.[0]?.toUpperCase() || 'A'}
              </div>
            )}
            <button
              onClick={() => fileRef.current.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center shadow-lg transition-colors"
            >
              <Camera size={13} className="text-white" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-300">{profile.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
            <button onClick={() => fileRef.current.click()} className="text-xs text-indigo-400 hover:text-indigo-300 mt-1 transition-colors">
              Change photo
            </button>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <label className="input-label">Display Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field flex-1"
              placeholder="Your name"
            />
            <button onClick={handleNameSave} className="btn-primary px-4">Save</button>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <User size={20} className="text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Account Info</h3>
            <p className="text-sm text-slate-500">Your admin profile</p>
          </div>
        </div>
        <InfoRow label="Email" value={user?.email || '—'} />
        <InfoRow label="Role" value="Administrator" />
      </div>

      {/* Change Password */}
      <ChangePasswordForm />

      {/* Security info */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Shield size={20} className="text-emerald-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100">Security Overview</h3>
            <p className="text-sm text-slate-500">How your data is protected</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { icon: '🔐', title: 'AES-256 Encryption', desc: 'All stored passwords are encrypted before saving to the database.' },
            { icon: '🔒', title: 'Row Level Security', desc: 'Only authenticated users can access any data in the database.' },
            { icon: '🛡️', title: 'Hardcoded Admin', desc: 'No public registration. Only the configured admin can log in.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-3 p-3 rounded-xl bg-slate-800/40">
              <span className="text-xl shrink-0">{icon}</span>
              <div>
                <p className="text-sm font-medium text-slate-300">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-4 flex items-center justify-between">
        <p className="text-sm text-slate-600">VaultMind v1.0.0</p>
      </div>
    </div>
  )
}