'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, KeyRound, Loader2, RefreshCw } from 'lucide-react'
import { updateTeamMemberPassword } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PremiumDialogFrame } from '@/components/premium-dialog'

export function EditUserPasswordDialog({
  userId,
  userEmail,
  userName,
}: {
  userId: string
  userEmail: string
  userName: string
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
    let pass = ''
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setPassword(pass)
    setShowPassword(true)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData()
    formData.set('user_id', userId)
    formData.set('password', password)

    try {
      await updateTeamMemberPassword(formData)
      setSuccess(true)
      setPassword('')
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
        router.refresh()
      }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) {
        setPassword('')
        setError(null)
        setSuccess(false)
      }
    }}>
      <DialogTrigger render={
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer border-slate-200 bg-white font-medium text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-teal-700"
          aria-label={`Reset password for ${userName}`}
        />
      }>
        <KeyRound className="mr-1 size-3.5" />
        Reset Password
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-4xl">
        <PremiumDialogFrame
          icon={KeyRound}
          eyebrow="Security"
          title="Reset Password"
          description={`Update login credentials for ${userName || userEmail}.`}
          accent="blue"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Password updated successfully! Closing...
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="new_password" className="text-sm font-medium text-slate-800">
                  New Password
                </Label>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="flex items-center gap-1 text-xs font-medium text-teal-600 transition-colors hover:text-teal-700 focus:outline-none"
                >
                  <RefreshCw className="size-3" />
                  Generate Secure Password
                </button>
              </div>
              <div className="relative">
                <Input
                  id="new_password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter or generate a new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading || success}
                  className="h-12 rounded-lg border-emerald-100 bg-white/80 pr-12 text-base font-medium text-slate-800 placeholder:text-slate-400 focus:border-emerald-500/50"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-emerald-50 hover:text-teal-700 focus-visible:outline-none"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Min. 6 characters. Make sure to copy the generated password and share it securely.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || success || !password}
              className="h-12 w-full cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 text-base font-medium text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:via-teal-500 hover:to-sky-400"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : null}
              {loading ? 'Updating Password' : 'Save New Password'}
            </Button>
          </form>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
