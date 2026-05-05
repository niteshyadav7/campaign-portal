import { createClient } from '@/lib/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfluencerStatusActions } from '@/components/influencer-status-actions'

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

const statusConfig = {
  pending: { label: 'Pending', className: 'border-amber-200 text-amber-700 bg-amber-50' },
  shortlisted: { label: 'Shortlisted', className: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
  rejected: { label: 'Rejected', className: 'border-red-200 text-red-700 bg-red-50' },
}

export default async function BrandCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single()

  if (!campaign) notFound()

  const { data: campaignInfluencers } = await supabase
    .from('campaign_influencers')
    .select('*, influencers(*), profiles(full_name)')
    .eq('campaign_id', id)
    .order('updated_at', { ascending: false })

  const stats = {
    total: campaignInfluencers?.length || 0,
    shortlisted: campaignInfluencers?.filter(ci => ci.status === 'shortlisted').length || 0,
    rejected: campaignInfluencers?.filter(ci => ci.status === 'rejected').length || 0,
    pending: campaignInfluencers?.filter(ci => ci.status === 'pending').length || 0,
  }

  const renderInfluencerCard = (ci: any) => (
    <Card key={ci.influencer_id} className="bg-white border-zinc-200 hover:border-blue-300 transition-all duration-300 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold shadow-sm">
              {ci.influencers?.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">{ci.influencers?.name}</h3>
              {ci.influencers?.instagram_url && (
                <a
                  href={ci.influencers.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  @{ci.influencers.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                </a>
              )}
            </div>
          </div>
          <Badge variant="outline" className={statusConfig[ci.status as keyof typeof statusConfig]?.className}>
            {statusConfig[ci.status as keyof typeof statusConfig]?.label}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs mb-4">
          <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5 text-center">
            <span className="text-zinc-500 block">Followers</span>
            <p className="text-zinc-900 font-semibold mt-0.5">{formatFollowers(ci.influencers?.followers || 0)}</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5 text-center">
            <span className="text-zinc-500 block">Location</span>
            <p className="text-zinc-900 font-semibold mt-0.5">{ci.influencers?.location || '—'}</p>
          </div>
          <div className="bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2.5 text-center">
            <span className="text-zinc-500 block">Contact</span>
            <p className="text-zinc-900 font-semibold mt-0.5">{ci.influencers?.contact_number || '—'}</p>
          </div>
        </div>

        {/* Audit trail */}
        {ci.profiles?.full_name && (
          <p className="text-xs text-zinc-500 mb-3">
            Updated by <span className="font-medium text-zinc-700">{ci.profiles.full_name}</span>
            {' '}on {new Date(ci.updated_at).toLocaleDateString()}
          </p>
        )}

        <InfluencerStatusActions
          campaignId={ci.campaign_id}
          influencerId={ci.influencer_id}
          currentStatus={ci.status}
        />
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-zinc-900">{campaign.name}</h1>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            {campaign.status}
          </Badge>
        </div>
        <p className="text-zinc-500">Review and shortlist the proposed influencers below</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-zinc-900', bg: 'bg-zinc-50' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((s) => (
          <Card key={s.label} className="bg-white border-zinc-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className={`mx-auto w-16 h-16 flex items-center justify-center rounded-2xl ${s.bg} mb-3`}>
                 <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              </div>
              <p className="text-sm text-zinc-600 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-zinc-100 border border-zinc-200 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 cursor-pointer rounded-md">
            All ({stats.total})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-amber-600 data-[state=active]:shadow-sm text-zinc-500 cursor-pointer rounded-md">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="shortlisted" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600 data-[state=active]:shadow-sm text-zinc-500 cursor-pointer rounded-md">
            Shortlisted ({stats.shortlisted})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm text-zinc-500 cursor-pointer rounded-md">
            Rejected ({stats.rejected})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignInfluencers?.map(renderInfluencerCard)}
          </div>
        </TabsContent>
        <TabsContent value="pending">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignInfluencers?.filter(ci => ci.status === 'pending').map(renderInfluencerCard)}
          </div>
        </TabsContent>
        <TabsContent value="shortlisted">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignInfluencers?.filter(ci => ci.status === 'shortlisted').map(renderInfluencerCard)}
          </div>
        </TabsContent>
        <TabsContent value="rejected">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaignInfluencers?.filter(ci => ci.status === 'rejected').map(renderInfluencerCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
