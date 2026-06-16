'use client'

import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'

type ShortlistedCreator = {
  name: string
  handle: string
  followers: number
  location: string
  contact: string
}

export function ExportShortlistButton({
  campaignName,
  creators,
}: {
  campaignName: string
  creators: ShortlistedCreator[]
}) {
  const handleExport = () => {
    if (creators.length === 0) return

    const headers = ['Name', 'Instagram Handle', 'Followers', 'Location', 'Contact Number']
    const rows = creators.map((c) => [
      c.name,
      c.handle,
      c.followers.toString(),
      c.location,
      c.contact,
    ])
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${campaignName.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_shortlist.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={creators.length === 0}
      onClick={handleExport}
      className="cursor-pointer border-slate-200 bg-white font-medium text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-teal-700"
    >
      <Download className="mr-1.5 size-4" />
      Export Shortlist ({creators.length})
    </Button>
  )
}
