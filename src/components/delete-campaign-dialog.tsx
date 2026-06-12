'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { deleteCampaign } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'

export function DeleteCampaignDialog({
  campaignId,
  campaignName,
}: {
  campaignId: string
  campaignName: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    setError(null)
    try {
      await deleteCampaign(campaignId)
      setOpen(false)
      router.push('/admin/campaigns')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to delete campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) setError(null)
    }}>
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer border-red-200 bg-white font-medium text-red-600 shadow-sm hover:bg-red-50 hover:text-red-700" />}>
        <Trash2 className="mr-2 size-4" />
        Delete Campaign
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
        <PremiumDialogFrame
          icon={AlertTriangle}
          eyebrow="Danger Zone"
          title="Delete Campaign"
          description={`Permanently delete the campaign ${campaignName}.`}
          accent="blue"
        >
          <div className="space-y-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            
            <div className="rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800">
              <div className="flex gap-3">
                <AlertTriangle className="size-5 shrink-0 text-amber-600" />
                <div>
                  <h4 className="font-semibold text-amber-900">Warning: Permanent Action</h4>
                  <p className="mt-1 leading-relaxed">
                    This action is permanent and cannot be undone. Deleting this campaign will automatically:
                  </p>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Delete all influencer shortlists assigned to this campaign.</li>
                    <li>Remove all records of client approvals and rejections.</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              Are you absolutely sure you want to delete <span className="font-semibold text-slate-800">{campaignName}</span>?
            </p>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="cursor-pointer border-slate-200 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                disabled={loading}
                className="cursor-pointer bg-red-600 font-medium text-white shadow-lg shadow-red-700/[0.15] hover:bg-red-500"
              >
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                Yes, Delete Campaign
              </Button>
            </div>
          </div>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
