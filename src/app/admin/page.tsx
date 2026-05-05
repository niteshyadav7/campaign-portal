import { createClient } from '@/lib/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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
      title: 'Total Brands',
      value: brandsCount || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      gradient: 'from-violet-500 to-purple-600',
      shadow: 'shadow-violet-500/20',
    },
    {
      title: 'Active Campaigns',
      value: campaignsCount || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
      shadow: 'shadow-blue-500/20',
    },
    {
      title: 'Influencer Pool',
      value: influencersCount || 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      gradient: 'from-emerald-500 to-green-500',
      shadow: 'shadow-emerald-500/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-900">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Overview of your influencer campaign portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-white border-zinc-200 hover:border-zinc-300 transition-all duration-300 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">{stat.title}</CardTitle>
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg ${stat.shadow}`}>
                <span className="text-white">{stat.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-zinc-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
