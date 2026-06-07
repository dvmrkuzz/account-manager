import { useState } from 'react'
import { Eye, EyeOff, Copy, Check } from 'lucide-react'

export default function PasswordDisplay({ encrypted, getDecrypted }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const password = visible ? getDecrypted(encrypted) : null

  const handleCopy = async () => {
    const plain = getDecrypted(encrypted)
    if (!plain) return
    await navigator.clipboard.writeText(plain)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-slate-400 text-xs tracking-widest">
        {visible && password ? password : '••••••••••'}
      </span>
      <button
        onClick={() => setVisible((v) => !v)}
        className="btn-icon w-7 h-7 text-slate-500 hover:text-slate-300"
        title={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={13} /> : <Eye size={13} />}
      </button>
      <button
        onClick={handleCopy}
        className="btn-icon w-7 h-7 text-slate-500 hover:text-emerald-400 transition-colors"
        title="Copy password"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </button>
    </div>
  )
}
