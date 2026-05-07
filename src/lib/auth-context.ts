import { cache } from 'react'
import { createClient } from '@/lib/server'

export const getCurrentUserProfile = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { supabase, user: null, profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, brands(name)')
    .eq('id', user.id)
    .single()

  return { supabase, user, profile }
})
