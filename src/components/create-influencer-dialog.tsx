'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createInfluencer } from '@/lib/actions'
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
      <DialogTrigger render={<Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg shadow-emerald-500/20 cursor-pointer" />}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Influencer
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Add Influencer</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Add a new influencer to your pool.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-700">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Influencer Name"
                required
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="followers" className="text-zinc-700">Followers</Label>
              <Input
                id="followers"
                name="followers"
                type="number"
                placeholder="50000"
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instagram_url" className="text-zinc-700">Instagram URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              placeholder="https://instagram.com/username"
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-zinc-700">Location</Label>
              <Input
                id="location"
                name="location"
                placeholder="Mumbai, India"
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact_number" className="text-zinc-700">Contact</Label>
              <Input
                id="contact_number"
                name="contact_number"
                placeholder="+91 9876543210"
                className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white cursor-pointer"
          >
            {loading ? 'Adding...' : 'Add Influencer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
