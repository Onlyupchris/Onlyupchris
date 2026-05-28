'use client'
import { useState } from 'react'
import { useStreamingAI } from '@/hooks/useStreamingAI'
import { Pen, Copy, Check, Loader2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const CONTENT_TYPES = ['Instagram Caption', 'Facebook Ad Copy', 'TikTok Hook', 'Email Subject Line', 'Email Body', 'LinkedIn Post', 'Google Ad Copy']
const PLATFORMS = ['Instagram', 'Facebook', 'TikTok', 'LinkedIn', 'Email', 'Google Ads', 'Twitter/X']
const TONES = ['Professional', 'Casual & Fun', 'Luxury & Premium', 'Urgent & Direct', 'Educational', 'Inspirational']

export default function ContentGeneratorPage() {
  const [form, setForm] = useState({ contentType: 'Instagram Caption', platform: 'Instagram', tone: 'Professional', brief: '' })
  const [copied, setCopied] = useState(false)
  const { output, isLoading, error, stream, reset } = useStreamingAI('/api/ai/content')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    await stream(form)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">AI Tools</h2>
        <p className="text-white text-2xl font-light flex items-center gap-3">
          <Pen size={20} className="text-[#4DD9D9]" /> Content Generator
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Form */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white/60 text-xs tracking-widest uppercase mb-5">Configure</h3>
          <form onSubmit={handleGenerate} className="space-y-4">
            {[
              { key: 'contentType', label: 'Content Type', options: CONTENT_TYPES },
              { key: 'platform', label: 'Platform', options: PLATFORMS },
              { key: 'tone', label: 'Tone', options: TONES },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">{field.label}</label>
                <select value={form[field.key as keyof typeof form]}
                  onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all">
                  {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="text-xs text-white/40 tracking-widest uppercase block mb-1.5">Brief / Context</label>
              <textarea value={form.brief} onChange={e => setForm(p => ({ ...p, brief: e.target.value }))}
                rows={4} required placeholder="Describe the brand, product, campaign goal, key message, target audience..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#4DD9D9]/50 transition-all resize-none" />
            </div>
            {error && <p className="text-red-400 text-xs">{error}</p>}
            <button type="submit" disabled={isLoading}
              className="w-full gradient-teal text-[#0A0A0A] font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50">
              {isLoading ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate Content</>}
            </button>
          </form>
        </div>

        {/* Output */}
        <div className="glass rounded-2xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-white/60 text-xs tracking-widest uppercase">Output</h3>
            {output && (
              <button onClick={copyAll} className="flex items-center gap-1.5 text-xs text-white/40 hover:text-[#4DD9D9] transition-colors px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy All</>}
              </button>
            )}
          </div>
          <div className="flex-1 min-h-[300px]">
            {!output && !isLoading && (
              <div className="h-full flex items-center justify-center">
                <p className="text-white/20 text-sm text-center">Generated content will appear here</p>
              </div>
            )}
            {isLoading && !output && (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <Sparkles size={24} className="text-[#4DD9D9] animate-pulse" />
                  <p className="text-white/30 text-sm">Writing your content...</p>
                </div>
              </div>
            )}
            {output && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap font-light">
                {output}
                {isLoading && <span className="inline-block w-1.5 h-4 bg-[#4DD9D9] ml-0.5 animate-pulse" />}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
