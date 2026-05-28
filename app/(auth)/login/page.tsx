'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { RivoniaLogo } from '@/components/brand/RivoniaLogo'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/overview')
      router.refresh()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      {/* Mobile logo */}
      <div className="flex justify-center mb-8 lg:hidden">
        <RivoniaLogo size="md" />
      </div>

      <div className="glass rounded-2xl p-8 glow-teal">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-white tracking-wide">Welcome back</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to your agency dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs text-white/50 tracking-widest uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@agency.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4DD9D9]/50 focus:bg-white/8 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs text-white/50 tracking-widest uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4DD9D9]/50 focus:bg-white/8 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full gradient-teal text-[#0A0A0A] font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#4DD9D9] hover:text-[#7BE8E8] transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  )
}
