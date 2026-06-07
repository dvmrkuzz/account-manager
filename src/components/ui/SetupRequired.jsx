import { KeyRound, ExternalLink, Copy, Check } from 'lucide-react'
import { useState } from 'react'

const STEPS = [
  {
    num: '1',
    title: 'Create a free Supabase project',
    desc: 'Go to supabase.com, create an account, and start a new project.',
    link: { href: 'https://supabase.com', label: 'Open Supabase →' },
  },
  {
    num: '2',
    title: 'Run the database schema',
    desc: 'In Supabase → SQL Editor, paste and run the contents of supabase/schema.sql.',
  },
  {
    num: '3',
    title: 'Create your admin account',
    desc: 'In Supabase → Authentication → Users, add one user. Then disable "Enable Sign Ups" so no one else can register.',
  },
  {
    num: '4',
    title: 'Create your .env file',
    desc: 'Copy .env.example to .env and fill in the four values shown below.',
  },
  {
    num: '5',
    title: 'Restart the dev server',
    desc: 'Stop the server (Ctrl+C) and run npm run dev again.',
  },
]

function CopySnippet({ text }) {
  const [copied, setCopied] = useState(false)
  const handle = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="relative mt-3 bg-slate-950 border border-slate-700 rounded-xl overflow-hidden">
      <pre className="text-xs text-slate-300 p-4 overflow-x-auto leading-relaxed">{text}</pre>
      <button
        onClick={handle}
        className="absolute top-2 right-2 btn-icon w-7 h-7 text-slate-500 hover:text-slate-300"
        title="Copy"
      >
        {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
      </button>
    </div>
  )
}

export default function SetupRequired() {
  const envExample = `VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_ADMIN_EMAIL=admin@example.com
VITE_ENCRYPTION_KEY=change-this-to-a-random-32-char-string`

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl animate-scale-in">
        <div className="glass-card overflow-hidden shadow-2xl shadow-black/50">
          <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl
                bg-gradient-to-br from-indigo-500 to-violet-600 mb-4 shadow-xl shadow-indigo-500/30">
                <KeyRound size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-slate-100">Setup Required</h1>
              <p className="text-slate-500 text-sm mt-1.5">
                Configure your environment variables to get started
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-4 mb-6">
              {STEPS.map(({ num, title, desc, link }) => (
                <div key={num} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-indigo-600/20 border border-indigo-500/40
                    flex items-center justify-center text-indigo-400 text-xs font-bold shrink-0 mt-0.5">
                    {num}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">{title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                    {link && (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-1"
                      >
                        {link.label} <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* .env snippet */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                .env file content
              </p>
              <CopySnippet text={envExample} />
            </div>

            <p className="text-center text-xs text-slate-600 mt-6">
              Full instructions in{' '}
              <span className="text-slate-500 font-mono">README.md</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
