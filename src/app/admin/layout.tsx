import { redirect } from 'next/navigation'
import { createClient } from '@/lib/server'
import { AdminSidebar } from '@/components/admin-sidebar'
import { WorkspaceTopbar } from '@/components/workspace-topbar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'super_admin') redirect('/dashboard')

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar user={user} profile={profile} />
      <div className="workspace-shell flex min-w-0 flex-1 flex-col">
        <WorkspaceTopbar workspaceName="1to7 Media" mode="Agency" userEmail={user.email} />
        <main className="min-h-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
