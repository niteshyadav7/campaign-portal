'use client'

import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { RouteFallback } from '@/components/route-fallback'

export default function AppError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <RouteFallback
      eyebrow="Runtime error"
      title="The portal hit a temporary issue."
      description="A protected fallback caught the problem so the production UI does not break. Try loading this workspace again."
      code="500"
      tone="error"
      action={
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:from-emerald-500 hover:to-teal-400"
        >
          <RotateCcw className="mr-2 size-4" />
          Try again
        </button>
      }
      details={error.digest ? `Error digest: ${error.digest}` : 'The issue was logged in the browser console for debugging.'}
    />
  )
}
