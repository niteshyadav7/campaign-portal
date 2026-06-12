'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Loader2, Edit } from 'lucide-react'
import { updateCampaign } from '@/lib/actions'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'
import type { Brand } from '@/lib/types'

export function EditCampaignDialog({
  campaignId,
  currentName,
  currentBrandId,
  currentStatus,
}: {
  campaignId: string
  currentName: string
  currentBrandId: string
  currentStatus: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) {
      const supabase = createClient()
      supabase.from('brands').select('*').order('name').then(({ data }) => {
        setBrands(data || [])
      })
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('campaign_id', campaignId)
    try {
      await updateCampaign(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to update campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) setError(null)
    }}>
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer border-slate-200 bg-white font-medium text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700" />}>
        <Edit className="mr-2 size-4" />
        Edit Campaign
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
        <PremiumDialogFrame
          icon={FileText}
          eyebrow="Campaign pipeline"
          title="Edit Campaign"
          description="Update campaign details and settings."
          accent="blue"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-800">Campaign Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentName}
                placeholder="e.g. Summer Launch 2026"
                required
                className="h-12 rounded-lg border-emerald-100 bg-white/80 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand_id" className="text-sm font-medium text-slate-800">Brand</Label>
              <select
                id="brand_id"
                name="brand_id"
                defaultValue={currentBrandId}
                required
                className="h-12 w-full rounded-lg border border-emerald-100 bg-white/80 px-3 text-base font-medium text-slate-800 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>{brand.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium text-slate-800">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={currentStatus}
                required
                className="h-12 w-full rounded-lg border border-emerald-100 bg-white/80 px-3 text-base font-medium text-slate-800 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-base font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:via-teal-500 hover:to-sky-400"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? 'Saving Changes' : 'Save Changes'}
            </Button>
          </form>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
