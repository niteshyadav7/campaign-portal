import type { Metadata } from 'next'
import { RouteFallback } from '@/components/route-fallback'

export const metadata: Metadata = {
  title: 'Page not found - 1to7 Media',
}

export default function NotFound() {
  return (
    <RouteFallback
      eyebrow="404 / Not found"
      title="This workspace page does not exist."
      description="The link may be old, the campaign may have moved, or this route is not available for your current portal."
      code="404"
      details="Nothing is broken. Return to the portal home and continue from the correct workspace."
    />
  )
}
