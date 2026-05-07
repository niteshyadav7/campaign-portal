'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, LockKeyhole, Mail, Users } from 'lucide-react'
import { createClient } from '@/lib/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

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
    <Card className="overflow-hidden border-white/70 bg-white/90 shadow-xl shadow-slate-900/10 backdrop-blur">
      <CardHeader className="space-y-3 pb-4 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm">
          <Users className="size-6" />
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold tracking-tight text-slate-950">Welcome back</CardTitle>
          <CardDescription className="mt-2 text-slate-500">
            Sign in to manage campaign shortlists and creator approvals.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 border-slate-200 bg-white pl-9 text-slate-950 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">Password</Label>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-10 border-slate-200 bg-white pl-9 text-slate-950 placeholder:text-slate-400 focus:border-blue-500/50 focus:ring-blue-500/20"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-10 w-full cursor-pointer bg-slate-950 font-semibold text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Signing in
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
