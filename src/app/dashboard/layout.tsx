import { redirect } from 'next/navigation'
import { BrandSidebar } from '@/components/brand-sidebar'
import { getCurrentUserProfile } from '@/lib/auth-context'
import { WorkspaceTopbar } from '@/components/workspace-topbar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await getCurrentUserProfile()

  if (!user) redirect('/auth/login')

  if (profile?.role === 'super_admin') redirect('/admin')
  const brandName = profile?.brands?.name || 'Brand Portal'

  return (
    <div className="flex h-screen bg-background">
      <BrandSidebar user={user} profile={profile} />
      <div className="workspace-shell flex min-w-0 flex-1 flex-col">
        <WorkspaceTopbar workspaceName={brandName} mode="Brand" userEmail={user.email} />
        <main className="min-h-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
