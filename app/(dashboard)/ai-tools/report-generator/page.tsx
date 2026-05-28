'use client'
import { useState, useEffect } from 'react'
import { useStreamingAI } from '@/hooks/useStreamingAI'
import { createClient } from '@/lib/supabase/client'
import { BarChart3, Loader2, Sparkles, Printer } from 'lucide-react'
import { motion } from 'framer-motion'
import { MONTHS } from '@/lib/constants'

type ClientRow = { id: string; name: string; company: string | null }

export default function ReportGeneratorPage() {
  const supabase = createClient()
  const [clients, setClients] = useState<ClientRow[]>([])
  const [clientId, setClientId] = useState('')
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const { output, isLoading, error, stream } = useStreamingAI('/api/ai/report')

  useEffect(() => {
    supabase.from('clients').select('id, name, company').then(({ data }) => {
      if (data) setClients(data)
    })
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientId) return
    await stream({ clientId, month, year })
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">AI Tools</h2>
        <p className="text-white text-2xl font-light flex items-center gap-3">
          <BarChart3 size={20} className="text-[#A78BFA]" /> Report Generator
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Config */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white/60 text-xs tracking-widest uppercase mb-5">Configure Report</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Client *</label>
              <select required value={clientId} onChange={e => setClientId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
                <option value="">Select client...</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}{c.company ? ` — ${c.company}` : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Month</label>
              <select value={month} onChange={e => setMonth(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
                {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Year</label>
              <select value={year} onChange={e => setYear(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={isLoading || !clientId}
              className="w-full gradient-teal text-[#0A0A0A] font-medium py-2.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
              {isLoading ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate Report</>}
            </button>
          </form>
        </div>

        {/* Report */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white/60 text-xs tracking-widest uppercase">Report Preview</h3>
            {output && (
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#A78BFA] transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                <Printer size={12} /> Print / Export
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[400px]">
            {!output && !isLoading && (
              <div className="h-full flex items-center justify-center">
                <p className="text-white/20 text-sm text-center">Select a client and generate your report</p>
              </div>
            )}
            {isLoading && !output && (
              <div className="h-full flex flex-col items-center justify-center gap-3">
                <Loader2 size={24} className="text-[#A78BFA] animate-spin" />
                <p className="text-white/30 text-sm">Writing your client report...</p>
              </div>
            )}
            {output && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-white/75 text-sm leading-relaxed whitespace-pre-wrap font-light">
                {output}
                {isLoading && <span className="inline-block w-1.5 h-4 bg-[#A78BFA] ml-0.5 animate-pulse" />}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
