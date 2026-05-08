import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MotionStage } from '@/components/motion-shell'
import { cn } from '@/lib/utils'

type Tone = 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'slate'

const toneStyles: Record<Tone, {
  icon: string
  soft: string
  border: string
  text: string
  glow: string
}> = {
  blue: {
    icon: 'bg-sky-600 text-white',
    soft: 'bg-blue-50 text-blue-700',
    border: 'border-blue-200',
    text: 'text-blue-700',
    glow: 'shadow-blue-900/10',
  },
  emerald: {
    icon: 'bg-emerald-600 text-white',
    soft: 'bg-emerald-50 text-emerald-700',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    glow: 'shadow-emerald-900/10',
  },
  amber: {
    icon: 'bg-amber-500 text-white',
    soft: 'bg-amber-50 text-amber-700',
    border: 'border-amber-200',
    text: 'text-amber-700',
    glow: 'shadow-amber-900/10',
  },
  rose: {
    icon: 'bg-rose-600 text-white',
    soft: 'bg-rose-50 text-rose-700',
    border: 'border-rose-200',
    text: 'text-rose-700',
    glow: 'shadow-rose-900/10',
  },
  violet: {
    icon: 'bg-violet-600 text-white',
    soft: 'bg-violet-50 text-violet-700',
    border: 'border-violet-200',
    text: 'text-violet-700',
    glow: 'shadow-violet-900/10',
  },
  slate: {
    icon: 'bg-slate-700 text-white',
    soft: 'bg-slate-50 text-slate-700',
    border: 'border-slate-200',
    text: 'text-slate-700',
    glow: 'shadow-slate-900/10',
  },
}

export function PageSurface({ children }: { children: ReactNode }) {
  return (
    <MotionStage className="mx-auto flex w-full max-w-[1440px] flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      {children}
    </MotionStage>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="revealable premium-card premium-grid relative overflow-hidden rounded-lg border border-white/80 bg-white/[0.82] p-5 text-slate-800 backdrop-blur-xl sm:p-6">
      <div className="premium-rail absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b from-emerald-400 via-teal-300 to-sky-400" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_20%,rgb(16_185_129/.12),transparent_28%),radial-gradient(circle_at_95%_10%,rgb(14_165_233/.1),transparent_24%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.06em] text-teal-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="premium-text-balance bg-gradient-to-r from-slate-800 to-teal-700 bg-clip-text text-3xl font-semibold leading-tight tracking-normal text-transparent sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            {description}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  )
}

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = 'blue',
}: {
  title: string
  value: string | number
  detail?: string
  icon: LucideIcon
  tone?: Tone
}) {
  const toneStyle = toneStyles[tone]

  return (
    <Card className={cn(
      'revealable premium-card premium-sheen group overflow-hidden border-white/[0.85] bg-white/[0.88] backdrop-blur-xl transition-colors duration-300 hover:border-emerald-200/80',
      toneStyle.glow,
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium uppercase tracking-[0.05em] text-slate-500">{title}</p>
            <p className="mt-2 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-3xl font-semibold tracking-normal text-transparent">{value}</p>
          </div>
          <div className={cn('flex size-10 items-center justify-center rounded-lg shadow-sm ring-1 ring-black/5', toneStyle.icon)}>
            <Icon className="size-4" />
          </div>
        </div>
        {detail ? (
          <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <ArrowUpRight className={cn('size-3.5', toneStyle.text)} />
            {detail}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="revealable premium-card flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center backdrop-blur">
      <div className="flex size-12 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm">
        <Icon className="size-6" />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 max-w-md text-sm leading-6 text-slate-500">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function StatusPill({
  children,
  tone = 'slate',
}: {
  children: ReactNode
  tone?: Tone
}) {
  const toneStyle = toneStyles[tone]

  return (
    <span className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium capitalize',
      toneStyle.soft,
      toneStyle.border,
    )}>
      {children}
    </span>
  )
}

export function InitialAvatar({
  name,
  tone = 'blue',
  size = 'md',
}: {
  name?: string | null
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
}) {
  const toneStyle = toneStyles[tone]
  const sizeClass = size === 'lg' ? 'size-12 text-base' : size === 'sm' ? 'size-8 text-xs' : 'size-10 text-sm'
  const initial = (name || '?').trim()[0]?.toUpperCase() || '?'

  return (
    <div className={cn(
      'flex shrink-0 items-center justify-center rounded-lg font-semibold shadow-sm ring-1 ring-black/5',
      toneStyle.icon,
      sizeClass,
    )}>
      {initial}
    </div>
  )
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('revealable premium-card rounded-lg border border-white/[0.85] bg-white/[0.88] backdrop-blur-xl', className)}>
      {children}
    </div>
  )
}

export function PremiumActionCard({
  icon: Icon,
  eyebrow,
  title,
  description,
  meta,
  status,
  statusTone = 'emerald',
  actionLabel,
  footer,
  tone = 'blue',
  className,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  description?: string
  meta?: ReactNode
  status?: ReactNode
  statusTone?: Tone
  actionLabel?: string
  footer?: ReactNode
  tone?: Tone
  className?: string
}) {
  const toneStyle = toneStyles[tone]

  return (
    <Card className={cn(
      'revealable premium-card premium-sheen group h-full overflow-hidden border-white/[0.85] bg-white/90 transition-colors duration-300 hover:border-emerald-200/80',
      className,
    )}>
      <CardContent className="flex h-full flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div className={cn('flex size-11 items-center justify-center rounded-lg shadow-sm ring-1 ring-black/5', toneStyle.icon)}>
            <Icon className="size-5" />
          </div>
          {status ? <StatusPill tone={statusTone}>{status}</StatusPill> : null}
        </div>
        <div className="mt-5">
          <p className={cn('text-[12px] font-medium uppercase', toneStyle.text)}>
            {eyebrow}
          </p>
          <h2 className="mt-2 text-xl font-semibold leading-tight tracking-normal text-slate-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        <div className="mt-auto space-y-4 pt-5">
          {meta ? <div className="space-y-2 text-sm font-medium text-slate-600">{meta}</div> : null}
          {actionLabel ? (
            <div className={cn('inline-flex items-center gap-2 text-sm font-medium transition-colors', toneStyle.text)}>
              {actionLabel}
              <ArrowUpRight className="size-4 transition-transform " />
            </div>
          ) : null}
          {footer ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              {footer}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
