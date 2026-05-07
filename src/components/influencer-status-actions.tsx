'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Loader2, RotateCcw, X } from 'lucide-react'
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
          className="flex-1 cursor-pointer border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        >
          {loading === 'shortlisted' ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          Shortlist
        </Button>
      )}
      {currentStatus !== 'rejected' && (
        <Button
          size="sm"
          disabled={loading !== null}
          onClick={() => handleAction('rejected')}
          className="flex-1 cursor-pointer border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
        >
          {loading === 'rejected' ? <Loader2 className="size-4 animate-spin" /> : <X className="size-4" />}
          Reject
        </Button>
      )}
      {currentStatus !== 'pending' && (
        <Button
          size="sm"
          variant="outline"
          disabled={loading !== null}
          onClick={() => handleAction('pending')}
          className="flex-1 cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        >
          {loading === 'pending' ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
          Reset
        </Button>
      )}
    </div>
  )
}
