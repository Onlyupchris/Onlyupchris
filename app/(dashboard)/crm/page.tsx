import { createClient } from '@/lib/supabase/server'
import { CRMClient } from './CRMClient'

export default async function CRMPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: clients }, { data: deals }] = await Promise.all([
    supabase.from('clients').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('deals').select('*, client:clients(name, company)').eq('user_id', user!.id).order('updated_at', { ascending: false }),
  ])

  return <CRMClient initialClients={clients ?? []} initialDeals={deals ?? []} userId={user!.id} />
}
