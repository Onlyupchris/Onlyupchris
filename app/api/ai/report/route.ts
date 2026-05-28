import { anthropic } from '@/lib/anthropic/client'
import { PROMPTS } from '@/lib/anthropic/prompts'
import { createClient } from '@/lib/supabase/server'
import { MONTHS } from '@/lib/constants'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { clientId, month, year } = await request.json()

  const [{ data: client }, { data: revenue }] = await Promise.all([
    supabase.from('clients').select('*').eq('id', clientId).eq('user_id', user.id).single(),
    supabase.from('revenue_entries').select('*').eq('client_id', clientId).eq('month', month).eq('year', year),
  ])

  if (!client) return Response.json({ error: 'Client not found' }, { status: 404 })

  const monthName = MONTHS[month - 1]
  const totalRevenue = revenue?.reduce((s, e) => s + (e.type === 'refund' ? -e.amount : e.amount), 0) ?? 0

  const userPrompt = `Generate a professional monthly client report for ${monthName} ${year}.

CLIENT: ${client.name}${client.company ? ` (${client.company})` : ''}
MONTHLY RETAINER: R${(client.monthly_value ?? 0).toLocaleString()}
STATUS: ${client.status}
REVENUE THIS MONTH: R${totalRevenue.toLocaleString()}

Generate a complete monthly performance report including:
- Executive Summary
- Key Performance Highlights
- What We Achieved This Month
- Areas of Opportunity
- Action Plan for Next Month
- A closing note that reinforces the value being delivered

Make it feel premium and worth the retainer fee. Be encouraging but honest.`

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 3000,
    system: PROMPTS.report,
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
