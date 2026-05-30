'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { RivoniaLogo } from '@/components/brand/RivoniaLogo'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, TrendingUp, Users, FileText, Sparkles,
  ChevronLeft, ChevronRight, LogOut, Pen, BarChart3,
  MessageSquare, ChevronDown, ChevronUp, X,
} from 'lucide-react'
import type { Profile } from '@/types'

const NAV_ITEMS = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Revenue', href: '/revenue', icon: TrendingUp },
  { label: 'CRM', href: '/crm', icon: Users },
  { label: 'Agreements', href: '/agreements', icon: FileText },
]

const AI_SUBITEMS = [
  { label: 'Content Generator', href: '/ai-tools/content-generator', icon: Pen },
  { label: 'Growth Advisor', href: '/ai-tools/growth-advisor', icon: TrendingUp },
  { label: 'Report Generator', href: '/ai-tools/report-generator', icon: BarChart3 },
  { label: 'Lead Qualifier', href: '/ai-tools/lead-qualifier', icon: MessageSquare },
]

export function Sidebar({ profile, onClose }: { profile: Profile | null; onClose?: () => void }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [collapsed, setCollapsed] = useState(false)
  const [aiExpanded, setAiExpanded] = useState(pathname.startsWith('/ai-tools'))

  const isAiActive = pathname.startsWith('/ai-tools')
  const isMobile = !!onClose

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <motion.aside
      animate={{ width: collapsed && !isMobile ? 64 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="flex flex-col h-screen bg-[#0D0D0D] border-r border-white/5 overflow-hidden flex-shrink-0"
    >
      {/* Logo row */}
      <div className="flex items-center justify-between px-4 h-14 md:h-16 border-b border-white/5 flex-shrink-0">
        <AnimatePresence mode="wait">
          {(!collapsed || isMobile) ? (
            <motion.div
              key="full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-3"
            >
              <RivoniaLogo size="xs" showText={false} />
              <div>
                <p className="text-white text-sm font-light tracking-[0.15em]" style={{ fontFamily: 'Georgia, serif' }}>
                  RIVONIA
                </p>
                <p className="text-[#4DD9D9] text-[10px] tracking-[0.4em]">AI</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <RivoniaLogo size="xs" showText={false} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative',
                active
                  ? 'bg-[#4DD9D9]/10 text-[#4DD9D9]'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/5'
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#4DD9D9] rounded-full"
                />
              )}
              <item.icon size={18} className="flex-shrink-0" />
              {(!collapsed || isMobile) && (
                <span className="text-sm font-light tracking-wide">{item.label}</span>
              )}
            </Link>
          )
        })}

        {/* AI Tools */}
        <div>
          <button
            onClick={() => setAiExpanded(!aiExpanded)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
              isAiActive
                ? 'bg-[#4DD9D9]/10 text-[#4DD9D9]'
                : 'text-white/40 hover:text-white/80 hover:bg-white/5'
            )}
          >
            <Sparkles size={18} className="flex-shrink-0" />
            {(!collapsed || isMobile) && (
              <>
                <span className="text-sm font-light tracking-wide flex-1 text-left">AI Tools</span>
                {aiExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </>
            )}
          </button>

          <AnimatePresence>
            {aiExpanded && (!collapsed || isMobile) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden ml-4 mt-1 space-y-1 border-l border-white/10 pl-3"
              >
                {AI_SUBITEMS.map(item => {
                  const active = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        'flex items-center gap-2 px-2 py-2 rounded-lg transition-all text-xs',
                        active ? 'text-[#4DD9D9]' : 'text-white/30 hover:text-white/70'
                      )}
                    >
                      <item.icon size={14} />
                      {item.label}
                    </Link>
                  )
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/5 p-3 space-y-1">
        {(!collapsed || isMobile) && profile && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white/70 text-xs font-light truncate">{profile.full_name}</p>
            <p className="text-white/30 text-[10px] truncate">{profile.agency_name || 'Agency'}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/30 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || isMobile) && <span className="text-xs">Sign Out</span>}
        </button>
        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center px-3 py-2 rounded-xl text-white/20 hover:text-white/50 hover:bg-white/5 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>
    </motion.aside>
  )
}
