'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, Loader2, Plus } from 'lucide-react'
import { createBrand } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'

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
      <DialogTrigger render={<Button className="cursor-pointer bg-gradient-to-r from-emerald-600 to-teal-500 font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:to-teal-400" />}>
        <Plus className="mr-2 size-4" />
        Add Brand
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-3xl">
        <PremiumDialogFrame
          icon={Building2}
          eyebrow="Client workspace"
          title="Create New Brand"
          description="Add a client account and prepare a dedicated review portal."
          accent="violet"
        >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-slate-800">Brand Name</Label>
            <Input
              id="name"
              name="name"
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
            {loading ? 'Creating' : 'Create Brand'}
          </Button>
        </form>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
