import { ExternalLink, MapPin, Phone, Sparkles, TrendingUp, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateInfluencerDialog } from '@/components/create-influencer-dialog'
import { BulkImportInfluencersDialog } from '@/components/bulk-import-influencers-dialog'
import { createClient } from '@/lib/server'
import { EmptyState, GlassPanel, InitialAvatar, PageHeader, PageSurface } from '@/components/premium-ui'

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
            <Table>
              <TableHeader>
                <TableRow className="border-slate-200 bg-slate-50/90 hover:bg-slate-50/90">
                  <TableHead className="h-12 px-5 text-xs font-semibold uppercase text-slate-500">Creator</TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase text-slate-500 hidden sm:table-cell">Instagram</TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase text-slate-500">Reach</TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase text-slate-500 hidden md:table-cell">Market</TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase text-slate-500 hidden lg:table-cell">Contact</TableHead>
                  <TableHead className="h-12 text-xs font-semibold uppercase text-slate-500 hidden xl:table-cell">Custom</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {influencers.map((influencer) => {
                  const extraFields = Object.entries(influencer.extra_fields || {})

                  return (
                  <TableRow key={influencer.id} className="border-slate-100 hover:bg-emerald-50/30">
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <InitialAvatar name={influencer.name} tone="emerald" size="md" />
                        <div>
                          <span className="font-semibold text-slate-900">{influencer.name}</span>
                          <p className="text-xs font-medium text-slate-500">Influencer profile</p>
                          {/* Stacked info visible only on small screens */}
                          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500 sm:hidden">
                            {influencer.instagram_url && (
                              <a
                                href={influencer.instagram_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:underline"
                              >
                                @{influencer.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                              </a>
                            )}
                            {influencer.location && (
                              <>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-0.5">
                                  <MapPin className="size-3" />
                                  {influencer.location}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {influencer.instagram_url ? (
                        <a
                          href={influencer.instagram_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
                        >
                          @{influencer.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="rounded-full border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">
                        {formatFollowers(influencer.followers)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-slate-400" />
                        {influencer.location || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-slate-600 hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="size-3.5 text-slate-400" />
                        {influencer.contact_number || '-'}
                      </span>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {extraFields.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {extraFields.slice(0, 2).map(([key]) => (
                            <span key={key} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600">
                              {key}
                            </span>
                          ))}
                          {extraFields.length > 2 ? (
                            <span className="rounded-full bg-teal-600 px-2 py-1 text-xs font-medium text-white">
                              +{extraFields.length - 2}
                            </span>
                          ) : null}
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                  )
                })}
              </TableBody>
            </Table>
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
