'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Loader2, Edit } from 'lucide-react'
import { updateBrand } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'

export function EditBrandDialog({
  brandId,
  currentName,
}: {
  brandId: string
  currentName: string
}) {
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
      await updateBrand(formData)
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : 'Failed to update brand')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) setError(null)
    }}>
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer border-slate-200 bg-white font-medium text-slate-700 shadow-sm hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700" />}>
        <Edit className="mr-2 size-4" />
        Edit Brand
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
        <PremiumDialogFrame
          icon={Building2}
          eyebrow="Client workspace"
          title="Edit Brand"
          description="Update the details of this client workspace."
          accent="violet"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-slate-800">Brand Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={currentName}
                placeholder="e.g. Nike, Coca-Cola"
                required
                className="h-12 rounded-lg border-emerald-100 bg-white/80 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
              />
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
