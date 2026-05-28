'use client'
import { useState, useCallback } from 'react'

export function useStreamingAI(endpoint: string) {
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const stream = useCallback(async (body: object) => {
    setIsLoading(true)
    setOutput('')
    setError(null)
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(err.error || 'Request failed')
      }
      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setOutput(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error occurred')
    } finally {
      setIsLoading(false)
    }
  }, [endpoint])

  const reset = useCallback(() => {
    setOutput('')
    setError(null)
  }, [])

  return { output, isLoading, error, stream, reset }
}
