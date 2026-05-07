'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { ArrowLeft, Home, LifeBuoy, ShieldAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

type FallbackTone = 'not-found' | 'error'

export function RouteFallback({
  eyebrow,
  title,
  description,
  code,
  tone = 'not-found',
  action,
  details,
}: {
  eyebrow: string
  title: string
  description: string
  code?: string
  tone?: FallbackTone
  action?: ReactNode
  details?: ReactNode
}) {
  const isError = tone === 'error'

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="absolute inset-0 premium-grid opacity-20" />
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] shadow-2xl shadow-black/40 backdrop-blur-xl">
        <div className={cn(
          'absolute inset-x-0 top-0 h-1',
          isError
            ? 'bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300'
            : 'bg-gradient-to-r from-blue-400 via-emerald-300 to-amber-300'
        )} />
        <div className="grid lg:grid-cols-[1fr_360px]">
          <section className="p-7 sm:p-10">
            <div className={cn(
              'flex size-12 items-center justify-center rounded-lg shadow-lg ring-1 ring-white/20',
              isError ? 'bg-rose-500 text-white' : 'bg-emerald-400 text-slate-950'
            )}>
              {isError ? <ShieldAlert className="size-6" /> : <LifeBuoy className="size-6" />}
            </div>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.22em] text-emerald-300">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-black leading-none tracking-normal text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-slate-300">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {action}
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-400 px-4 text-sm font-black text-slate-950 shadow-lg shadow-emerald-950/20 transition-colors hover:bg-emerald-300"
              >
                <Home className="mr-2 size-4" />
                Go home
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-white/15 bg-white/[0.08] px-4 text-sm font-black text-white transition-colors hover:bg-white hover:text-slate-950"
              >
                <ArrowLeft className="mr-2 size-4" />
                Go back
              </button>
            </div>
          </section>

          <aside className="border-t border-white/10 bg-black/20 p-7 sm:p-10 lg:border-l lg:border-t-0">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Status</p>
            <p className="mt-4 text-7xl font-black leading-none tracking-normal text-white">
              {code || (isError ? '500' : '404')}
            </p>
            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.07] p-4">
              <p className="text-sm font-black text-white">
                {isError ? 'Protected production fallback' : 'Route not available'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {details || 'The portal is still intact. Use the actions here to return to a safe workspace.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
