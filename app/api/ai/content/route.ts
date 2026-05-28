import { anthropic } from '@/lib/anthropic/client'
import { PROMPTS } from '@/lib/anthropic/prompts'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: Request) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { contentType, platform, tone, brief } = await request.json()

  const userPrompt = `Generate 3 distinct variations of the following content:

Content Type: ${contentType}
Platform: ${platform}
Tone: ${tone}
Brief/Context: ${brief}

Format each variation with a clear header (Variation 1, 2, 3) and make each one distinctly different in angle and approach.`

  const stream = anthropic.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: PROMPTS.content,
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
