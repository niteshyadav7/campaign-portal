import { createClient } from '@/lib/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateBrandUserDialog } from '@/components/create-brand-user-dialog'

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
    .eq('brand_id', profile?.brand_id!)
    .order('created_at', { ascending: false })

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', profile?.brand_id!)
    .single()

  const roleLabels: Record<string, string> = {
    brand_admin: 'Admin',
    brand_user: 'Member',
    super_admin: 'Super Admin',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Members</h1>
          <p className="text-zinc-400 mt-1">Manage who can access and review your campaigns</p>
        </div>
        {profile?.role === 'brand_admin' && brand && (
          <CreateBrandUserDialog brandId={brand.id} brandName={brand.name} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teamMembers?.map((member) => (
          <Card key={member.id} className="bg-white/5 border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {(member.full_name || '?')[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">{member.full_name || 'Unknown'}</h3>
                  <Badge variant="outline" className="mt-1 border-blue-500/20 text-blue-400 text-xs">
                    {roleLabels[member.role] || member.role}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-zinc-500 mt-3">
                Joined {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
