'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { BarChart3, Building2, ChevronRight, FileText, LogOut, Users } from 'lucide-react'
import { signOut } from '@/lib/actions'
import { cn } from '@/lib/utils'
import { InitialAvatar } from '@/components/premium-ui'
import type { Profile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

const navItems = [
  { title: 'Dashboard', href: '/admin', icon: BarChart3, meta: 'Overview' },
  { title: 'Brands', href: '/admin/brands', icon: Building2, meta: 'Clients' },
  { title: 'Campaigns', href: '/admin/campaigns', icon: FileText, meta: 'Pipeline' },
  { title: 'Influencers', href: '/admin/influencers', icon: Users, meta: 'Talent' },
]

export function AdminSidebar({ user, profile }: { user: User; profile: Profile }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <motion.aside
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-screen w-72 shrink-0 flex-col overflow-hidden border-r border-white/10 bg-[#050914] text-slate-100"
    >
      <div className="absolute inset-0 premium-grid opacity-25" />

      <div className="relative border-b border-white/10 p-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.055] p-3 shadow-xl shadow-black/15">
          <div className="flex items-center gap-3">
            <div className="relative flex size-11 items-center justify-center rounded-lg bg-white text-sm font-black text-slate-950 shadow-lg">
              1to7
              <span className="absolute -right-1 -top-1 size-3 rounded-full bg-emerald-400 ring-2 ring-[#030817]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-black tracking-normal text-white">1to7 Media</h2>
              <p className="text-xs font-medium text-slate-400">Admin command center</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2.5 py-1 text-[11px] font-black text-emerald-200">
              Live
            </span>
            <span className="rounded-full border border-blue-300/20 bg-blue-300/10 px-2.5 py-1 text-[11px] font-black text-blue-200">
              Agency
            </span>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <nav className="space-y-1.5">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + index * 0.04 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-300',
                    isActive
                      ? 'border-white/20 bg-white text-slate-950 shadow-xl shadow-black/20'
                      : 'border-white/0 text-slate-400 hover:border-white/10 hover:bg-white/[0.07] hover:text-white'
                  )}
                >
                  {isActive ? (
                    <span className="absolute -left-4 h-8 w-1 rounded-r-full bg-emerald-300 shadow-lg shadow-emerald-300/40" />
                  ) : null}
                  <span className={cn(
                    'flex size-8 items-center justify-center rounded-md transition-colors',
                    isActive ? 'bg-slate-950 text-emerald-300' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                  )}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-black leading-tight">{item.title}</span>
                    <span className={cn('block text-xs font-medium', isActive ? 'text-slate-500' : 'text-slate-500')}>
                      {item.meta}
                    </span>
                  </span>
                  <ChevronRight className={cn('size-4 transition-transform group-hover:translate-x-0.5', isActive ? 'text-slate-500' : 'text-slate-600')} />
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      <div className="relative shrink-0 border-t border-white/10 bg-[#050914]/95 p-4 shadow-2xl shadow-black">
        <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3 shadow-xl shadow-black/15">
          <div className="flex items-center gap-3">
            <InitialAvatar name={profile?.full_name || user.email} tone="emerald" size="md" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-white">{profile?.full_name || 'Agency Admin'}</p>
              <p className="truncate text-xs font-medium text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-3 flex w-full cursor-pointer items-center justify-between rounded-lg border border-rose-300/30 bg-rose-500 px-3 py-2.5 text-sm font-black text-white shadow-lg shadow-rose-950/30 transition-all hover:-translate-y-0.5 hover:bg-rose-400"
        >
          <span className="flex items-center gap-2">
            <LogOut className="size-4" />
            Sign out
          </span>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </motion.aside>
  )
}
