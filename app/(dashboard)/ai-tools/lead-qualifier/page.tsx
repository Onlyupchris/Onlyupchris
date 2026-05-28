'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, Send, Loader2, RotateCcw } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export default function LeadQualifierPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Kickstart the conversation
  useEffect(() => {
    handleSend('Hi, I\'m interested in your social media services.')
  }, [])

  const handleSend = async (text?: string) => {
    const content = text ?? input.trim()
    if (!content || isLoading) return
    setInput('')
    setError('')

    const userMsg: Message = { role: 'user', content }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/ai/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      })
      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let aiText = ''

      setMessages(prev => [...prev, { role: 'assistant', content: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        aiText += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: aiText }
          return updated
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error')
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const reset = () => {
    setMessages([])
    setError('')
    setTimeout(() => handleSend('Hi, I\'m interested in your social media services.'), 100)
  }

  return (
    <div className="max-w-2xl space-y-4" style={{ height: 'calc(100vh - 140px)', display: 'flex', flexDirection: 'column' }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white/30 text-sm tracking-widest uppercase mb-1">AI Tools</h2>
          <p className="text-white text-2xl font-light flex items-center gap-3">
            <MessageSquare size={20} className="text-[#34D399]" /> Lead Qualifier
          </p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10">
          <RotateCcw size={12} /> New Lead
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 glass rounded-2xl p-5 overflow-y-auto space-y-4 min-h-0">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'gradient-teal text-[#0A0A0A] font-medium'
                  : 'bg-white/5 text-white/80 border border-white/8'
              }`}>
                {msg.content || (isLoading && i === messages.length - 1 ? (
                  <span className="inline-block w-1.5 h-4 bg-[#34D399] animate-pulse" />
                ) : '')}
                {isLoading && i === messages.length - 1 && msg.content && (
                  <span className="inline-block w-1.5 h-4 bg-[#34D399] ml-0.5 animate-pulse" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {error && <p className="text-red-400 text-xs text-center">{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Type a message..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#34D399]/40 transition-all" />
        <button onClick={() => handleSend()} disabled={isLoading || !input.trim()}
          className="w-11 h-11 gradient-teal rounded-xl flex items-center justify-center text-[#0A0A0A] hover:opacity-90 transition-all disabled:opacity-40">
          {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
      <p className="text-white/20 text-xs text-center">AI qualifies leads based on budget, timeline, goals & decision authority</p>
    </div>
  )
}
