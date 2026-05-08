import { Building2, FileText, Users, Zap } from 'lucide-react'
import { createClient } from '@/lib/server'
import { GlassPanel, MetricCard, PageHeader, PageSurface } from '@/components/premium-ui'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: brandsCount },
    { count: campaignsCount },
    { count: influencersCount },
  ] = await Promise.all([
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('campaigns').select('*', { count: 'exact', head: true }),
    supabase.from('influencers').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    {
      title: 'Total brands',
      value: brandsCount || 0,
      detail: 'Client workspaces',
      icon: Building2,
      tone: 'violet' as const,
    },
    {
      title: 'Campaigns',
      value: campaignsCount || 0,
      detail: 'Briefs in motion',
      icon: FileText,
      tone: 'blue' as const,
    },
    {
      title: 'Creator pool',
      value: influencersCount || 0,
      detail: 'Available talent',
      icon: Users,
      tone: 'emerald' as const,
    },
  ]

  return (
    <PageSurface>
      <PageHeader
        eyebrow="Agency overview"
        title="Campaign command center"
        description="A focused view of your client brands, active campaigns, and creator inventory."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <MetricCard key={stat.title} {...stat} />
        ))}
      </div>

      <GlassPanel className="overflow-hidden bg-white/[0.84] text-slate-800">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/10">
              <Zap className="size-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-normal text-slate-900">Operational flow</h2>
              <p className="text-sm font-medium text-slate-500">From client setup to creator approvals.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            {['Create brand', 'Launch campaign', 'Add creators', 'Track decisions'].map((item, index) => (
              <div key={item} className="rounded-lg border border-emerald-100 bg-emerald-50/55 p-4">
                <p className="text-xs font-medium text-teal-700">0{index + 1}</p>
                <p className="mt-2 text-sm font-medium text-slate-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </GlassPanel>
    </PageSurface>
  )
}
