'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrandUser } from '@/lib/actions'
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

export function CreateBrandUserDialog({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.set('brand_id', brandId)
    try {
      await createBrandUser(formData)
      setOpen(false)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 cursor-pointer" />}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
          </svg>
          Add User
      </DialogTrigger>
      <DialogContent className="bg-white border-zinc-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-zinc-900">Add User to {brandName}</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Create login credentials for a brand team member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-zinc-700">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              required
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john@brand.com"
              required
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-700">Password</Label>
            <Input
              id="password"
              name="password"
              type="text"
              placeholder="Generate a strong password"
              required
              className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-zinc-700">Role</Label>
            <select
              name="role"
              defaultValue="brand_admin"
              className="w-full rounded-md bg-white border border-zinc-200 text-zinc-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50"
            >
              <option value="brand_admin">Brand Admin (Can manage sub-users)</option>
              <option value="brand_user">Brand User (View & Shortlist only)</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white cursor-pointer"
          >
            {loading ? 'Creating...' : 'Create User'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
