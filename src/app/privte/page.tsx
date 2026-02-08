import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data: claimsData } = await supabase.auth.getClaims()
  if (!claimsData?.claims) {
    redirect('/login')
  }

  const { data: { user } } = await supabase.auth.getUser()
  return <p>Hello {user?.email ?? 'user'}</p>
}