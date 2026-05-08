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
    <main className="flex min-h-screen items-center justify-center bg-[#fbfdf9] px-4 py-10 text-slate-800">
      <div className="absolute inset-0 premium-grid opacity-35" />
      <div className="relative w-full max-w-5xl overflow-hidden rounded-lg border border-white/80 bg-white/[0.84] shadow-xl shadow-emerald-900/10 backdrop-blur-xl">
        <div className={cn(
          'absolute inset-x-0 top-0 h-1',
          isError
            ? 'bg-gradient-to-r from-rose-400 via-amber-300 to-emerald-300'
            : 'bg-gradient-to-r from-blue-400 via-emerald-300 to-amber-300'
        )} />
        <div className="grid lg:grid-cols-[1fr_360px]">
          <section className="p-7 sm:p-10">
            <div className={cn(
              'flex size-12 items-center justify-center rounded-lg shadow-lg ring-1 ring-white/50',
              isError ? 'bg-rose-500 text-white' : 'bg-gradient-to-br from-emerald-600 to-teal-500 text-white'
            )}>
              {isError ? <ShieldAlert className="size-6" /> : <LifeBuoy className="size-6" />}
            </div>
            <p className="mt-8 text-xs font-semibold uppercase text-teal-700">
              {eyebrow}
            </p>
            <h1 className="mt-3 max-w-2xl text-4xl font-semibold leading-tight tracking-normal text-slate-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {action}
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:from-emerald-500 hover:to-teal-400"
              >
                <Home className="mr-2 size-4" />
                Go home
              </Link>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border border-emerald-100 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-emerald-50 hover:text-teal-700"
              >
                <ArrowLeft className="mr-2 size-4" />
                Go back
              </button>
            </div>
          </section>

          <aside className="border-t border-emerald-100 bg-emerald-50/55 p-7 sm:p-10 lg:border-l lg:border-t-0">
            <p className="text-xs font-semibold uppercase text-slate-500">Status</p>
            <p className="mt-4 text-7xl font-semibold leading-none tracking-normal text-slate-900">
              {code || (isError ? '500' : '404')}
            </p>
            <div className="mt-6 rounded-lg border border-white/80 bg-white/[0.74] p-4">
              <p className="text-sm font-semibold text-slate-900">
                {isError ? 'Protected production fallback' : 'Route not available'}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {details || 'The portal is still intact. Use the actions here to return to a safe workspace.'}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}
