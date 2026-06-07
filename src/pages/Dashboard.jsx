import { useState, useMemo } from 'react'
import { Plus, Database, Clock, Star, LayoutGrid, Table2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useAccounts } from '@/hooks/useAccounts'
import AccountsTable from '@/components/accounts/AccountsTable'
import AccountForm from '@/components/accounts/AccountForm'
import Modal from '@/components/ui/Modal'
import SearchBar from '@/components/ui/SearchBar'
import PasswordDisplay from '@/components/accounts/PasswordDisplay'
import { format } from 'date-fns'

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: 'var(--text-primary, #f1f5f9)' }}>{value}</p>
        <p className="text-sm" style={{ color: 'var(--text-muted, #475569)' }}>{label}</p>
      </div>
    </div>
  )
}

function AccountCard({ account, onEdit, onDelete, getDecryptedPassword }) {
  const color = '#' + Math.abs(account.platform_name.split('').reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)).toString(16).slice(0, 6).padStart(6, '6366f1')

  return (
    <div className="glass-card p-5 hover:border-slate-600/80 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ background: `linear-gradient(135deg, ${color}33, ${color}22)`, border: `1px solid ${color}44`, color: color }}
          >
            {account.platform_name[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-200">{account.platform_name}</h3>
            <p className="text-xs text-slate-500">{account.email || account.username || 'No email'}</p>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(account)} className="btn-ghost py-1 px-2 text-xs">Edit</button>
          <button onClick={() => onDelete(account.id)} className="btn-ghost py-1 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10">Delete</button>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600 text-xs">Password</span>
          <PasswordDisplay encrypted={account.encrypted_password} getDecrypted={getDecryptedPassword} />
        </div>
        {account.description && (
          <p className="text-slate-500 text-xs truncate" title={account.description}>{account.description}</p>
        )}
        <p className="text-slate-700 text-xs">
          {account.updated_at ? formatDistanceToNow(new Date(account.updated_at), { addSuffix: true }) : ''}
        </p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { accounts, loading, createAccount, updateAccount, deleteAccount, getDecryptedPassword } = useAccounts()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [view, setView] = useState('table')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return accounts
    return accounts.filter(
      (a) =>
        a.platform_name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.username?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q)
    )
  }, [accounts, search])

  const recentCount = useMemo(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return accounts.filter((a) => new Date(a.created_at) > oneWeekAgo).length
  }, [accounts])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (account) => { setEditTarget(account); setModalOpen(true) }
  const closeModal = () => { setModalOpen(false); setEditTarget(null) }

  const handleSubmit = async (values) => {
    setSubmitting(true)
    if (editTarget) {
      await updateAccount(editTarget.id, values)
    } else {
      await createAccount(values)
    }
    setSubmitting(false)
    closeModal()
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard icon={Database} label="Total Accounts" value={accounts.length} color="bg-gradient-to-br from-indigo-500 to-violet-600" />
        <StatCard icon={Clock} label="Added This Week" value={recentCount} color="bg-gradient-to-br from-emerald-500 to-teal-600" />
        <StatCard icon={Star} label="Platforms" value={new Set(accounts.map((a) => a.platform_name)).size} color="bg-gradient-to-br from-amber-500 to-orange-600" />
      </div>

      {/* Toolbar */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Accounts</h2>
          <p className="page-subtitle">{filtered.length} of {accounts.length} shown</p>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search platform, email, username…"
            className="w-64"
          />
          {/* View toggle */}
         <div className="flex items-center gap-1 p-1 rounded-xl border"
  style={{ background: 'rgba(255,255,255,0.06)', borderColor: 'rgba(255,255,255,0.1)' }}>
  <button
    onClick={() => setView('table')}
    className={`btn-icon w-8 h-8 ${view === 'table' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500'}`}
    title="Table view"
  >
    <Table2 size={15} />
  </button>
  <button
    onClick={() => setView('card')}
    className={`btn-icon w-8 h-8 ${view === 'card' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-500'}`}
    title="Card view"
  >
    <LayoutGrid size={15} />
  </button>
</div>
          <button onClick={openCreate} className="btn-primary">
            <Plus size={16} />
            New Account
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : view === 'table' ? (
        <AccountsTable
          accounts={filtered}
          onEdit={openEdit}
          onDelete={deleteAccount}
          getDecryptedPassword={getDecryptedPassword}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-500">No accounts found.</p>
            </div>
          ) : (
            filtered.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onEdit={openEdit}
                onDelete={deleteAccount}
                getDecryptedPassword={getDecryptedPassword}
              />
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editTarget ? `Edit — ${editTarget.platform_name}` : 'New Account'}
        size="md"
      >
        <AccountForm
          account={editTarget}
          onSubmit={handleSubmit}
          onCancel={closeModal}
          submitting={submitting}
        />
      </Modal>
    </div>
  )
}
