'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, getStatusColor } from '@/lib/utils'
import { AGREEMENT_TEMPLATES } from '@/lib/constants'
import { Plus, FileText, X, Loader2, Eye, Send, CheckSquare, Clock } from 'lucide-react'
import type { Agreement } from '@/types'

type Props = {
  initialAgreements: Agreement[]
  clients: { id: string; name: string; company: string | null }[]
  userId: string
}

function StatusBadge({ status }: { status: string }) {
  const icons: Record<string, React.ReactNode> = {
    draft: <Clock size={10} />,
    sent: <Send size={10} />,
    signed: <CheckSquare size={10} />,
  }
  return (
    <span className={cn('flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-medium', getStatusColor(status))}>
      {icons[status]} {status}
    </span>
  )
}

function CreateAgreementModal({ userId, clients, onClose, onCreated }: {
  userId: string
  clients: Props['clients']
  onClose: () => void
  onCreated: (a: Agreement) => void
}) {
  const supabase = createClient()
  const [title, setTitle] = useState('')
  const [clientId, setClientId] = useState('')
  const [template, setTemplate] = useState<keyof typeof AGREEMENT_TEMPLATES>('retainer')
  const [content, setContent] = useState(AGREEMENT_TEMPLATES.retainer)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('agreements').insert({
      title, content, status: 'draft',
      client_id: clientId || null,
      user_id: userId,
    }).select('*, client:clients(name, company)').single()
    if (error) { setError(error.message); setLoading(false) }
    else { onCreated(data as Agreement); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto glow-teal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-light text-lg">Create Agreement</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Title *</label>
            <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="Social Media Retainer — Client Name"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#4DD9D9]/50 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Client</label>
              <select value={clientId} onChange={e => setClientId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Template</label>
              <select value={template} onChange={e => { const t = e.target.value as keyof typeof AGREEMENT_TEMPLATES; setTemplate(t); setContent(AGREEMENT_TEMPLATES[t]) }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
                <option value="retainer">Retainer Agreement</option>
                <option value="project">Project Agreement</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Content (Markdown)</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} rows={12}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-xs font-mono placeholder-white/20 focus:outline-none focus:border-[#4DD9D9]/50 transition-all resize-none" />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full gradient-teal text-[#0A0A0A] font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Agreement'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

function AgreementCard({ agreement, onUpdate }: { agreement: Agreement; onUpdate: (a: Agreement) => void }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [viewing, setViewing] = useState(false)

  const markAs = async (status: Agreement['status']) => {
    setLoading(true)
    const updates: Record<string, unknown> = { status }
    if (status === 'sent') updates.sent_at = new Date().toISOString()
    if (status === 'signed') updates.signed_at = new Date().toISOString()
    const { data } = await supabase.from('agreements').update(updates).eq('id', agreement.id).select('*, client:clients(name, company)').single()
    if (data) onUpdate(data as Agreement)
    setLoading(false)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-5 hover:border-white/15 transition-all">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 mr-3">
            <p className="text-white/80 text-sm font-light truncate">{agreement.title}</p>
            {agreement.client && <p className="text-white/30 text-xs mt-0.5">{(agreement.client as any).name}</p>}
          </div>
          <StatusBadge status={agreement.status} />
        </div>
        <p className="text-white/20 text-xs mb-4">{new Date(agreement.created_at).toLocaleDateString('en-ZA')}</p>
        <div className="flex gap-2">
          <button onClick={() => setViewing(true)} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
            <Eye size={12} /> View
          </button>
          {agreement.status === 'draft' && (
            <button onClick={() => markAs('sent')} disabled={loading}
              className="flex items-center gap-1.5 text-xs text-[#4DD9D9] px-3 py-1.5 rounded-lg bg-[#4DD9D9]/10 hover:bg-[#4DD9D9]/20 transition-colors disabled:opacity-50">
              <Send size={12} /> {loading ? '...' : 'Mark Sent'}
            </button>
          )}
          {agreement.status === 'sent' && (
            <button onClick={() => markAs('signed')} disabled={loading}
              className="flex items-center gap-1.5 text-xs text-emerald-400 px-3 py-1.5 rounded-lg bg-emerald-400/10 hover:bg-emerald-400/20 transition-colors disabled:opacity-50">
              <CheckSquare size={12} /> {loading ? '...' : 'Mark Signed'}
            </button>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {viewing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-light">{agreement.title}</h3>
                <button onClick={() => setViewing(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <pre className="text-white/60 text-xs font-mono leading-relaxed whitespace-pre-wrap">{agreement.content}</pre>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export function AgreementsClient({ initialAgreements, clients, userId }: Props) {
  const [agreements, setAgreements] = useState<Agreement[]>(initialAgreements)
  const [showCreate, setShowCreate] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = filterStatus === 'all' ? agreements : agreements.filter(a => a.status === filterStatus)

  const handleCreated = (a: Agreement) => setAgreements(prev => [a, ...prev])
  const handleUpdate = (updated: Agreement) => setAgreements(prev => prev.map(a => a.id === updated.id ? updated : a))

  const counts = {
    total: agreements.length,
    draft: agreements.filter(a => a.status === 'draft').length,
    sent: agreements.filter(a => a.status === 'sent').length,
    signed: agreements.filter(a => a.status === 'signed').length,
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">Agreements</h2>
          <p className="text-white text-2xl font-light">{counts.total} Total</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="gradient-teal text-[#0A0A0A] text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all">
          <Plus size={16} /> New Agreement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total', value: counts.total, color: '#ffffff' },
          { label: 'Draft', value: counts.draft, color: '#A0A0A0' },
          { label: 'Sent', value: counts.sent, color: '#60A5FA' },
          { label: 'Signed', value: counts.signed, color: '#34D399' },
        ].map(s => (
          <button key={s.label} onClick={() => setFilterStatus(s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase())}
            className={cn('glass rounded-xl p-4 text-center transition-all', filterStatus === (s.label.toLowerCase() === 'total' ? 'all' : s.label.toLowerCase()) ? 'border-[#4DD9D9]/30' : 'hover:border-white/10')}>
            <p className="text-xl font-light mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/30 text-xs uppercase tracking-widest">{s.label}</p>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <FileText size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No agreements yet</p>
          <button onClick={() => setShowCreate(true)} className="mt-4 text-[#4DD9D9] text-sm hover:text-[#7BE8E8] transition-colors">+ Create your first agreement</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => <AgreementCard key={a.id} agreement={a} onUpdate={handleUpdate} />)}
        </div>
      )}

      <AnimatePresence>
        {showCreate && <CreateAgreementModal userId={userId} clients={clients} onClose={() => setShowCreate(false)} onCreated={handleCreated} />}
      </AnimatePresence>
    </div>
  )
}
