'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { BarChart3, FileText, Users } from 'lucide-react'

const previewCards = [
  {
    label: 'Brands',
    value: 18,
    suffix: '',
    detail: 'active workspaces',
    icon: BarChart3,
    accent: 'from-emerald-400 via-teal-300 to-cyan-300',
    iconTone: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    wave: '#10b981',
  },
  {
    label: 'Campaigns',
    value: 42,
    suffix: '',
    detail: 'moving cleanly',
    icon: FileText,
    accent: 'from-sky-400 via-cyan-300 to-violet-300',
    iconTone: 'border-sky-100 bg-sky-50 text-sky-700',
    wave: '#0ea5e9',
  },
  {
    label: 'Creators',
    value: 1.2,
    suffix: 'k',
    detail: 'ready profiles',
    icon: Users,
    accent: 'from-amber-300 via-orange-300 to-rose-300',
    iconTone: 'border-orange-100 bg-orange-50 text-orange-700',
    wave: '#f97316',
  },
]

const headline = ['Campaigns', 'that feel', 'clear and', 'calm.']

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
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.75, ease: 'power3.out', delay: 0.18 }
      )

      gsap.utils.toArray<HTMLElement>('.auth-float').forEach((card, index) => {
        gsap.to(card, {
          x: () => gsap.utils.random(-46, 46),
          y: () => gsap.utils.random(-38, 38),
          rotate: () => gsap.utils.random(-6, 6),
          duration: 3.8 + index * 0.6,
          delay: index * 0.22,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          repeatRefresh: true,
        })
      })

      gsap.utils.toArray<HTMLElement>('.auth-ring').forEach((ring, index) => {
        gsap.to(ring, {
          rotate: index % 2 === 0 ? 360 : -360,
          duration: 14 + index * 3,
          ease: 'none',
          repeat: -1,
        })
      })

      gsap.to('.auth-liquid', {
        x: 12,
        y: -8,
        scale: 1.12,
        duration: 4.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.22,
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
    <div ref={rootRef} className="relative h-dvh overflow-hidden bg-[#fbfdf9] text-slate-800">
      <div className="absolute inset-0 bg-[linear-gradient(118deg,rgb(250_253_249)_0%,rgb(232_250_243)_44%,rgb(255_249_239)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgb(52_211_153/.18),transparent_27%),radial-gradient(circle_at_74%_18%,rgb(56_189_248/.13),transparent_24%),radial-gradient(circle_at_69%_78%,rgb(251_146_60/.12),transparent_30%)]" />
      <div className="absolute inset-0 premium-grid opacity-[0.28]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />
      <div className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-emerald-300/50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-[55%] overflow-hidden lg:block">
        <div className="auth-scan absolute inset-y-0 -left-40 w-32 bg-gradient-to-r from-transparent via-white/70 to-transparent" />
        <svg className="absolute inset-0 h-full w-full opacity-70" viewBox="0 0 900 760" fill="none" aria-hidden="true">
          <path className="auth-path" pathLength="460" d="M86 180H302C345 180 360 209 391 232L560 358C587 378 617 388 650 388H810" stroke="url(#authLineA)" strokeWidth="1.5" strokeDasharray="460" />
          <path className="auth-path" pathLength="460" d="M70 570H282C336 570 362 536 401 500L516 394C554 360 585 348 634 348H820" stroke="url(#authLineB)" strokeWidth="1.5" strokeDasharray="460" />
          <path className="auth-path" pathLength="460" d="M98 430H275C334 430 365 450 404 476L510 548C548 574 586 586 632 586H780" stroke="url(#authLineC)" strokeWidth="1.5" strokeDasharray="460" />
          <defs>
            <linearGradient id="authLineA" x1="86" y1="180" x2="810" y2="388" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" stopOpacity="0" />
              <stop offset="0.5" stopColor="#0D9488" />
              <stop offset="1" stopColor="#F59E0B" stopOpacity="0.24" />
            </linearGradient>
            <linearGradient id="authLineB" x1="70" y1="570" x2="820" y2="348" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F59E0B" stopOpacity="0" />
              <stop offset="0.5" stopColor="#14B8A6" />
              <stop offset="1" stopColor="#38BDF8" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="authLineC" x1="98" y1="430" x2="780" y2="586" gradientUnits="userSpaceOnUse">
              <stop stopColor="#14B8A6" stopOpacity="0" />
              <stop offset="0.5" stopColor="#F97316" />
              <stop offset="1" stopColor="#22C55E" stopOpacity="0.18" />
            </linearGradient>
          </defs>
        </svg>
        <span className="auth-dash absolute left-[11%] top-[27%] h-px w-16 bg-emerald-500/25" />
        <span className="auth-dash absolute left-[24%] top-[66%] h-px w-24 bg-teal-500/24" />
        <span className="auth-dash absolute left-[39%] top-[48%] h-px w-20 bg-amber-400/22" />
      </div>

      <main className="relative grid h-dvh overflow-hidden lg:grid-cols-[1.22fr_0.78fr]">
        <section className="relative hidden h-dvh flex-col justify-center overflow-hidden border-r border-emerald-100/80 px-10 py-8 lg:flex xl:px-14">
          <div className="max-w-3xl">
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-normal xl:text-6xl">
              {headline.map((word) => (
                <span key={word} className="mr-3 inline-block overflow-hidden pb-1.5 align-top">
                  <span className="auth-word inline-block bg-gradient-to-r from-teal-700 to-sky-500 bg-clip-text text-transparent will-change-transform">
                    {word}
                  </span>
                </span>
              ))}
            </h1>
            <p className="auth-reveal mt-5 max-w-xl bg-gradient-to-r from-slate-600 to-teal-700 bg-clip-text text-base leading-7 text-transparent">
              Manage brands, campaigns, and creator approvals from one focused portal.
            </p>

            <div className="auth-reveal relative mt-10 flex min-h-[260px] items-center justify-center gap-7">
              {previewCards.map((card, index) => {
                const Icon = card.icon

                return (
                  <div
                    key={card.label}
                    className={`auth-float relative will-change-transform ${index === 1 ? 'mt-16' : index === 2 ? '-mt-4' : 'mt-3'}`}
                  >
                    <div className={`auth-ring pointer-events-none absolute -inset-3 rounded-full border border-dashed border-white/90 bg-gradient-to-br ${card.accent} opacity-35 blur-[0.2px]`} />
                    <div className="auth-metric group relative flex size-44 flex-col items-center justify-center overflow-hidden rounded-full border border-white/90 bg-white/[0.78] p-5 text-center shadow-[0_24px_70px_rgb(15_118_110/.12)] ring-1 ring-white/75 backdrop-blur-xl will-change-transform xl:size-48">
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-[0.09]`} />
                      <span className={`auth-liquid absolute -right-8 -top-8 size-24 rounded-full bg-gradient-to-br ${card.accent} opacity-25 blur-2xl`} />
                      <span className={`auth-liquid absolute -bottom-10 left-5 size-28 rounded-full bg-gradient-to-tr ${card.accent} opacity-[0.16] blur-2xl`} />
                      <svg
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 w-full opacity-65 transition-opacity duration-500 group-hover:opacity-90"
                        viewBox="0 0 260 64"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M0 38 C42 18 76 58 118 36 C158 15 190 28 260 8 V64 H0 Z"
                          fill={card.wave}
                          opacity="0.09"
                        />
                        <path
                          d="M0 42 C48 20 78 53 122 36 C165 18 197 31 260 14"
                          fill="none"
                          stroke={card.wave}
                          strokeWidth="1.5"
                          opacity="0.42"
                        />
                      </svg>
                      <span className={`relative flex size-10 items-center justify-center rounded-full border shadow-sm ${card.iconTone}`}>
                          <Icon className="size-4" />
                      </span>
                      <p className="relative mt-3 text-[11px] font-semibold uppercase text-slate-500">{card.label}</p>
                      <p
                        className="auth-counter relative mt-1 bg-gradient-to-r from-slate-800 to-slate-500 bg-clip-text text-4xl font-semibold tracking-normal text-transparent"
                        data-value={card.value}
                        data-suffix={card.suffix}
                      >
                        {card.value}{card.suffix}
                      </p>
                      <p className="relative mt-0.5 max-w-28 text-xs font-medium leading-4 text-slate-500">{card.detail}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </section>

        <section className="flex h-dvh items-stretch justify-center overflow-hidden bg-[#fffdf8]/[0.72] text-slate-800 backdrop-blur-xl">
          <div className="auth-panel flex w-full">
            {children}
          </div>
        </section>
      </main>
    </div>
  )
}
