'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { BarChart3, Building2, ChevronRight, FileText, LogOut, Users, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
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
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
  }

  return (
    <motion.aside
      initial={{ x: -18, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative z-20 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-slate-50 text-slate-700 transition-[width] duration-300 ease-in-out pt-2",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-7 z-50 flex size-6 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-transform hover:scale-110 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <ChevronRight className={cn("size-3.5 transition-transform duration-300", isCollapsed ? "rotate-0" : "rotate-180")} />
      </button>

      <div className="relative flex h-[72px] shrink-0 items-center border-b border-slate-200 px-5">
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed ? "w-10" : "w-full")}>
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white shadow-sm">
            BP
          </div>
          <div className={cn("min-w-0 flex-1 whitespace-nowrap transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
            <h2 className="truncate text-sm font-semibold tracking-normal text-slate-900">Brands Portal</h2>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href)

            const navLink = (
                <Link
                  href={item.href}
                  title={isCollapsed ? item.title : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-md transition-all duration-200',
                    isCollapsed ? 'mx-auto h-10 w-10 justify-center' : 'px-3 py-2',
                    isActive
                      ? 'bg-emerald-50/80 text-emerald-950'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  )}
                >
                  {isActive && !isCollapsed ? (
                    <span className="absolute left-0 top-1/2 -mt-3 h-6 w-1 rounded-r-md bg-emerald-500" />
                  ) : null}
                  <Icon className={cn(
                    'size-5 shrink-0 transition-colors',
                    isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'
                  )} />
                  <div className={cn("min-w-0 flex-1 whitespace-nowrap overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
                    <div className="truncate text-sm font-medium leading-tight">{item.title}</div>
                    {item.meta && (
                      <div className={cn("mt-0.5 truncate text-[11px] font-medium transition-colors", isActive ? "text-emerald-700/70" : "text-slate-400")}>
                        {item.meta}
                      </div>
                    )}
                  </div>
                </Link>
            )

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + index * 0.04 }}
              >
                {navLink}
              </motion.div>
            )
          })}
        </nav>
      </div>

      <div className={cn("relative shrink-0 border-t border-slate-200 transition-all duration-300", isCollapsed ? "p-3" : "p-4")}>
        <div className={cn("flex items-center gap-3 overflow-hidden transition-all duration-300", isCollapsed ? "mx-auto w-8 justify-center" : "w-full px-2")}>
          <InitialAvatar name={profile?.full_name || user.email} tone="slate" size="sm" />
          <div className={cn("min-w-0 flex-1 whitespace-nowrap transition-opacity duration-300", isCollapsed ? "opacity-0" : "opacity-100")}>
            <p className="truncate text-sm font-medium text-slate-900">{profile?.full_name || 'Agency Admin'}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
        </div>
        
        <div className={cn("mt-4 flex overflow-hidden", isCollapsed && "justify-center")}>
          <button
            onClick={handleSignOut}
            title={isCollapsed ? "Sign out" : undefined}
            className={cn(
              "group flex cursor-pointer items-center transition-colors hover:bg-rose-50 hover:text-rose-700",
              isCollapsed ? "size-10 justify-center rounded-md text-slate-600" : "w-full gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600"
            )}
          >
            <LogOut className="size-5 shrink-0 text-slate-400 transition-colors group-hover:text-rose-500" />
            {!isCollapsed && "Sign out"}
          </button>
        </div>
      </div>
    </motion.aside>
  )
}
