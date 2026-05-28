import { anthropic } from '@/lib/anthropic/client'
import { PROMPTS } from '@/lib/anthropic/prompts'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: clients }, { data: revenue }, { data: deals }] = await Promise.all([
    supabase.from('clients').select('*').eq('user_id', user.id),
    supabase.from('revenue_entries').select('*').eq('user_id', user.id).order('year', { ascending: false }).order('month', { ascending: false }).limit(12),
    supabase.from('deals').select('*').eq('user_id', user.id),
  ])

  const activeClients = clients?.filter(c => c.status === 'active') ?? []
  const atRiskClients = clients?.filter(c => c.status === 'at_risk') ?? []
  const totalMRR = activeClients.reduce((s, c) => s + (c.monthly_value ?? 0), 0)
  const avgClientValue = activeClients.length > 0 ? totalMRR / activeClients.length : 0
  const openDeals = deals?.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)) ?? []
  const pipelineValue = openDeals.reduce((s, d) => s + (d.value ?? 0), 0)

  const userPrompt = `Analyse my SMMA agency and give me specific growth advice:

AGENCY DATA:
- Total MRR: R${totalMRR.toLocaleString()}
- Active Clients: ${activeClients.length}
- Average Client Value: R${Math.round(avgClientValue).toLocaleString()}/month
- At-Risk Clients: ${atRiskClients.length}
- Open Pipeline Deals: ${openDeals.length}
- Pipeline Value: R${pipelineValue.toLocaleString()}

TOP CLIENTS:
${activeClients.slice(0, 5).map(c => `- ${c.name || 'Client'}: R${(c.monthly_value ?? 0).toLocaleString()}/mo`).join('\n')}

${atRiskClients.length > 0 ? `AT-RISK CLIENTS: ${atRiskClients.map(c => c.name || 'Client').join(', ')}` : ''}

Based on this data, give me:
1. The #1 bottleneck in my agency right now (be specific)
2. The 3 highest-impact actions I should take this month (with expected revenue impact in Rands)
3. Where I should focus my next 90 days to reach R${Math.round(totalMRR * 1.5).toLocaleString()} MRR`

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: PROMPTS.growth,
    messages: [{ role: 'user', content: userPrompt }],
  })

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
              controller.enqueue(new TextEncoder().encode(event.delta.text))
            }
          }
        } finally {
          controller.close()
        }
      },
    }),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' } }
  )
}
