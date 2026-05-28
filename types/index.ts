export type Profile = {
  id: string
  email: string
  full_name: string | null
  agency_name: string | null
  avatar_url: string | null
  plan: 'starter' | 'pro' | 'enterprise'
  created_at: string
}

export type Client = {
  id: string
  user_id: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  status: 'prospect' | 'active' | 'at_risk' | 'churned'
  monthly_value: number
  start_date: string | null
  notes: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

export type Deal = {
  id: string
  user_id: string
  client_id: string | null
  title: string
  value: number
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
  probability: number
  close_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
  client?: Client | null
}

export type Agreement = {
  id: string
  user_id: string
  client_id: string | null
  title: string
  content: string
  status: 'draft' | 'sent' | 'signed' | 'expired'
  sent_at: string | null
  signed_at: string | null
  expires_at: string | null
  signer_name: string | null
  signer_email: string | null
  created_at: string
  updated_at: string
  client?: Client | null
}

export type RevenueEntry = {
  id: string
  user_id: string
  client_id: string | null
  amount: number
  type: 'recurring' | 'one_time' | 'refund'
  month: number
  year: number
  description: string | null
  created_at: string
}

export type MonthlyRevenue = {
  month: string
  mrr: number
  oneTime: number
  total: number
}

export type KPIData = {
  totalMRR: number
  mrrChange: number
  activeClients: number
  clientChange: number
  openDeals: number
  dealValue: number
  healthScore: number
}
