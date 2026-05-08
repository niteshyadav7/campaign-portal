'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      router.replace(profile?.role === 'super_admin' ? '/admin' : '/dashboard')
    }
  }

  return (
    <div className="relative flex h-full w-full overflow-hidden">
      <div className="relative flex h-full w-full flex-col justify-center overflow-hidden border-l border-emerald-100/80 bg-[#fffdf8]/[0.92] px-5 py-8 shadow-[inset_1px_0_0_rgb(255_255_255/.86)] backdrop-blur-2xl sm:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_48%_38%,rgb(20_184_166/.11),transparent_31%),radial-gradient(circle_at_82%_76%,rgb(56_189_248/.09),transparent_27%),linear-gradient(180deg,rgb(255_255_255/.28),transparent_42%)]" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-emerald-300/70 to-transparent" />
        <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-teal-300/80 to-transparent" />
        <div className="relative mr-auto flex h-full w-full max-w-[560px] items-center">
          <div className="absolute inset-y-0 -left-8 -right-8 bg-[radial-gradient(circle_at_50%_24%,rgb(255_255_255/.88),transparent_60%)]" />
          <div className="relative flex h-full w-full flex-col justify-center border-x border-white/[0.65] bg-white/[0.38] p-6 shadow-[0_18px_70px_rgb(15_118_110/.07)] ring-1 ring-white/70 backdrop-blur-xl sm:p-8">
            <div className="relative overflow-hidden border-b border-emerald-100/70 pb-6 text-center text-slate-800">
              <div className="mx-auto mb-4 flex size-[56px] items-center justify-center rounded-[8px] border border-white/80 bg-gradient-to-br from-emerald-50 via-white to-sky-50 text-teal-700 shadow-lg shadow-emerald-900/10 backdrop-blur">
                <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-sky-500 text-white shadow-md shadow-teal-700/20">
                  <Sparkles className="size-5" />
                </div>
              </div>
              <h1 className="bg-gradient-to-r from-emerald-700 via-teal-600 to-sky-600 bg-clip-text text-[1.85rem] font-semibold leading-tight text-transparent">
                Welcome back
              </h1>
              <p className="relative mx-auto mt-3 max-w-sm bg-gradient-to-r from-slate-500 to-teal-700 bg-clip-text text-sm leading-6 text-transparent">
                Access your campaign portal.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4 pt-6">
              {error && (
                <div className="rounded-[8px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-teal-600/75" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="h-[52px] rounded-[8px] border-emerald-100 bg-white/[0.72] pl-11 text-base font-normal text-slate-800 shadow-sm shadow-emerald-900/[0.02] placeholder:text-slate-400 focus-visible:border-teal-400/70 focus-visible:bg-white/95 focus-visible:ring-teal-400/20"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-teal-600/75" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="h-[52px] rounded-[8px] border-emerald-100 bg-white/[0.72] px-11 text-base font-normal text-slate-800 shadow-sm shadow-emerald-900/[0.02] placeholder:text-slate-400 focus-visible:border-teal-400/70 focus-visible:bg-white/95 focus-visible:ring-teal-400/20"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[8px] text-slate-400 transition-colors hover:bg-emerald-50 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal-400/20"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-[52px] w-full cursor-pointer rounded-[8px] bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-base font-medium text-white shadow-lg shadow-emerald-700/20 transition-colors hover:from-emerald-500 hover:via-teal-500 hover:to-sky-400"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Signing in
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign in
                    <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
