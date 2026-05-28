'use client'
import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'
import type { Profile } from '@/types'
import { getInitials } from '@/lib/utils'

const PAGE_TITLES: Record<string, string> = {
  '/overview': 'Overview',
  '/revenue': 'Revenue Dashboard',
  '/crm': 'CRM',
  '/agreements': 'Agreements',
  '/ai-tools': 'AI Tools',
  '/ai-tools/content-generator': 'Content Generator',
  '/ai-tools/growth-advisor': 'Growth Advisor',
  '/ai-tools/report-generator': 'Report Generator',
  '/ai-tools/lead-qualifier': 'Lead Qualifier',
}

export function TopBar({ profile }: { profile: Profile | null }) {
  const pathname = usePathname()
  const title = PAGE_TITLES[pathname] ?? 'Dashboard'
  const initials = profile?.full_name ? getInitials(profile.full_name) : '?'

  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-[#0A0A0A] flex-shrink-0">
      <div>
        <h1 className="text-white font-light text-lg tracking-wide">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/10 transition-all relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#4DD9D9]" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-teal flex items-center justify-center text-[#0A0A0A] text-xs font-bold">
            {initials}
          </div>
          {profile && (
            <div className="hidden md:block">
              <p className="text-white/80 text-xs font-light">{profile.full_name}</p>
              <p className="text-white/30 text-[10px]">{profile.agency_name}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
