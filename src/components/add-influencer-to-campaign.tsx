'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus, Users } from 'lucide-react'
import { addInfluencerToCampaign, bulkAddInfluencersToCampaign } from '@/lib/actions'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { InitialAvatar } from '@/components/premium-ui'
import { PremiumDialogFrame } from '@/components/premium-dialog'
import type { Influencer } from '@/lib/types'

type CampaignInfluencerRef = {
  influencer_id: string
}

export function AddInfluencerToCampaign({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [bulkLoading, setBulkLoading] = useState(false)
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [addedInfluencerIds, setAddedInfluencerIds] = useState<Set<string>>(new Set())
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedNiche, setSelectedNiche] = useState('')
  const [selectedFollowerRange, setSelectedFollowerRange] = useState('all')

  const router = useRouter()

  useEffect(() => {
    if (!open) {
      setSelectedIds(new Set())
      setSearchQuery('')
      setSelectedLocation('')
      setSelectedNiche('')
      setSelectedFollowerRange('all')
      return
    }

    const supabase = createClient()

    Promise.all([
      supabase.from('influencers').select('*').order('name'),
      supabase.from('campaign_influencers').select('influencer_id').eq('campaign_id', campaignId),
    ]).then(([influencersRes, campaignInfluencersRes]) => {
      setInfluencers(influencersRes.data || [])

      const addedIds = new Set(
        ((campaignInfluencersRes.data || []) as CampaignInfluencerRef[]).map((ci) => ci.influencer_id)
      )
      setAddedInfluencerIds(addedIds)
    })
  }, [open, campaignId])

  // Get unique niches dynamically
  const niches = useMemo(() => {
    const set = new Set<string>()
    influencers.forEach((inf) => {
      if (inf.extra_fields) {
        const nicheVal = inf.extra_fields.niche || inf.extra_fields.category || inf.extra_fields.industry
        if (nicheVal) set.add(nicheVal.toString())
      }
    })
    return Array.from(set).sort()
  }, [influencers])

  // Get unique locations dynamically
  const locations = useMemo(() => {
    const set = new Set<string>()
    influencers.forEach((inf) => {
      if (inf.location) set.add(inf.location)
    })
    return Array.from(set).sort()
  }, [influencers])

  // Filter influencers list
  const filteredInfluencers = useMemo(() => {
    return influencers.filter((inf) => {
      // 1. Search Query (Name or Instagram Handle)
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameMatch = inf.name.toLowerCase().includes(query)
        const handleMatch = inf.instagram_url?.toLowerCase().includes(query) || false
        if (!nameMatch && !handleMatch) return false
      }

      // 2. Location
      if (selectedLocation && inf.location !== selectedLocation) {
        return false
      }

      // 3. Niche
      if (selectedNiche) {
        const nicheVal = inf.extra_fields?.niche || inf.extra_fields?.category || inf.extra_fields?.industry
        if (nicheVal !== selectedNiche) return false
      }

      // 4. Followers
      if (selectedFollowerRange !== 'all') {
        const f = inf.followers
        if (selectedFollowerRange === 'under-10k' && f >= 10000) return false
        if (selectedFollowerRange === '10k-50k' && (f < 10000 || f > 50000)) return false
        if (selectedFollowerRange === '50k-100k' && (f < 50000 || f > 100000)) return false
        if (selectedFollowerRange === 'over-100k' && f < 100000) return false
      }

      return true
    })
  }, [influencers, searchQuery, selectedLocation, selectedNiche, selectedFollowerRange])

  const handleAdd = async (influencerId: string) => {
    setLoading(influencerId)
    try {
      await addInfluencerToCampaign(campaignId, influencerId)
      setAddedInfluencerIds((prev) => {
        const next = new Set(prev)
        next.add(influencerId)
        return next
      })
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(influencerId)
        return next
      })
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  const handleBulkAdd = async () => {
    if (selectedIds.size === 0) return
    setBulkLoading(true)
    try {
      const res = await bulkAddInfluencersToCampaign(campaignId, Array.from(selectedIds))
      if (res && res.success) {
        setAddedInfluencerIds((prev) => {
          const next = new Set(prev)
          selectedIds.forEach((id) => next.add(id))
          return next
        })
        setSelectedIds(new Set())
        router.refresh()
      } else {
        console.error(res?.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setBulkLoading(false)
    }
  }

  function formatFollowers(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const nonAddedInfluencers = filteredInfluencers.filter((i) => !addedInfluencerIds.has(i.id))
  const isAllSelected = nonAddedInfluencers.length > 0 && nonAddedInfluencers.every((i) => selectedIds.has(i.id))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:to-teal-400" />}>
        <UserPlus className="mr-2 size-4" />
        Add Influencer
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-4xl">
        <PremiumDialogFrame
          icon={Users}
          eyebrow="Campaign talent"
          title="Add Influencer"
          description="Select creators from your pool to attach to this campaign."
          accent="blue"
        >
          {/* Filters Dashboard */}
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 rounded-lg border border-slate-200 bg-slate-50/60 p-3 shadow-inner shadow-slate-100">
            <div>
              <input
                type="text"
                placeholder="Search name or handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-800 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400"
              />
            </div>
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
              >
                <option value="">All Locations</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
              >
                <option value="">All Niches</option>
                {niches.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={selectedFollowerRange}
                onChange={(e) => setSelectedFollowerRange(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10"
              >
                <option value="all">All Followers</option>
                <option value="under-10k">Under 10K</option>
                <option value="10k-50k">10K - 50K</option>
                <option value="50k-100k">50K - 100K</option>
                <option value="over-100k">100K+</option>
              </select>
            </div>
          </div>

          {nonAddedInfluencers.length > 0 && (
            <div className="mb-4 flex items-center justify-between border-b border-slate-150 pb-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(nonAddedInfluencers.map((i) => i.id)))
                    } else {
                      setSelectedIds(new Set())
                    }
                  }}
                  className="size-4 cursor-pointer rounded border-slate-350 bg-white text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                />
                Select All ({nonAddedInfluencers.length} filtered)
              </label>

              {selectedIds.size > 0 && (
                <Button
                  size="sm"
                  disabled={bulkLoading}
                  onClick={handleBulkAdd}
                  className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2 text-xs font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-400"
                >
                  {bulkLoading ? <Loader2 className="mr-1.5 size-3.5 animate-spin" /> : null}
                  Add Selected ({selectedIds.size})
                </Button>
              )}
            </div>
          )}

          <div className="max-h-[42vh] space-y-2 overflow-y-auto pr-1">
            {filteredInfluencers.map((influencer) => {
              const isAdded = addedInfluencerIds.has(influencer.id)
              const isLoading = loading === influencer.id

              // Find Niche / Category if any to show badge
              const nicheVal = influencer.extra_fields?.niche || influencer.extra_fields?.category || influencer.extra_fields?.category

              return (
                <div
                  key={influencer.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {!isAdded && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(influencer.id)}
                        disabled={isLoading}
                        onChange={(e) => {
                          setSelectedIds((prev) => {
                            const next = new Set(prev)
                            if (e.target.checked) {
                              next.add(influencer.id)
                            } else {
                              next.delete(influencer.id)
                            }
                            return next
                          })
                        }}
                        className="size-4 cursor-pointer rounded border-slate-300 bg-white text-teal-600 focus:ring-teal-500 focus:ring-offset-0"
                      />
                    )}
                    <InitialAvatar name={influencer.name} tone="violet" size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-slate-900">{influencer.name}</p>
                        {nicheVal && (
                          <span className="rounded bg-teal-50 border border-teal-100 px-1.5 py-0.5 text-[10px] font-semibold text-teal-700 uppercase">
                            {nicheVal}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-slate-500">
                        {formatFollowers(influencer.followers)} followers / {influencer.location || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isAdded ? 'secondary' : 'outline'}
                    disabled={isLoading || isAdded}
                    onClick={() => handleAdd(influencer.id)}
                    className={isAdded ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'cursor-pointer border-slate-200 text-slate-700 hover:bg-white hover:text-teal-700'}
                  >
                    {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                    {isLoading ? 'Adding' : isAdded ? 'Added' : 'Add'}
                  </Button>
                </div>
              )
            })}
            {filteredInfluencers.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-500">No influencers match your current filters.</p>
            )}
          </div>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}


