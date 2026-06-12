import { CalendarClock, MapPin, Users, UserCheck, UserMinus, Hourglass } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { AddInfluencerToCampaign } from '@/components/add-influencer-to-campaign'
import { InfluencerStatusActions } from '@/components/influencer-status-actions'
import { EditCampaignDialog } from '@/components/edit-campaign-dialog'
import { DeleteCampaignDialog } from '@/components/delete-campaign-dialog'
import { createClient } from '@/lib/server'
import { EmptyState, InitialAvatar, MetricCard, PageHeader, PageSurface, StatusPill } from '@/components/premium-ui'
import type { Influencer, Profile } from '@/lib/types'

type CampaignWithBrand = {
  id: string
  name: string
  brand_id: string
  status: string
  brands?: {
    name: string | null
  } | null
}

type CampaignInfluencerView = {
  campaign_id: string
  influencer_id: string
  status: keyof typeof statusConfig
  updated_at: string
  influencers?: Influencer | null
  profiles?: Pick<Profile, 'full_name'> | null
}

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

const statusConfig = {
  pending: { label: 'Pending', tone: 'amber' as const },
  shortlisted: { label: 'Shortlisted', tone: 'emerald' as const },
  rejected: { label: 'Rejected', tone: 'rose' as const },
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

  const camp = campaign as CampaignWithBrand

  return (
    <PageSurface>
      <PageHeader
        eyebrow={camp.brands?.name || 'Campaign'}
        title={camp.name}
        description="Curate the proposed creator list and monitor brand approval decisions."
        action={
          <div className="flex flex-wrap gap-2">
            <EditCampaignDialog
              campaignId={camp.id}
              currentName={camp.name}
              currentBrandId={camp.brand_id}
              currentStatus={camp.status}
            />
            <DeleteCampaignDialog campaignId={camp.id} campaignName={camp.name} />
            <AddInfluencerToCampaign campaignId={id} />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard title="Total" value={stats.total} detail="Assigned creators" icon={Users} tone="slate" />
        <MetricCard title="Pending" value={stats.pending} detail="Awaiting decision" icon={Hourglass} tone="amber" />
        <MetricCard title="Shortlisted" value={stats.shortlisted} detail="Approved by brand" icon={UserCheck} tone="emerald" />
        <MetricCard title="Rejected" value={stats.rejected} detail="Not selected" icon={UserMinus} tone="rose" />
      </div>

      {campaignInfluencers && campaignInfluencers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(campaignInfluencers as CampaignInfluencerView[]).map((ci) => (
            <Card key={ci.influencer_id} className="overflow-hidden border-white/70 bg-white/90 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-violet-900/10">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <InitialAvatar name={ci.influencers?.name} tone="violet" size="lg" />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-900">{ci.influencers?.name}</h3>
                      {ci.influencers?.instagram_url ? (
                        <a
                          href={ci.influencers.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-violet-700 hover:text-violet-900"
                        >
                          @{ci.influencers.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                        </a>
                      ) : null}
                    </div>
                  </div>
                  <StatusPill tone={statusConfig[ci.status as keyof typeof statusConfig]?.tone || 'slate'}>
                    {statusConfig[ci.status as keyof typeof statusConfig]?.label || ci.status}
                  </StatusPill>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="text-xs text-slate-500">Followers</p>
                    <p className="mt-1 font-semibold text-slate-900">{formatFollowers(ci.influencers?.followers || 0)}</p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="size-3.5" />
                      Location
                    </p>
                    <p className="mt-1 font-semibold text-slate-900">{ci.influencers?.location || '-'}</p>
                  </div>
                </div>

                {ci.profiles?.full_name ? (
                  <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                    <CalendarClock className="size-3.5" />
                    Updated by <span className="font-semibold text-slate-700">{ci.profiles.full_name}</span>
                    on {new Date(ci.updated_at).toLocaleDateString()}
                  </p>
                ) : null}

                <div className="mt-4">
                  <InfluencerStatusActions
                    campaignId={ci.campaign_id}
                    influencerId={ci.influencer_id}
                    currentStatus={ci.status}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No influencers assigned"
          description="Add creators from your master pool to prepare this campaign for client review."
          action={<AddInfluencerToCampaign campaignId={id} />}
        />
      )}
    </PageSurface>
  )
}
