import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { BadgeCheck } from 'lucide-react'
import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export function PremiumDialogFrame({
  icon: Icon,
  eyebrow,
  title,
  description,
  children,
  accent = 'emerald',
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  description: string
  children: ReactNode
  accent?: 'emerald' | 'blue' | 'violet'
}) {
  const accentClass = {
    emerald: 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white',
    blue: 'bg-gradient-to-br from-sky-600 to-cyan-500 text-white',
    violet: 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white',
  }[accent]

  return (
    <div className="grid overflow-hidden rounded-lg border border-white/80 bg-white/95 shadow-xl shadow-emerald-900/10 md:grid-cols-[220px_1fr]">
      <aside className="premium-grid relative border-r border-emerald-100 bg-emerald-50/70 p-5 text-slate-800">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400" />
        <div className={cn('flex size-12 items-center justify-center rounded-lg shadow-lg shadow-emerald-900/10', accentClass)}>
          <Icon className="size-6" />
        </div>
        <p className="mt-8 text-[12px] font-medium uppercase tracking-[0.05em] text-teal-700">
          {eyebrow}
        </p>
        <DialogHeader className="mt-3 gap-3">
          <DialogTitle className="text-2xl font-semibold leading-tight text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-slate-600">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 rounded-lg border border-white/80 bg-white/70 p-3 shadow-sm shadow-emerald-900/5">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
            <BadgeCheck className="size-4 text-emerald-600" />
            Premium setup
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Changes sync after submit.
          </p>
        </div>
      </aside>
      <div className="p-5 md:p-6">
        {children}
      </div>
    </div>
  )
}
