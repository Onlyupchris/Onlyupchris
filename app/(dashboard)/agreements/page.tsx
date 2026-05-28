import { createClient } from '@/lib/supabase/server'
import { AgreementsClient } from './AgreementsClient'

export default async function AgreementsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: agreements }, { data: clients }] = await Promise.all([
    supabase.from('agreements').select('*, client:clients(name, company)').eq('user_id', user!.id).order('created_at', { ascending: false }),
    supabase.from('clients').select('id, name, company').eq('user_id', user!.id),
  ])

  return <AgreementsClient initialAgreements={agreements ?? []} clients={clients ?? []} userId={user!.id} />
}
