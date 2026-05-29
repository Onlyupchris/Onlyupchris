'use client'
import { useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus, LayoutDashboard, Users, Sparkles, FileText, DollarSign, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; style?: React.CSSProperties }>> = {
  TrendingUp, TrendingDown, LayoutDashboard, Users, Sparkles, FileText, DollarSign, BarChart3, Minus,
}

type KPICardProps = {
  title: string
  value: number
  format?: 'currency' | 'number' | 'percent'
  change?: number
  iconName: string
  iconColor?: string
  prefix?: string
  suffix?: string
  delay?: number
}

function formatValue(value: number, format?: string, prefix?: string, suffix?: string) {
  let formatted: string
  if (format === 'currency') {
    formatted = `R${value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toFixed(0)}`
  } else if (format === 'percent') {
    formatted = `${value.toFixed(1)}%`
  } else {
    formatted = value.toFixed(0)
  }
  return `${prefix ?? ''}${formatted}${suffix ?? ''}`
}

export function KPICard({
  title, value, format, change, iconName, iconColor = '#4DD9D9', prefix, suffix, delay = 0
}: KPICardProps) {
  const Icon = ICON_MAP[iconName] ?? Sparkles
  const count = useMotionValue(0)
  const rounded = useTransform(count, v => formatValue(Math.round(v), format, prefix, suffix))

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.8,
      delay,
      ease: [0.16, 1, 0.3, 1],
    })
    return controls.stop
  }, [value, delay, count])

  const isPositive = (change ?? 0) > 0
  const isNeutral = (change ?? 0) === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="glass rounded-2xl p-5 glow-teal group hover:border-[#4DD9D9]/20 transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${iconColor}15`, border: `1px solid ${iconColor}25` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        {change !== undefined && (
          <div className={cn(
            'flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium',
            isPositive ? 'bg-emerald-400/10 text-emerald-400' :
            isNeutral ? 'bg-white/5 text-white/40' :
            'bg-red-400/10 text-red-400'
          )}>
            {isPositive ? <TrendingUp size={11} /> : isNeutral ? <Minus size={11} /> : <TrendingDown size={11} />}
            {isNeutral ? '—' : `${Math.abs(change).toFixed(1)}%`}
          </div>
        )}
      </div>

      <motion.p className="text-2xl font-light text-white tracking-tight mb-1">
        {rounded}
      </motion.p>
      <p className="text-white/40 text-xs tracking-wide uppercase">{title}</p>
    </motion.div>
  )
}
