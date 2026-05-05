'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrand } from '@/lib/actions'
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

export function CreateBrandDialog() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await createBrand(formData)
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
      <DialogTrigger render={<Button className="bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-500/20 cursor-pointer" />}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Brand
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Create New Brand</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Add a new client brand to your portal.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-700">Brand Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Nike, Coca-Cola"
              required
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create Brand'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
