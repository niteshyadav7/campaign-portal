import { CalendarDays, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { CreateBrandUserDialog } from '@/components/create-brand-user-dialog'
import { createClient } from '@/lib/server'
import { EmptyState, InitialAvatar, PageHeader, PageSurface, StatusPill } from '@/components/premium-ui'

export default async function TeamPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('*')
    .eq('brand_id', profile?.brand_id ?? '')
    .order('created_at', { ascending: false })

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', profile?.brand_id ?? '')
    .single()

  const roleLabels: Record<string, string> = {
    brand_admin: 'Admin',
    brand_user: 'Member',
    super_admin: 'Super Admin',
  }

  return (
    <PageSurface>
      <PageHeader
        eyebrow="Access control"
        title="Team members"
        description="Manage who can access this brand workspace and review campaign recommendations."
        action={profile?.role === 'brand_admin' && brand ? (
          <CreateBrandUserDialog brandId={brand.id} brandName={brand.name} />
        ) : null}
      />

      {teamMembers && teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden border-white/70 bg-white/90 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <InitialAvatar name={member.full_name} tone="blue" size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-900">{member.full_name || 'Unknown user'}</h3>
                    <div className="mt-2">
                      <StatusPill tone={member.role === 'brand_admin' ? 'blue' : 'slate'}>
                        {roleLabels[member.role] || member.role}
                      </StatusPill>
                    </div>
                  </div>
                </div>
                <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays className="size-4" />
                  Joined {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No team members yet"
          description="Invite teammates so campaign reviews are not tied to a single account."
        />
      )}
    </PageSurface>
  )
}
