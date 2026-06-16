import { CalendarClock, Hourglass, MapPin, Phone, UserCheck, UserMinus, Users } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { InfluencerStatusActions } from '@/components/influencer-status-actions'
import { InfluencerCommentSection } from '@/components/influencer-comment-section'
import { createClient } from '@/lib/server'
import { EmptyState, InitialAvatar, MetricCard, PageHeader, PageSurface, StatusPill } from '@/components/premium-ui'
import { ExportShortlistButton } from '@/components/export-shortlist-button'
import type { Influencer, Profile } from '@/lib/types'

type CampaignInfluencerView = {
  campaign_id: string
  influencer_id: string
  status: keyof typeof statusConfig
  updated_at: string
  comment: string | null
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

export default async function BrandCampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
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

  const renderInfluencerCard = (ci: CampaignInfluencerView) => (
    <Card key={ci.influencer_id} className="overflow-hidden border-white/70 bg-white/90 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/10">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <InitialAvatar name={ci.influencers?.name} tone="blue" size="lg" />
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900">{ci.influencers?.name}</h3>
              {ci.influencers?.instagram_url ? (
                <a
                  href={ci.influencers.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-700 hover:text-blue-900"
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

        <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="text-xs text-slate-500">Followers</p>
            <p className="mt-1 font-semibold text-slate-900">{formatFollowers(ci.influencers?.followers || 0)}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="size-3.5" />
              Location
            </p>
            <p className="mt-1 truncate font-semibold text-slate-900">{ci.influencers?.location || '-'}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <Phone className="size-3.5" />
              Contact
            </p>
            <p className="mt-1 truncate font-semibold text-slate-900">{ci.influencers?.contact_number || '-'}</p>
          </div>
        </div>

        {ci.influencers?.extra_fields && Object.keys(ci.influencers.extra_fields).length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
            {Object.entries(ci.influencers.extra_fields).map(([key, value]) => {
              if (!value) return null
              return (
                <span
                  key={key}
                  className="rounded-full bg-slate-50 border border-slate-150 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                >
                  {key}: {value}
                </span>
              )
            })}
          </div>
        )}

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

        <InfluencerCommentSection
          campaignId={ci.campaign_id}
          influencerId={ci.influencer_id}
          initialComment={ci.comment}
        />
      </CardContent>
    </Card>
  )

  const shortlistedCreators = (campaignInfluencers || [])
    .filter(ci => ci.status === 'shortlisted')
    .map(ci => ({
      name: ci.influencers?.name || 'Unknown',
      handle: ci.influencers?.instagram_url
        ? `@${ci.influencers.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}`
        : 'N/A',
      followers: ci.influencers?.followers || 0,
      location: ci.influencers?.location || 'N/A',
      contact: ci.influencers?.contact_number || 'N/A',
    }))

  return (
    <PageSurface>
      <PageHeader
        eyebrow={(campaign as any).brands?.name || 'Creator review'}
        title={campaign.name}
        description="Compare the proposed creators and choose who should move forward."
        action={<ExportShortlistButton campaignName={campaign.name} creators={shortlistedCreators} />}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard title="Total" value={stats.total} detail="Presented creators" icon={Users} tone="slate" />
        <MetricCard title="Pending" value={stats.pending} detail="Needs review" icon={Hourglass} tone="amber" />
        <MetricCard title="Shortlisted" value={stats.shortlisted} detail="Selected" icon={UserCheck} tone="emerald" />
        <MetricCard title="Rejected" value={stats.rejected} detail="Passed" icon={UserMinus} tone="rose" />
      </div>

      {campaignInfluencers && campaignInfluencers.length > 0 ? (
        <Tabs defaultValue="all" className="space-y-5">
          <TabsList className="border border-white/70 bg-white/80 p-1 shadow-sm">
            <TabsTrigger value="all" className="cursor-pointer rounded-md data-[state=active]:bg-teal-700 data-[state=active]:text-white">
              All ({stats.total})
            </TabsTrigger>
            <TabsTrigger value="pending" className="cursor-pointer rounded-md data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Pending ({stats.pending})
            </TabsTrigger>
            <TabsTrigger value="shortlisted" className="cursor-pointer rounded-md data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Shortlisted ({stats.shortlisted})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="cursor-pointer rounded-md data-[state=active]:bg-rose-600 data-[state=active]:text-white">
              Rejected ({stats.rejected})
            </TabsTrigger>
          </TabsList>

          {[
            { value: 'all', items: campaignInfluencers },
            { value: 'pending', items: campaignInfluencers.filter(ci => ci.status === 'pending') },
            { value: 'shortlisted', items: campaignInfluencers.filter(ci => ci.status === 'shortlisted') },
            { value: 'rejected', items: campaignInfluencers.filter(ci => ci.status === 'rejected') },
          ].map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.items.length > 0 ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {tab.items.map(renderInfluencerCard)}
                </div>
              ) : (
                <EmptyState
                  icon={Users}
                  title="Nothing here yet"
                  description="Creator decisions will appear in this view as they are updated."
                />
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <EmptyState
          icon={Users}
          title="No influencers proposed"
          description="Your agency has not added creators to this campaign yet."
        />
      )}
    </PageSurface>
  )
}
