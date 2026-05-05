'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addInfluencerToCampaign } from '@/lib/actions'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import type { Influencer } from '@/lib/types'

export function AddInfluencerToCampaign({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [addedInfluencerIds, setAddedInfluencerIds] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    if (open) {
      const supabase = createClient()
      
      Promise.all([
        supabase.from('influencers').select('*').order('name'),
        supabase.from('campaign_influencers').select('influencer_id').eq('campaign_id', campaignId)
      ]).then(([influencersRes, campaignInfluencersRes]) => {
        setInfluencers(influencersRes.data || [])
        
        const addedIds = new Set((campaignInfluencersRes.data || []).map((ci: any) => ci.influencer_id))
        setAddedInfluencerIds(addedIds)
      })
    }
  }, [open, campaignId])

  const handleAdd = async (influencerId: string) => {
    setLoading(influencerId)
    try {
      await addInfluencerToCampaign(campaignId, influencerId)
      setAddedInfluencerIds(prev => {
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
      <DialogTrigger render={<Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer" />}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Influencer
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200 shadow-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Add Influencer to Campaign</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Select influencers from your pool to add to this campaign.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 mt-4">
          {influencers.map((influencer) => (
            <div
              key={influencer.id}
              className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 border border-zinc-100 hover:border-violet-200 hover:bg-violet-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs">
                  {influencer.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-zinc-900 font-medium">{influencer.name}</p>
                  <p className="text-xs text-zinc-500">{formatFollowers(influencer.followers)} followers • {influencer.location || 'N/A'}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant={addedInfluencerIds.has(influencer.id) ? "secondary" : "outline"}
                disabled={loading === influencer.id || addedInfluencerIds.has(influencer.id)}
                onClick={() => handleAdd(influencer.id)}
                className={addedInfluencerIds.has(influencer.id) ? "border-zinc-200 bg-zinc-100 text-zinc-500 cursor-not-allowed" : "border-zinc-200 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 cursor-pointer"}
              >
                {loading === influencer.id ? 'Adding...' : addedInfluencerIds.has(influencer.id) ? 'Added' : 'Add'}
              </Button>
            </div>
          ))}
          {influencers.length === 0 && (
            <p className="text-center text-zinc-500 py-8">No influencers in pool. Add some first.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
