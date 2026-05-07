'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { Bell, Command, Search, ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const routeLabels = [
  { match: '/admin/influencers', label: 'Influencer pool', section: 'Talent' },
  { match: '/admin/campaigns', label: 'Campaigns', section: 'Pipeline' },
  { match: '/admin/brands', label: 'Brands', section: 'Clients' },
  { match: '/admin/workflow', label: 'Workflow', section: 'Operations' },
  { match: '/admin', label: 'Command center', section: 'Overview' },
  { match: '/dashboard/team', label: 'Team access', section: 'Brand portal' },
  { match: '/dashboard/campaigns', label: 'Campaign review', section: 'Brand portal' },
  { match: '/dashboard', label: 'Your campaigns', section: 'Brand portal' },
]

export function WorkspaceTopbar({
  workspaceName,
  mode,
  userEmail,
}: {
  workspaceName: string
  mode: 'Agency' | 'Brand'
  userEmail?: string | null
}) {
  const pathname = usePathname()
  const route = useMemo(() => {
    return routeLabels.find((item) => pathname === item.match || pathname.startsWith(`${item.match}/`)) || routeLabels[0]
  }, [pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/82 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
            <span>{workspaceName}</span>
            <span className="size-1 rounded-full bg-slate-300" />
            <span>{route.section}</span>
          </div>
          <h2 className="mt-1 truncate text-base font-black tracking-normal text-slate-950">
            {route.label}
          </h2>
        </div>

        <div className="hidden min-w-[280px] max-w-xl flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 shadow-inner md:flex">
          <Search className="mr-2 size-4 text-slate-400" />
          <span className="flex-1">Search brands, campaigns, creators</span>
          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] font-black text-slate-400">
            <Command className="size-3" />
            K
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span className={cn(
            'hidden rounded-full border px-3 py-1.5 text-xs font-black sm:inline-flex',
            mode === 'Agency'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-blue-200 bg-blue-50 text-blue-700'
          )}>
            <ShieldCheck className="mr-1.5 size-3.5" />
            {mode}
          </span>
          <button
            type="button"
            className="flex size-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-slate-300 hover:text-slate-950"
            aria-label="Notifications"
          >
            <Bell className="size-4" />
          </button>
          <div className="hidden max-w-40 truncate text-right text-xs font-semibold text-slate-500 lg:block">
            {userEmail}
          </div>
        </div>
      </div>
    </header>
  )
}
