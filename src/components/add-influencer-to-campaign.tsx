'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Users } from 'lucide-react'
import { addInfluencerToCampaign } from '@/lib/actions'
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
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [addedInfluencerIds, setAddedInfluencerIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    if (!open) return

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

  const handleAdd = async (influencerId: string) => {
    setLoading(influencerId)
    try {
      await addInfluencerToCampaign(campaignId, influencerId)
      setAddedInfluencerIds((prev) => {
        const next = new Set(prev)
        next.add(influencerId)
        return next
      })
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  function formatFollowers(count: number): string {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="cursor-pointer bg-blue-600 text-white shadow-lg shadow-blue-900/15 hover:bg-blue-700" />}>
        <Plus className="mr-2 size-4" />
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
        <div className="max-h-[52vh] space-y-2 overflow-y-auto pr-1">
          {influencers.map((influencer) => {
            const isAdded = addedInfluencerIds.has(influencer.id)
            const isLoading = loading === influencer.id

            return (
              <div
                key={influencer.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <InitialAvatar name={influencer.name} tone="violet" size="sm" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">{influencer.name}</p>
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
                  className={isAdded ? 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-500' : 'cursor-pointer border-slate-200 text-slate-700 hover:bg-white hover:text-slate-950'}
                >
                  {isLoading ? <Loader2 className="size-4 animate-spin" /> : null}
                  {isLoading ? 'Adding' : isAdded ? 'Added' : 'Add'}
                </Button>
              </div>
            )
          })}
          {influencers.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">No influencers in the pool yet.</p>
          )}
        </div>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
