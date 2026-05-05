'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateInfluencerStatus } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export function InfluencerStatusActions({
  campaignId,
  influencerId,
  currentStatus,
}: {
  campaignId: string
  influencerId: string
  currentStatus: string
}) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  const handleAction = async (status: 'shortlisted' | 'rejected' | 'pending') => {
    setLoading(status)
    try {
      await updateInfluencerStatus(campaignId, influencerId, status)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2">
      {currentStatus !== 'shortlisted' && (
        <Button
          size="sm"
          disabled={loading !== null}
          onClick={() => handleAction('shortlisted')}
          className="flex-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/20 cursor-pointer"
        >
          {loading === 'shortlisted' ? '...' : '✓ Shortlist'}
        </Button>
      )}
      {currentStatus !== 'rejected' && (
        <Button
          size="sm"
          disabled={loading !== null}
          onClick={() => handleAction('rejected')}
          className="flex-1 bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-500/20 cursor-pointer"
        >
          {loading === 'rejected' ? '...' : '✗ Reject'}
        </Button>
      )}
      {currentStatus !== 'pending' && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading !== null}
          onClick={() => handleAction('pending')}
          className="flex-1 border-white/10 text-zinc-400 hover:text-white cursor-pointer"
        >
          {loading === 'pending' ? '...' : 'Reset'}
        </Button>
      )}
    </div>
  )
}
