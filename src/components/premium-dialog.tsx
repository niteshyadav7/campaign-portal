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
    emerald: 'bg-emerald-400 text-slate-950',
    blue: 'bg-blue-500 text-white',
    violet: 'bg-violet-500 text-white',
  }[accent]

  return (
    <div className="grid overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-950/20 md:grid-cols-[220px_1fr]">
      <aside className="premium-grid relative bg-slate-950 p-5 text-white">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300 via-blue-400 to-violet-400" />
        <div className={cn('flex size-12 items-center justify-center rounded-lg shadow-lg', accentClass)}>
          <Icon className="size-6" />
        </div>
        <p className="mt-8 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-300">
          {eyebrow}
        </p>
        <DialogHeader className="mt-3 gap-3">
          <DialogTitle className="text-3xl font-black leading-none text-white">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm font-medium leading-6 text-slate-300">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.07] p-3">
          <div className="flex items-center gap-2 text-xs font-black text-white">
            <BadgeCheck className="size-4 text-emerald-300" />
            Premium setup
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-400">
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
