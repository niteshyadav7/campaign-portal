import Link from 'next/link'
import { CalendarDays, FileText } from 'lucide-react'
import { getCurrentUserProfile } from '@/lib/auth-context'
import { EmptyState, PageHeader, PageSurface, PremiumActionCard } from '@/components/premium-ui'

export default async function BrandDashboard() {
  const { supabase, profile } = await getCurrentUserProfile()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*')
    .eq('brand_id', profile?.brand_id ?? '')
    .order('created_at', { ascending: false })

  return (
    <PageSurface>
      <PageHeader
        eyebrow={(profile as any)?.brands?.name || 'Brand review'}
        title="Your campaigns"
        description="Review influencer recommendations, shortlist creators, and keep feedback synced with the agency."
      />

      {campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((campaign) => (
            <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`} className="group">
              <PremiumActionCard
                icon={FileText}
                eyebrow="Brand campaign"
                title={campaign.name}
                description="Review the proposed creator shortlist and approve next steps."
                status={campaign.status}
                statusTone="emerald"
                actionLabel="View influencers"
                tone="blue"
                meta={
                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4" />
                    {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                }
              />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No campaigns yet"
          description="Your agency will assign campaigns here when influencer recommendations are ready."
        />
      )}
    </PageSurface>
  )
}
