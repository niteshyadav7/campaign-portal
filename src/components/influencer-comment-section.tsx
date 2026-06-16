'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Edit2, Loader2, MessageSquare, X } from 'lucide-react'
import { updateInfluencerComment } from '@/lib/actions'
import { Button } from '@/components/ui/button'

export function InfluencerCommentSection({
  campaignId,
  influencerId,
  initialComment,
}: {
  campaignId: string
  influencerId: string
  initialComment: string | null
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [comment, setComment] = useState(initialComment || '')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await updateInfluencerComment(campaignId, influencerId, comment)
      if (res && res.success) {
        setIsEditing(false)
        router.refresh()
      } else {
        console.error(res?.error)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      {isEditing ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Comment / Feedback
            </label>
            <button
              type="button"
              onClick={() => {
                setComment(initialComment || '')
                setIsEditing(false)
              }}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Type comment or feedback..."
            disabled={loading}
            className="min-h-16 w-full rounded-md border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-teal-500/50 focus:outline-none focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400"
          />
          <div className="flex justify-end gap-1.5">
            <Button
              size="xs"
              variant="outline"
              onClick={() => {
                setComment(initialComment || '')
                setIsEditing(false)
              }}
              disabled={loading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="xs"
              onClick={handleSave}
              disabled={loading}
              className="cursor-pointer bg-teal-600 text-white hover:bg-teal-700 font-semibold shadow-sm"
            >
              {loading ? <Loader2 className="size-3 animate-spin mr-1" /> : <Check className="size-3 mr-1" />}
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="group relative">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <MessageSquare className="size-3 text-slate-400" />
              Comment / Notes
            </span>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer flex items-center gap-0.5"
            >
              <Edit2 className="size-3" />
              {initialComment ? 'Edit' : 'Add'}
            </button>
          </div>
          {initialComment ? (
            <div className="mt-2 rounded-lg bg-teal-50/40 border border-teal-50/80 p-3 text-xs font-medium leading-relaxed text-slate-755 italic">
              "{initialComment}"
            </div>
          ) : (
            <p className="mt-2 text-xs italic text-slate-400">No comments added yet.</p>
          )}
        </div>
      )}
    </div>
  )
}
