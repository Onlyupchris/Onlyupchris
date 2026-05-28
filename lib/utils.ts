import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'ZAR') {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(num: number) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    active: 'text-emerald-400 bg-emerald-400/10',
    prospect: 'text-blue-400 bg-blue-400/10',
    at_risk: 'text-amber-400 bg-amber-400/10',
    churned: 'text-red-400 bg-red-400/10',
    draft: 'text-gray-400 bg-gray-400/10',
    sent: 'text-blue-400 bg-blue-400/10',
    signed: 'text-emerald-400 bg-emerald-400/10',
    expired: 'text-red-400 bg-red-400/10',
    lead: 'text-purple-400 bg-purple-400/10',
    qualified: 'text-blue-400 bg-blue-400/10',
    proposal: 'text-amber-400 bg-amber-400/10',
    negotiation: 'text-orange-400 bg-orange-400/10',
    closed_won: 'text-emerald-400 bg-emerald-400/10',
    closed_lost: 'text-red-400 bg-red-400/10',
  }
  return map[status] ?? 'text-gray-400 bg-gray-400/10'
}
