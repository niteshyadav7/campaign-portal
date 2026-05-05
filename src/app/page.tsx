import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get the user's profile to determine their role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'super_admin') {
    redirect('/admin')
  } else {
    redirect('/dashboard')
  }
}
