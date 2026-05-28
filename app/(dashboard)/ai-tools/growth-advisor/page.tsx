'use client'
import { useEffect } from 'react'
import { useStreamingAI } from '@/hooks/useStreamingAI'
import { TrendingUp, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

export default function GrowthAdvisorPage() {
  const { output, isLoading, error, stream, reset } = useStreamingAI('/api/ai/growth')

  useEffect(() => {
    stream({})
  }, [])

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">AI Tools</h2>
          <p className="text-white text-2xl font-light flex items-center gap-3">
            <TrendingUp size={20} className="text-[#F0C040]" /> Growth Advisor
          </p>
        </div>
        <button onClick={() => { reset(); stream({}) }} disabled={isLoading}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 disabled:opacity-40">
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh Analysis
        </button>
      </div>

      <div className="glass-teal rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={16} className="text-[#F0C040]" />
          <p className="text-white/50 text-xs tracking-widest uppercase">Live Agency Analysis</p>
        </div>

        {!output && isLoading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 size={28} className="text-[#F0C040] animate-spin" />
            <p className="text-white/30 text-sm">Analysing your agency data...</p>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 rounded-xl p-4">{error}</div>
        )}

        {output && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap font-light">
            {output}
            {isLoading && <span className="inline-block w-1.5 h-4 bg-[#F0C040] ml-0.5 animate-pulse" />}
          </motion.div>
        )}
      </div>

      <p className="text-white/20 text-xs text-center">
        Analysis based on your live CRM and revenue data · Updates every time you refresh
      </p>
    </div>
  )
}
