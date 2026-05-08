'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Loader2, Plus } from 'lucide-react'
import { createCampaign } from '@/lib/actions'
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

export function CreateCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [brands, setBrands] = useState<Brand[]>([])
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
    const formData = new FormData(e.currentTarget)
    try {
      await createCampaign(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:to-teal-400" />}>
        <Plus className="mr-2 size-4" />
        New Campaign
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
        <PremiumDialogFrame
          icon={FileText}
          eyebrow="Campaign pipeline"
          title="Create Campaign"
          description="Create a campaign workspace and connect it to the right brand."
          accent="blue"
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-800">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Summer Launch 2026"
              required
              className="h-12 rounded-lg border-emerald-100 bg-white/80 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-800">Brand</Label>
            <select
              name="brand_id"
              required
              className="h-12 w-full rounded-lg border border-emerald-100 bg-white/80 px-3 text-base font-medium text-slate-800 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="">Select a brand</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>{brand.name}</option>
              ))}
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-base font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:via-teal-500 hover:to-sky-400"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? 'Creating' : 'Create Campaign'}
          </Button>
        </form>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
