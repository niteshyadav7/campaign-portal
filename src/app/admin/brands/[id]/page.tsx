import { ArrowLeft, CalendarDays, Users, Shield, UserCheck } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { CreateBrandUserDialog } from '@/components/create-brand-user-dialog'
import { EditUserPasswordDialog } from '@/components/edit-user-password-dialog'
import { createClient } from '@/lib/server'
import { EmptyState, InitialAvatar, MetricCard, PageHeader, PageSurface, StatusPill } from '@/components/premium-ui'

export default async function BrandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (!brand) notFound()

  const { data: teamMembers } = await supabase
    .from('profiles')
    .select('*')
    .eq('brand_id', id)
    .order('created_at', { ascending: false })

  const roleLabels: Record<string, string> = {
    brand_admin: 'Admin',
    brand_user: 'Member',
    super_admin: 'Super Admin',
  }

  const dynamicFields = Object.entries((brand.extra_fields || {}) as Record<string, string>)

  const stats = {
    total: teamMembers?.length || 0,
    admins: teamMembers?.filter(m => m.role === 'brand_admin').length || 0,
    members: teamMembers?.filter(m => m.role === 'brand_user').length || 0,
  }

  return (
    <PageSurface>
      <div>
        <Link
          href="/admin/brands"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-600 transition-colors hover:text-teal-700"
        >
          <ArrowLeft className="size-4" />
          Back to Brands
        </Link>
      </div>

      <PageHeader
        eyebrow="Brand Workspace Details"
        title={brand.name}
        description="Review workspace configurations and manage the team members who have access to this brand."
        action={<CreateBrandUserDialog brandId={brand.id} brandName={brand.name} />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard title="Total Team size" value={stats.total} detail="Active users" icon={Users} tone="slate" />
        <MetricCard title="Admins" value={stats.admins} detail="Can invite/manage members" icon={Shield} tone="blue" />
        <MetricCard title="Members" value={stats.members} detail="Shortlist reviewer role" icon={UserCheck} tone="emerald" />
      </div>

      {dynamicFields.length > 0 && (
        <Card className="border-white/70 bg-white/90 shadow-sm">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-3">Workspace Meta Info</h3>
            <div className="flex flex-wrap gap-2">
              {dynamicFields.map(([key, value]) => (
                <span key={key} className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-sm font-medium text-violet-700">
                  {key}: {value}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-2">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Team access management</h2>

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
                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="flex items-center gap-2 text-sm text-slate-500">
                      <CalendarDays className="size-4" />
                      Joined {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <EditUserPasswordDialog
                      userId={member.id}
                      userEmail={member.full_name || ''}
                      userName={member.full_name || 'Team Member'}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Users}
            title="No users added yet"
            description="Invite teammates so they can access this brand workspace."
            action={<CreateBrandUserDialog brandId={brand.id} brandName={brand.name} />}
          />
        )}
      </div>
    </PageSurface>
  )
}
