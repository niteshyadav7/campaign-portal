'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { BarChart3, FileText, Sparkles, Users } from 'lucide-react'

const previewCards = [
  { label: 'Brands', value: 18, suffix: '', detail: 'review workspaces', icon: BarChart3 },
  { label: 'Campaigns', value: 42, suffix: '', detail: 'in motion', icon: FileText },
  { label: 'Creators', value: 1.2, suffix: 'k', detail: 'qualified profiles', icon: Users },
]

const headline = ['Sign in', 'to your', 'campaign', 'workspace.']

export function AuthExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cleanups: Array<() => void> = []

    const context = gsap.context(() => {
      gsap.fromTo(
        '.auth-reveal',
        { autoAlpha: 0, y: 24, filter: 'blur(10px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
        }
      )

      gsap.fromTo(
        '.auth-word',
        { autoAlpha: 0, yPercent: 90, rotateX: -55, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.82,
          ease: 'power4.out',
          stagger: 0.07,
          delay: 0.18,
        }
      )

      gsap.fromTo(
        '.auth-path',
        { strokeDashoffset: 460 },
        { strokeDashoffset: 0, duration: 1.6, ease: 'power3.out', stagger: 0.16, delay: 0.28 }
      )

      gsap.to('.auth-scan', {
        xPercent: 150,
        duration: 3.8,
        ease: 'none',
        repeat: -1,
        repeatDelay: 0.35,
      })

      gsap.to('.auth-dash', {
        x: 22,
        autoAlpha: 0.25,
        duration: 1.8,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.18,
      })

      gsap.utils.toArray<HTMLElement>('.auth-counter').forEach((counter) => {
        const target = Number(counter.dataset.value || 0)
        const suffix = counter.dataset.suffix || ''
        const decimals = suffix ? 1 : 0
        const state = { value: 0 }

        gsap.to(state, {
          value: target,
          duration: 1.2,
          ease: 'power3.out',
          delay: 0.55,
          onUpdate: () => {
            counter.textContent = `${state.value.toFixed(decimals)}${suffix}`
          },
        })
      })

      gsap.fromTo(
        '.auth-panel',
        { autoAlpha: 0, x: 34, rotateY: -6 },
        { autoAlpha: 1, x: 0, rotateY: 0, duration: 0.95, ease: 'power4.out', delay: 0.18 }
      )

      gsap.to('.auth-pulse', {
        scale: 1.04,
        opacity: 0.9,
        duration: 1.6,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        stagger: 0.2,
      })
    }, root)

    root.querySelectorAll<HTMLElement>('.auth-metric').forEach((card) => {
      const handleMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 8
        const rotateX = -((event.clientY - rect.top) / rect.height - 0.5) * 8

        gsap.to(card, {
          rotateX,
          rotateY,
          y: -4,
          transformPerspective: 800,
          duration: 0.32,
          ease: 'power2.out',
        })
      }
      const handleLeave = () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          y: 0,
          duration: 0.55,
          ease: 'elastic.out(1, 0.55)',
        })
      }

      card.addEventListener('mousemove', handleMove)
      card.addEventListener('mouseleave', handleLeave)
      cleanups.push(() => {
        card.removeEventListener('mousemove', handleMove)
        card.removeEventListener('mouseleave', handleLeave)
      })
    })

    return () => {
      cleanups.forEach((cleanup) => cleanup())
      context.revert()
    }
  }, [])

  return (
    <div ref={rootRef} className="relative h-screen overflow-hidden bg-[#050914] text-white">
      <div className="absolute inset-0 premium-grid opacity-20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/60 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-300/50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[53%] overflow-hidden lg:block">
        <div className="auth-scan absolute inset-y-0 -left-40 w-32 bg-gradient-to-r from-transparent via-emerald-200/10 to-transparent" />
        <svg className="absolute inset-0 h-full w-full opacity-60" viewBox="0 0 900 760" fill="none" aria-hidden="true">
          <path className="auth-path" pathLength="460" d="M86 180H302C345 180 360 209 391 232L560 358C587 378 617 388 650 388H810" stroke="url(#authLineA)" strokeWidth="1.5" strokeDasharray="460" />
          <path className="auth-path" pathLength="460" d="M70 570H282C336 570 362 536 401 500L516 394C554 360 585 348 634 348H820" stroke="url(#authLineB)" strokeWidth="1.5" strokeDasharray="460" />
          <path className="auth-path" pathLength="460" d="M98 430H275C334 430 365 450 404 476L510 548C548 574 586 586 632 586H780" stroke="url(#authLineC)" strokeWidth="1.5" strokeDasharray="460" />
          <defs>
            <linearGradient id="authLineA" x1="86" y1="180" x2="810" y2="388" gradientUnits="userSpaceOnUse">
              <stop stopColor="#60A5FA" stopOpacity="0" />
              <stop offset="0.5" stopColor="#34D399" />
              <stop offset="1" stopColor="#FBBF24" stopOpacity="0.15" />
            </linearGradient>
            <linearGradient id="authLineB" x1="70" y1="570" x2="820" y2="348" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FBBF24" stopOpacity="0" />
              <stop offset="0.5" stopColor="#60A5FA" />
              <stop offset="1" stopColor="#34D399" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="authLineC" x1="98" y1="430" x2="780" y2="586" gradientUnits="userSpaceOnUse">
              <stop stopColor="#34D399" stopOpacity="0" />
              <stop offset="0.5" stopColor="#A78BFA" />
              <stop offset="1" stopColor="#60A5FA" stopOpacity="0.12" />
            </linearGradient>
          </defs>
        </svg>
        <span className="auth-dash absolute left-[11%] top-[27%] h-px w-16 bg-emerald-300/40" />
        <span className="auth-dash absolute left-[24%] top-[66%] h-px w-24 bg-blue-300/40" />
        <span className="auth-dash absolute left-[39%] top-[48%] h-px w-20 bg-amber-300/30" />
      </div>

      <main className="relative grid h-screen lg:grid-cols-[1.02fr_0.98fr]">
        <section className="hidden h-screen flex-col justify-center border-r border-white/10 px-10 py-8 lg:flex xl:px-14">
          <div className="auth-reveal flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex size-12 items-center justify-center rounded-lg bg-white text-base font-black text-slate-950 shadow-2xl shadow-black/30">
                1to7
                <span className="auth-pulse absolute -right-1 -top-1 size-3 rounded-full bg-emerald-300 ring-2 ring-[#050914]" />
              </div>
              <div>
                <p className="text-sm font-black tracking-normal">1to7 Media</p>
                <p className="text-xs font-semibold text-slate-400">Influencer operations suite</p>
              </div>
            </div>
            <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-black text-emerald-200">
              Live workspace
            </div>
          </div>

          <div className="mt-16 max-w-3xl">
            <div className="auth-reveal inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
              <Sparkles className="size-3.5" />
              Campaign portal
            </div>
            <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.96] tracking-normal xl:text-6xl">
              {headline.map((word) => (
                <span key={word} className="mr-3 inline-block overflow-hidden pb-1 align-top">
                  <span className="auth-word inline-block will-change-transform">{word}</span>
                </span>
              ))}
            </h1>
            <p className="auth-reveal mt-5 max-w-xl text-base font-medium leading-7 text-slate-300">
              Manage brands, campaigns, and creator approvals from one focused portal.
            </p>

            <div className="auth-reveal mt-8 grid grid-cols-3 gap-3">
              {previewCards.map((card) => {
                const Icon = card.icon

                return (
                  <div key={card.label} className="auth-metric rounded-lg border border-white/10 bg-white/[0.065] p-4 shadow-2xl shadow-black/20 will-change-transform">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">{card.label}</p>
                      <Icon className="size-4 text-emerald-300" />
                    </div>
                    <p
                      className="auth-counter mt-4 text-3xl font-black tracking-normal"
                      data-value={card.value}
                      data-suffix={card.suffix}
                    >
                      0{card.suffix}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{card.detail}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <section className="flex h-screen items-center justify-center bg-slate-50 px-4 py-6 text-slate-950 sm:px-6 lg:bg-white/[0.94]">
          <div className="auth-panel w-full max-w-[520px]">
            {children}
          </div>
        </section>
      </main>
    </div>
  )
}
