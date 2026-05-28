'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn, getStatusColor, formatCurrency } from '@/lib/utils'
import { CLIENT_STATUSES, DEAL_STAGES } from '@/lib/constants'
import { Plus, Users, KanbanSquare, List, X, Loader2, ExternalLink, Mail, Phone } from 'lucide-react'
import type { Client, Deal } from '@/types'

type Props = {
  initialClients: Client[]
  initialDeals: Deal[]
  userId: string
}

function StatusBadge({ status }: { status: string }) {
  const label = status.replace('_', ' ')
  return (
    <span className={cn('px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-medium', getStatusColor(status))}>
      {label}
    </span>
  )
}

function AddClientModal({ userId, onClose, onAdded }: { userId: string; onClose: () => void; onAdded: (c: Client) => void }) {
  const supabase = createClient()
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', monthly_value: '', status: 'prospect' as Client['status'] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.from('clients').insert({
      ...form,
      monthly_value: parseFloat(form.monthly_value) || 0,
      user_id: userId,
    }).select().single()
    if (error) { setError(error.message); setLoading(false) }
    else { onAdded(data as Client); onClose() }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass rounded-2xl p-6 w-full max-w-md glow-teal">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-white font-light text-lg">Add Client</h3>
          <button onClick={onClose} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          {[
            { key: 'name', label: 'Name *', type: 'text', required: true },
            { key: 'company', label: 'Company', type: 'text' },
            { key: 'email', label: 'Email', type: 'email' },
            { key: 'phone', label: 'Phone', type: 'tel' },
            { key: 'monthly_value', label: 'Monthly Value (R)', type: 'number' },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">{f.label}</label>
              <input type={f.type} required={f.required} value={form[f.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#4DD9D9]/50 transition-all" />
            </div>
          ))}
          <div>
            <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Status</label>
            <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as Client['status'] }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
              {CLIENT_STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className="w-full gradient-teal text-[#0A0A0A] font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Add Client'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export function CRMClient({ initialClients, initialDeals, userId }: Props) {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [showAdd, setShowAdd] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filtered = filterStatus === 'all' ? clients : clients.filter(c => c.status === filterStatus)

  const handleAdded = (c: Client) => {
    setClients(prev => [c, ...prev])
    router.refresh()
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">CRM</h2>
          <p className="text-white text-2xl font-light">{clients.length} Clients</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="gradient-teal text-[#0A0A0A] text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 hover:opacity-90 transition-all">
          <Plus size={16} /> Add Client
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
          {[{ id: 'list', icon: List }, { id: 'kanban', icon: KanbanSquare }].map(v => (
            <button key={v.id} onClick={() => setView(v.id as 'list' | 'kanban')}
              className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all', view === v.id ? 'bg-[#4DD9D9]/20 text-[#4DD9D9]' : 'text-white/40 hover:text-white/70')}>
              <v.icon size={14} /> {v.id.charAt(0).toUpperCase() + v.id.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...CLIENT_STATUSES.map(s => s.id)].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs transition-all', filterStatus === s ? 'bg-[#4DD9D9]/20 text-[#4DD9D9] border border-[#4DD9D9]/30' : 'bg-white/5 text-white/40 hover:text-white/70 border border-white/10')}>
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Users size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No clients yet</p>
          <button onClick={() => setShowAdd(true)} className="mt-4 text-[#4DD9D9] text-sm hover:text-[#7BE8E8] transition-colors">+ Add your first client</button>
        </div>
      ) : view === 'list' ? (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Client', 'Status', 'Monthly Value', 'Start Date', 'Contact'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-white/30 uppercase tracking-widest font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((client, i) => (
                <motion.tr key={client.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-white/80 text-sm font-light">{client.name}</p>
                      {client.company && <p className="text-white/30 text-xs">{client.company}</p>}
                    </div>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={client.status} /></td>
                  <td className="px-5 py-4 text-[#4DD9D9] text-sm font-light">{client.monthly_value > 0 ? `R${client.monthly_value.toLocaleString()}` : '—'}</td>
                  <td className="px-5 py-4 text-white/30 text-xs">{client.start_date ? new Date(client.start_date).toLocaleDateString('en-ZA') : '—'}</td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {client.email && <a href={`mailto:${client.email}`} className="text-white/30 hover:text-[#4DD9D9] transition-colors"><Mail size={14} /></a>}
                      {client.phone && <a href={`tel:${client.phone}`} className="text-white/30 hover:text-[#4DD9D9] transition-colors"><Phone size={14} /></a>}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CLIENT_STATUSES.map(stage => {
            const stageclients = filtered.filter(c => c.status === stage.id)
            return (
              <div key={stage.id} className="glass rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-white/40 uppercase tracking-widest">{stage.label}</span>
                  <span className="text-xs text-white/20">{stageclients.length}</span>
                </div>
                <div className="space-y-2">
                  {stageclients.map(c => (
                    <div key={c.id} className="bg-white/5 rounded-xl p-3 border border-white/5">
                      <p className="text-white/80 text-sm font-light">{c.name}</p>
                      {c.company && <p className="text-white/30 text-xs">{c.company}</p>}
                      {c.monthly_value > 0 && <p className="text-[#4DD9D9] text-xs mt-1">R{c.monthly_value.toLocaleString()}/mo</p>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {showAdd && <AddClientModal userId={userId} onClose={() => setShowAdd(false)} onAdded={handleAdded} />}
      </AnimatePresence>
    </div>
  )
}
