'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { RivoniaLogo } from '@/components/brand/RivoniaLogo'
import { Eye, EyeOff, ArrowRight, Loader2, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const supabase = createClient()
  const [form, setForm] = useState({ fullName: '', agencyName: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.fullName, agency_name: form.agencyName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 3000)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <div className="glass rounded-2xl p-10 glow-teal">
          <CheckCircle size={48} className="text-[#4DD9D9] mx-auto mb-4" />
          <h2 className="text-xl text-white font-light mb-2">Check your email</h2>
          <p className="text-white/40 text-sm">We sent a confirmation link to <span className="text-[#4DD9D9]">{form.email}</span></p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md"
    >
      <div className="flex justify-center mb-8 lg:hidden">
        <RivoniaLogo size="md" />
      </div>

      <div className="glass rounded-2xl p-8 glow-teal">
        <div className="mb-8">
          <h1 className="text-2xl font-light text-white tracking-wide">Get started</h1>
          <p className="text-white/40 text-sm mt-1">Create your Rivonia AI workspace</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {[
            { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Chris Dickson' },
            { key: 'agencyName', label: 'Agency Name', type: 'text', placeholder: 'Rivonia AI' },
            { key: 'email', label: 'Email', type: 'email', placeholder: 'you@agency.com' },
          ].map(field => (
            <div key={field.key} className="space-y-2">
              <label className="text-xs text-white/50 tracking-widest uppercase">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                required
                placeholder={field.placeholder}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all"
              />
            </div>
          ))}

          <div className="space-y-2">
            <label className="text-xs text-white/50 tracking-widest uppercase">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={8}
                placeholder="Min. 8 characters"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 text-sm focus:outline-none focus:border-[#4DD9D9]/50 transition-all pr-12"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={loading} className="w-full gradient-teal text-[#0A0A0A] font-medium py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 mt-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={16} /></>}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#4DD9D9] hover:text-[#7BE8E8] transition-colors">Sign in</Link>
        </p>
      </div>
    </motion.div>
  )
}
