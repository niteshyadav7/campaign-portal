'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from '@/lib/actions'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'

const navItems = [
  {
    title: 'Campaigns',
    href: '/dashboard',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14,2 14,8 20,8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
]

export function BrandSidebar({ user, profile }: { user: User; profile: any }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-xs">
              {(profile?.brands?.name || 'B')[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-zinc-900 text-sm">{profile?.brands?.name || 'Brand Portal'}</h2>
            <p className="text-xs text-zinc-500">Campaign Portal</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              )}
            >
              {item.icon}
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-zinc-100">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white text-xs font-bold">
            {(profile?.full_name || user.email || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-zinc-900 truncate">{profile?.full_name || 'User'}</p>
            <p className="text-xs text-zinc-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="mt-2 w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16,17 21,12 16,7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
