'use client'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import type { MonthlyRevenue } from '@/types'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl px-4 py-3 text-xs border border-white/10">
      <p className="text-white/50 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.color }} className="font-light">
          {entry.name}: R{Number(entry.value).toLocaleString()}
        </p>
      ))}
    </div>
  )
}

export function RevenueAreaChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4DD9D9" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4DD9D9" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="mrr" name="MRR" stroke="#4DD9D9" strokeWidth={2} fill="url(#mrrGradient)" dot={{ fill: '#0A0A0A', stroke: '#4DD9D9', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, fill: '#4DD9D9' }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function RevenueBarChart({ data }: { data: MonthlyRevenue[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `R${(v/1000).toFixed(0)}K`} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="mrr" name="MRR" fill="#4DD9D9" opacity={0.8} radius={[4, 4, 0, 0]} />
        <Bar dataKey="oneTime" name="One-time" fill="#A78BFA" opacity={0.6} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
