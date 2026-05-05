import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { BrandSidebar } from '@/components/brand-sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, brands(name)')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'super_admin') redirect('/admin')

  return (
    <div className="flex h-screen bg-zinc-50">
      <BrandSidebar user={user} profile={profile} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
