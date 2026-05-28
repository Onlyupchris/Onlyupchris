import Link from 'next/link'
import { AI_TOOLS } from '@/lib/constants'
import { Pen, TrendingUp, BarChart3, MessageSquare, Sparkles } from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  Pen, TrendingUp, BarChart3, MessageSquare, Sparkles,
}

export default function AIToolsPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">AI Tools</h2>
        <p className="text-white text-2xl font-light">Your Agency Intelligence Suite</p>
        <p className="text-white/30 text-sm mt-2">Powered by Claude — the most capable AI for agency work</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {AI_TOOLS.map((tool, i) => {
          const Icon = ICON_MAP[tool.icon] ?? Sparkles
          return (
            <Link key={tool.id} href={tool.href}
              className="glass rounded-2xl p-6 hover:border-white/20 transition-all group glow-teal hover:shadow-[0_0_40px_rgba(77,217,217,0.08)]">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}>
                  <Icon size={20} style={{ color: tool.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/90 text-base font-light mb-2 group-hover:text-white transition-colors">{tool.label}</p>
                  <p className="text-white/40 text-sm leading-relaxed">{tool.description}</p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-white/20 tracking-widest uppercase">Launch Tool</span>
                <span className="text-[#4DD9D9] text-xs group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
