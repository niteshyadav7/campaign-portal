'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, Loader2, LockKeyhole, Mail, ShieldCheck, Users } from 'lucide-react'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="relative">
      <div className="absolute -inset-px rounded-lg bg-gradient-to-r from-blue-300 via-emerald-300 to-amber-300 opacity-70 blur-sm" />
      <div className="relative overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-2xl shadow-slate-950/15">
        <div className="relative overflow-hidden bg-slate-950 px-7 py-5 text-white">
          <div className="absolute inset-0 premium-grid opacity-25" />
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-lg bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-950/20">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">Secure portal</p>
                <h1 className="mt-1 text-2xl font-black tracking-normal text-white">Welcome back</h1>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.08] px-3 py-1 text-xs font-black text-slate-200">
              <ShieldCheck className="mr-1.5 size-3.5 text-emerald-300" />
              Protected
            </span>
          </div>
          <p className="relative mt-3 text-sm font-medium leading-6 text-slate-300">
            Access your campaign portal.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 px-7 py-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-black text-slate-800">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="h-12 rounded-lg border-slate-200 bg-slate-50 pl-11 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-black text-slate-800">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="h-12 rounded-lg border-slate-200 bg-slate-50 pl-11 text-base font-semibold text-slate-950 placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-emerald-500/20"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-12 w-full cursor-pointer bg-slate-950 text-base font-black text-white shadow-xl shadow-slate-950/20 transition-all hover:-translate-y-0.5 hover:bg-slate-800"
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
  )
}
