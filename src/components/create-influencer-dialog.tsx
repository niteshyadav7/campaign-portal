'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Users } from 'lucide-react'
import { createInfluencer } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'

export function CreateInfluencerDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createInfluencer(formData)
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
      <DialogTrigger render={<Button className="cursor-pointer bg-emerald-400 font-black text-slate-950 shadow-lg shadow-emerald-950/20 hover:bg-emerald-300" />}>
        <Plus className="mr-2 size-4" />
        Add Influencer
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-4xl">
        <PremiumDialogFrame
          icon={Users}
          eyebrow="Creator database"
          title="Add Influencer"
          description="Add talent details once and reuse the creator across campaign shortlists."
          accent="emerald"
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-black text-slate-800">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Influencer Name"
                required
                className="h-12 rounded-lg border-slate-200 bg-slate-50 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followers" className="text-sm font-black text-slate-800">Followers</Label>
              <Input
                id="followers"
                name="followers"
                type="number"
                placeholder="50000"
                className="h-12 rounded-lg border-slate-200 bg-slate-50 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram_url" className="text-sm font-black text-slate-800">Instagram URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              placeholder="https://instagram.com/username"
              className="h-12 rounded-lg border-slate-200 bg-slate-50 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-black text-slate-800">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Mumbai, India"
                className="h-12 rounded-lg border-slate-200 bg-slate-50 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number" className="text-sm font-black text-slate-800">Contact</Label>
              <Input
                id="contact_number"
                name="contact_number"
                placeholder="+91 9876543210"
                className="h-12 rounded-lg border-slate-200 bg-slate-50 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full cursor-pointer bg-slate-950 text-base font-black text-white shadow-lg shadow-slate-950/15 hover:bg-slate-800"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? 'Adding' : 'Add Influencer'}
          </Button>
        </form>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
