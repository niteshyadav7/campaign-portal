'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export function MotionStage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!ref.current || reduceMotion) return

    const context = gsap.context(() => {
      gsap.fromTo(
        '.revealable',
        { autoAlpha: 0, y: 18, filter: 'blur(8px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.72,
          ease: 'power3.out',
          stagger: 0.065,
        }
      )

      gsap.fromTo(
        '.premium-rail',
        { scaleY: 0, transformOrigin: 'top' },
        { scaleY: 1, duration: 0.9, ease: 'power4.out' }
      )
    }, ref)

    return () => context.revert()
  }, [reduceMotion])

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      className={cn('motion-stage', className)}
    >
      {children}
    </motion.div>
  )
}
