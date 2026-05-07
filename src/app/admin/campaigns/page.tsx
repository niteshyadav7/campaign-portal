import Link from 'next/link'
import { Building2, CalendarDays, FileText } from 'lucide-react'
import { BulkImportCampaignsDialog } from '@/components/bulk-import-campaigns-dialog'
import { CreateCampaignDialog } from '@/components/create-campaign-dialog'
import { createClient } from '@/lib/server'
import { EmptyState, PageHeader, PageSurface, PremiumActionCard } from '@/components/premium-ui'

type CampaignWithBrand = {
  id: string
  name: string
  status: string
  extra_fields?: Record<string, string> | null
  created_at: string
  brands?: {
    name: string | null
  } | null
}

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, brands(name)')
    .order('created_at', { ascending: false })

  return (
    <PageSurface>
      <PageHeader
        eyebrow="Campaign pipeline"
        title="Campaigns"
        description="Build influencer shortlists for each brand and track client decisions from one workspace."
        action={
          <div className="flex flex-wrap gap-2">
            <BulkImportCampaignsDialog />
            <CreateCampaignDialog />
          </div>
        }
      />

      {campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(campaigns as CampaignWithBrand[]).map((campaign) => {
            const dynamicFields = Object.entries(campaign.extra_fields || {}).slice(0, 4)

            return (
              <Link key={campaign.id} href={`/admin/campaigns/${campaign.id}`} className="group">
                <PremiumActionCard
                  icon={FileText}
                  eyebrow="Campaign"
                  title={campaign.name}
                  description="Creator shortlist workspace with live client decisions."
                  status={campaign.status}
                  statusTone={campaign.status === 'active' ? 'emerald' : 'slate'}
                  actionLabel="Open campaign"
                  tone="blue"
                  meta={
                    <>
                      <div className="flex items-center gap-2">
                        <Building2 className="size-4" />
                        {campaign.brands?.name || 'Unknown brand'}
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-4" />
                        {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      {dynamicFields.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {dynamicFields.map(([key, value]) => (
                            <span key={key} className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-700">
                              {key}: {value}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </>
                  }
                />
              </Link>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={FileText}
          title="No campaigns yet"
          description="Create your first campaign to begin assigning influencers for client review."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <BulkImportCampaignsDialog />
              <CreateCampaignDialog />
            </div>
          }
        />
      )}
    </PageSurface>
  )
}
