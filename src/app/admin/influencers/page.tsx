import { Sparkles, TrendingUp, Users } from 'lucide-react'
import { CreateInfluencerDialog } from '@/components/create-influencer-dialog'
import { BulkImportInfluencersDialog } from '@/components/bulk-import-influencers-dialog'
import { InfluencerPoolTable } from '@/components/influencer-pool-table'
import { createClient } from '@/lib/server'
import { EmptyState, GlassPanel, PageHeader, PageSurface } from '@/components/premium-ui'

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export default async function InfluencersPage() {
  const supabase = await createClient()

  const { data: influencers } = await supabase
    .from('influencers')
    .select('*')
    .order('created_at', { ascending: false })

  const totalFollowers = influencers?.reduce((sum, influencer) => sum + (influencer.followers || 0), 0) || 0
  const topCreator = influencers?.reduce((top, influencer) => {
    if (!top || influencer.followers > top.followers) return influencer
    return top
  }, influencers?.[0])

  return (
    <PageSurface>
      <PageHeader
        eyebrow="Creator database"
        title="Influencer pool"
        description="Maintain the master creator list used to assemble shortlists for every brand campaign."
        action={
          <div className="flex flex-wrap gap-2">
            <BulkImportInfluencersDialog />
            <CreateInfluencerDialog />
          </div>
        }
      />

      {influencers && influencers.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-[360px_1fr]">
          <GlassPanel className="overflow-hidden bg-white/[0.84] text-slate-800">
            <div className="premium-grid p-6">
              <div className="flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-900/10">
                <Sparkles className="size-6" />
              </div>
              <p className="mt-8 text-xs font-semibold uppercase text-teal-700">
                Talent intelligence
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight tracking-normal text-slate-900">
                Creator pool at a glance.
              </h2>
              <div className="mt-7 grid gap-3">
                <div className="rounded-lg border border-emerald-100 bg-emerald-50/55 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Total reach</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-900">{formatFollowers(totalFollowers)}</p>
                </div>
                <div className="rounded-lg border border-sky-100 bg-sky-50/55 p-4">
                  <p className="text-xs font-semibold uppercase text-slate-500">Top creator</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{topCreator?.name || 'N/A'}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatFollowers(topCreator?.followers || 0)} followers</p>
                </div>
              </div>
            </div>
          </GlassPanel>

          <GlassPanel className="overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-200 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase text-teal-700">Master database</p>
                <h2 className="mt-1 text-xl font-semibold text-slate-900">Creators ready for shortlisting</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                <TrendingUp className="size-4" />
                {influencers.length} profiles
              </div>
            </div>
            <InfluencerPoolTable initialInfluencers={influencers || []} />
          </GlassPanel>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No influencers added yet"
          description="Add creators to your master pool so they can be assigned to brand campaigns."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <BulkImportInfluencersDialog />
              <CreateInfluencerDialog />
            </div>
          }
        />
      )}
    </PageSurface>
  )
}
