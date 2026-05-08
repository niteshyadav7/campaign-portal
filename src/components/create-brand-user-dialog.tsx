'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, UserPlus } from 'lucide-react'
import { createBrandUser } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'

export function CreateBrandUserDialog({ brandId, brandName }: { brandId: string; brandName: string }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const suggestedDomain = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .replace(/^the/, '') || 'brand'

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" className="cursor-pointer border-slate-200 bg-white font-medium text-slate-800 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-teal-700" />}>
        <UserPlus className="mr-1 size-4" />
        Add User
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-4xl">
        <PremiumDialogFrame
          icon={UserPlus}
          eyebrow="Team access"
          title="Add User"
          description={`Create login credentials for ${brandName}.`}
          accent="blue"
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="full_name" className="text-sm font-medium text-slate-800">Full Name</Label>
            <Input
              id="full_name"
              name="full_name"
              placeholder="John Doe"
              required
              className="h-12 rounded-lg border-emerald-100 bg-white/80 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-slate-800">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={`john@${suggestedDomain}.com`}
              required
              className="h-12 rounded-lg border-emerald-100 bg-white/80 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-slate-800">Password</Label>
            <Input
              id="password"
              name="password"
              type="text"
              placeholder="Generate a strong password"
              required
              className="h-12 rounded-lg border-emerald-100 bg-white/80 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-slate-800">Role</Label>
            <select
              name="role"
              defaultValue="brand_admin"
              className="h-12 w-full rounded-lg border border-emerald-100 bg-white/80 px-3 text-base font-medium text-slate-800 focus:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              <option value="brand_admin">Brand Admin (Can manage sub-users)</option>
              <option value="brand_user">Brand User (View & Shortlist only)</option>
            </select>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-base font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:via-teal-500 hover:to-sky-400"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? 'Creating' : 'Create User'}
          </Button>
        </form>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
