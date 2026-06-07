import { useState } from 'react'
import { Edit2, Trash2, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import { format } from 'date-fns'
import PasswordDisplay from './PasswordDisplay'

const PLATFORM_COLORS = {
  github: '#24292e', google: '#4285f4', twitter: '#1da1f2', facebook: '#1877f2',
  instagram: '#e1306c', linkedin: '#0a66c2', netflix: '#e50914', spotify: '#1db954',
  amazon: '#ff9900', apple: '#555', discord: '#5865f2', slack: '#4a154b',
  default: '#6366f1',
}

function getPlatformColor(name) {
  const key = name?.toLowerCase() || ''
  return Object.entries(PLATFORM_COLORS).find(([k]) => key.includes(k))?.[1] || PLATFORM_COLORS.default
}

function PlatformBadge({ name }) {
  const color = getPlatformColor(name)
  const initial = name?.[0]?.toUpperCase() || '?'
  return (
    <div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ backgroundColor: color + '22', border: `1px solid ${color}44`, color }}
    >
      {initial}
    </div>
  )
}

export default function AccountsTable({ accounts, onEdit, onDelete, getDecryptedPassword }) {
  const [sortField, setSortField] = useState('created_at')
  const [sortDir, setSortDir] = useState('desc')

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir('asc')
    }
  }

  const sorted = [...accounts].sort((a, b) => {
    const av = a[sortField] || ''
    const bv = b[sortField] || ''
    const cmp = av < bv ? -1 : av > bv ? 1 : 0
    return sortDir === 'asc' ? cmp : -cmp
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={12} className="opacity-20" />
    return sortDir === 'asc' ? <ChevronUp size={12} className="text-indigo-400" /> : <ChevronDown size={12} className="text-indigo-400" />
  }

  if (accounts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🔐</span>
        </div>
        <p className="text-slate-400 font-medium">No accounts yet</p>
        <p className="text-slate-600 text-sm mt-1">Add your first account to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="data-table">
        <thead>
          <tr>
            {[
              { key: 'platform_name', label: 'Platform' },
              { key: 'email', label: 'Email' },
              { key: 'username', label: 'Username' },
              { key: null, label: 'Password' },
              { key: 'description', label: 'Notes' },
              { key: 'created_at', label: 'Created' },
              { key: null, label: 'Actions' },
            ].map(({ key, label }) => (
              <th
                key={label}
                onClick={key ? () => handleSort(key) : undefined}
                className={key ? 'cursor-pointer hover:text-slate-300 transition-colors select-none' : ''}
              >
                <div className="flex items-center gap-1">
                  {label}
                  {key && <SortIcon field={key} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((account) => (
            <tr key={account.id} className="group">
              {/* Platform */}
              <td>
                <div className="flex items-center gap-2.5">
                  <PlatformBadge name={account.platform_name} />
                  <span className="font-medium text-slate-200">{account.platform_name}</span>
                </div>
              </td>

              {/* Email */}
              <td>
                <span className="text-slate-400 text-sm">
                  {account.email || <span className="text-slate-700">—</span>}
                </span>
              </td>

              {/* Username */}
              <td>
                <span className="text-slate-400 text-sm">
                  {account.username || <span className="text-slate-700">—</span>}
                </span>
              </td>

              {/* Password */}
              <td>
                <PasswordDisplay
                  encrypted={account.encrypted_password}
                  getDecrypted={getDecryptedPassword}
                />
              </td>

              {/* Notes */}
              <td>
                <span
                  className="text-slate-500 text-sm max-w-[200px] truncate block"
                  title={account.description}
                >
                  {account.description || <span className="text-slate-700">—</span>}
                </span>
              </td>

              {/* Created */}
              <td>
                <span className="text-slate-600 text-xs whitespace-nowrap">
                  {account.created_at ? format(new Date(account.created_at), 'MMM d, yyyy') : '—'}
                </span>
              </td>

              {/* Actions */}
              <td>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(account)}
                    className="btn-icon w-8 h-8 text-slate-500 hover:text-indigo-400"
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(account.id)}
                    className="btn-icon w-8 h-8 text-slate-500 hover:text-red-400"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
