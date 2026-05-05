import { createClient } from '@/lib/server'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { AddInfluencerToCampaign } from '@/components/add-influencer-to-campaign'
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

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: campaign } = await supabase
    .from('campaigns')
    .select('*, brands(name)')
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-zinc-900">{campaign.name}</h1>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              {campaign.status}
            </Badge>
          </div>
          <p className="text-zinc-600 font-medium">Brand: {(campaign as any).brands?.name}</p>
        </div>
        <AddInfluencerToCampaign campaignId={id} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-zinc-900' },
          { label: 'Pending', value: stats.pending, color: 'text-amber-600' },
          { label: 'Shortlisted', value: stats.shortlisted, color: 'text-emerald-600' },
          { label: 'Rejected', value: stats.rejected, color: 'text-red-600' },
        ].map((s) => (
          <Card key={s.label} className="bg-white border-zinc-200 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-1 font-medium">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Influencer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaignInfluencers?.map((ci: any) => (
          <Card key={ci.influencer_id} className="bg-white border-zinc-200 hover:border-violet-300 transition-all duration-300 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {ci.influencers?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-900 text-sm">{ci.influencers?.name}</h3>
                    {ci.influencers?.instagram_url && (
                      <a
                        href={ci.influencers.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-violet-600 hover:text-violet-700 font-medium"
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

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100">
                  <span className="text-zinc-500">Followers</span>
                  <p className="text-zinc-900 font-medium mt-0.5">{formatFollowers(ci.influencers?.followers || 0)}</p>
                </div>
                <div className="bg-zinc-50 rounded-lg px-3 py-2 border border-zinc-100">
                  <span className="text-zinc-500">Location</span>
                  <p className="text-zinc-900 font-medium mt-0.5">{ci.influencers?.location || '—'}</p>
                </div>
              </div>

              {/* Audit Trail */}
              {ci.profiles?.full_name && (
                <p className="text-xs text-zinc-500 mb-3">
                  Updated by <span className="font-medium text-zinc-700">{ci.profiles.full_name}</span>
                  {' '}{new Date(ci.updated_at).toLocaleDateString()}
                </p>
              )}

              <InfluencerStatusActions
                campaignId={ci.campaign_id}
                influencerId={ci.influencer_id}
                currentStatus={ci.status}
              />
            </CardContent>
          </Card>
        ))}

        {(!campaignInfluencers || campaignInfluencers.length === 0) && (
          <div className="col-span-full text-center py-16">
            <p className="text-zinc-600 font-medium">No influencers assigned</p>
            <p className="text-zinc-400 text-sm mt-1">Click &quot;Add Influencer&quot; to assign influencers to this campaign</p>
          </div>
        )}
      </div>
    </div>
  )
}
