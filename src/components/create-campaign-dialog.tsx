'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createCampaign } from '@/lib/actions'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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
      <DialogTrigger render={<Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer" />}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Campaign
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Create Campaign</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Create a new influencer campaign for a brand.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-700">Campaign Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Summer Launch 2026"
              required
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-700">Brand</Label>
            <select
              name="brand_id"
              required
              className="w-full rounded-md bg-white border border-zinc-200 text-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
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
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
