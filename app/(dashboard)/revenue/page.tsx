import { createClient } from '@/lib/supabase/server'
import { TrendingUp, AlertTriangle, Zap, Target } from 'lucide-react'
import { RevenueAreaChart, RevenueBarChart } from '@/components/revenue/RevenueCharts'
import { MONTHS } from '@/lib/constants'
import type { MonthlyRevenue } from '@/types'

export default async function RevenuePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('revenue_entries')
    .select('*')
    .eq('user_id', user!.id)
    .order('year', { ascending: true })
    .order('month', { ascending: true })

  const { data: clients } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', user!.id)

  // Build 12-month data
  const now = new Date()
  const monthlyData: MonthlyRevenue[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const m = d.getMonth() + 1
    const y = d.getFullYear()
    const monthEntries = entries?.filter(e => e.month === m && e.year === y) ?? []
    monthlyData.push({
      month: `${MONTHS[m - 1]} ${y.toString().slice(2)}`,
      mrr: monthEntries.filter(e => e.type === 'recurring').reduce((s, e) => s + e.amount, 0),
      oneTime: monthEntries.filter(e => e.type === 'one_time').reduce((s, e) => s + e.amount, 0),
      total: monthEntries.reduce((s, e) => s + (e.type === 'refund' ? -e.amount : e.amount), 0),
    })
  }

  const currentMRR = clients?.filter(c => c.status === 'active').reduce((s, c) => s + (c.monthly_value ?? 0), 0) ?? 0
  const prevMonthMRR = monthlyData[monthlyData.length - 2]?.mrr ?? 0
  const currentMonthMRR = monthlyData[monthlyData.length - 1]?.mrr ?? 0
  const growth = prevMonthMRR > 0 ? ((currentMonthMRR - prevMonthMRR) / prevMonthMRR) * 100 : 0

  const atRiskClients = clients?.filter(c => c.status === 'at_risk') ?? []
  const churnedThisMonth = clients?.filter(c => c.status === 'churned') ?? []

  // Tighten-up insights
  const insights = []
  if (atRiskClients.length > 0) {
    insights.push({ icon: AlertTriangle, color: '#F59E0B', label: 'At-Risk Clients', text: `${atRiskClients.length} client${atRiskClients.length > 1 ? 's' : ''} marked at risk — schedule check-ins immediately to prevent churn` })
  }
  if (growth < 0) {
    insights.push({ icon: TrendingUp, color: '#F87171', label: 'MRR Declining', text: `MRR dropped ${Math.abs(growth).toFixed(1)}% last month. Review client satisfaction and expand active accounts` })
  }
  const clientCount = clients?.filter(c => c.status === 'active').length ?? 0
  if (clientCount < 5 && currentMRR < 50000) {
    insights.push({ icon: Zap, color: '#4DD9D9', label: 'Scale Opportunity', text: `You have capacity to take on more clients. Your current load supports ${Math.max(0, 8 - clientCount)} more at this MRR level` })
  }
  if (insights.length === 0) {
    insights.push({ icon: Target, color: '#34D399', label: 'Looking Good', text: 'No critical issues detected. Focus on expanding current clients and filling pipeline' })
  }

  // Scaling projections
  const avgClientValue = clientCount > 0 ? currentMRR / clientCount : 5000
  const projections = [
    { clients: clientCount + 1, mrr: currentMRR + avgClientValue },
    { clients: clientCount + 3, mrr: currentMRR + avgClientValue * 3 },
    { clients: clientCount + 5, mrr: currentMRR + avgClientValue * 5 },
  ]

  const isEmpty = (entries?.length ?? 0) === 0

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">Revenue</h2>
        <p className="text-white text-2xl font-light">Financial Overview</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Current MRR', value: `R${currentMRR.toLocaleString()}`, color: '#4DD9D9' },
          { label: 'MoM Growth', value: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`, color: growth >= 0 ? '#34D399' : '#F87171' },
          { label: 'Active Clients', value: clientCount.toString(), color: '#A78BFA' },
          { label: 'Avg Client Value', value: `R${Math.round(avgClientValue).toLocaleString()}`, color: '#F0C040' },
        ].map(s => (
          <div key={s.label} className="glass rounded-xl p-4">
            <p className="text-2xl font-light mb-1" style={{ color: s.color }}>{s.value}</p>
            <p className="text-white/30 text-xs uppercase tracking-widest">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {isEmpty ? (
        <div className="glass rounded-2xl p-12 text-center">
          <TrendingUp size={40} className="text-white/10 mx-auto mb-4" />
          <p className="text-white/40 text-sm">No revenue data yet.</p>
          <p className="text-white/20 text-xs mt-1">Add clients with monthly values to see your revenue charts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white/60 text-xs tracking-widest uppercase mb-4">MRR Trend (12 Months)</h3>
            <RevenueAreaChart data={monthlyData} />
          </div>
          <div className="glass rounded-2xl p-5">
            <h3 className="text-white/60 text-xs tracking-widest uppercase mb-4">Revenue Breakdown</h3>
            <RevenueBarChart data={monthlyData} />
          </div>
        </div>
      )}

      {/* Where to Tighten Up */}
      <div>
        <h3 className="text-white/60 text-xs tracking-widest uppercase mb-3">Where to Tighten Up</h3>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div key={i} className="glass rounded-xl p-4 flex gap-4 items-start">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${insight.color}15`, border: `1px solid ${insight.color}25` }}>
                <insight.icon size={16} style={{ color: insight.color }} />
              </div>
              <div>
                <p className="text-white/80 text-sm font-light mb-0.5">{insight.label}</p>
                <p className="text-white/40 text-xs leading-relaxed">{insight.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scale to Next Level */}
      <div>
        <h3 className="text-white/60 text-xs tracking-widest uppercase mb-3">Scale to Next Level</h3>
        <div className="grid grid-cols-3 gap-4">
          {projections.map((proj, i) => (
            <div key={i} className="glass-teal rounded-xl p-5 text-center">
              <p className="text-white/30 text-xs mb-2">+{proj.clients - clientCount} client{proj.clients - clientCount > 1 ? 's' : ''}</p>
              <p className="text-2xl font-light text-[#4DD9D9] mb-1">R{(proj.mrr / 1000).toFixed(0)}K</p>
              <p className="text-white/20 text-xs">monthly</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
