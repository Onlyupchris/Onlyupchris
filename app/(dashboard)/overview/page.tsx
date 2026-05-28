import { createClient } from '@/lib/supabase/server'
import { KPICard } from '@/components/overview/KPICard'
import { LayoutDashboard, TrendingUp, Users, FileText, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { AI_TOOLS } from '@/lib/constants'

export default async function OverviewPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [
    { data: clients },
    { data: deals },
    { data: revenue },
    { data: agreements },
  ] = await Promise.all([
    supabase.from('clients').select('*').eq('user_id', user!.id),
    supabase.from('deals').select('*').eq('user_id', user!.id),
    supabase.from('revenue_entries').select('*').eq('user_id', user!.id),
    supabase.from('agreements').select('*').eq('user_id', user!.id),
  ])

  const activeClients = clients?.filter(c => c.status === 'active').length ?? 0
  const totalMRR = clients?.filter(c => c.status === 'active').reduce((sum, c) => sum + (c.monthly_value ?? 0), 0) ?? 0
  const openDeals = deals?.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).length ?? 0
  const pipelineValue = deals?.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((sum, d) => sum + (d.value ?? 0), 0) ?? 0
  const signedAgreements = agreements?.filter(a => a.status === 'signed').length ?? 0

  // Health score: based on active clients, no at-risk, signed agreements
  const atRiskCount = clients?.filter(c => c.status === 'at_risk').length ?? 0
  const healthScore = Math.max(0, Math.min(100,
    (activeClients > 0 ? 40 : 0) +
    (totalMRR > 5000 ? 20 : totalMRR / 250) +
    (atRiskCount === 0 ? 20 : Math.max(0, 20 - atRiskCount * 10)) +
    (signedAgreements > 0 ? 20 : 0)
  ))

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Greeting */}
      <div>
        <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">Dashboard</h2>
        <p className="text-white text-2xl font-light">Your agency at a glance</p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Monthly Recurring Revenue"
          value={totalMRR}
          format="currency"
          icon={TrendingUp}
          iconColor="#4DD9D9"
          delay={0}
        />
        <KPICard
          title="Active Clients"
          value={activeClients}
          icon={Users}
          iconColor="#A78BFA"
          delay={0.1}
        />
        <KPICard
          title="Open Deals"
          value={openDeals}
          icon={LayoutDashboard}
          iconColor="#F0C040"
          suffix={pipelineValue > 0 ? ` (R${(pipelineValue / 1000).toFixed(0)}K)` : ''}
          delay={0.2}
        />
        <KPICard
          title="Agency Health Score"
          value={healthScore}
          format="percent"
          icon={Sparkles}
          iconColor={healthScore >= 70 ? '#34D399' : healthScore >= 40 ? '#F0C040' : '#F87171'}
          delay={0.3}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Add New Client', href: '/crm', icon: Users, color: '#A78BFA' },
          { label: 'Create Agreement', href: '/agreements', icon: FileText, color: '#4DD9D9' },
          { label: 'Run Growth Advisor', href: '/ai-tools/growth-advisor', icon: Sparkles, color: '#F0C040' },
        ].map(action => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center justify-between glass rounded-xl px-5 py-4 hover:border-white/20 transition-all group"
          >
            <div className="flex items-center gap-3">
              <action.icon size={18} style={{ color: action.color }} />
              <span className="text-white/70 text-sm group-hover:text-white transition-colors">{action.label}</span>
            </div>
            <ArrowRight size={14} className="text-white/20 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>

      {/* AI Tools Hub Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white/60 text-sm tracking-widest uppercase">AI Tools</h3>
          <Link href="/ai-tools" className="text-[#4DD9D9] text-xs hover:text-[#7BE8E8] transition-colors">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AI_TOOLS.map((tool, i) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="glass rounded-xl p-4 hover:border-white/20 transition-all group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                style={{ background: `${tool.color}15`, border: `1px solid ${tool.color}25` }}
              >
                <Sparkles size={14} style={{ color: tool.color }} />
              </div>
              <p className="text-white/80 text-sm font-light mb-1 group-hover:text-white transition-colors">{tool.label}</p>
              <p className="text-white/30 text-xs leading-relaxed line-clamp-2">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats row */}
      {(agreements?.length ?? 0) > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Agreements', value: agreements?.length ?? 0 },
            { label: 'Signed', value: signedAgreements },
            { label: 'Awaiting Signature', value: (agreements?.filter(a => a.status === 'sent').length ?? 0) },
          ].map(stat => (
            <div key={stat.label} className="glass rounded-xl px-5 py-4 text-center">
              <p className="text-2xl font-light text-white mb-1">{stat.value}</p>
              <p className="text-white/30 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
