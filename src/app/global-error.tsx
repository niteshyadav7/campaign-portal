'use client'

import { useEffect } from 'react'
import { RotateCcw } from 'lucide-react'
import { RouteFallback } from '@/components/route-fallback'
import './globals.css'

export default function GlobalError({
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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">
        <RouteFallback
          eyebrow="Critical fallback"
          title="The portal recovered from a serious issue."
          description="The root application shell failed to render, but this production fallback keeps the experience controlled."
          code="500"
          tone="error"
          action={
            <button
              type="button"
              onClick={() => unstable_retry()}
              className="inline-flex h-10 cursor-pointer items-center justify-center rounded-lg bg-white px-4 text-sm font-black text-slate-950 shadow-lg shadow-black/20 transition-colors hover:bg-slate-200"
            >
              <RotateCcw className="mr-2 size-4" />
              Try again
            </button>
          }
          details={error.digest ? `Error digest: ${error.digest}` : 'The root error was logged in the browser console for debugging.'}
        />
      </body>
    </html>
  )
}
