'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { bulkCreateInfluencers } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PremiumDialogFrame } from '@/components/premium-dialog'

type FieldKey = 'name' | 'instagram_url' | 'followers' | 'location' | 'contact_number'

const fieldLabels: Record<FieldKey, string> = {
  name: 'Name',
  instagram_url: 'Instagram URL',
  followers: 'Followers',
  location: 'Location',
  contact_number: 'Contact Number',
}

const fieldAliases: Record<FieldKey, string[]> = {
  name: ['name', 'full name', 'influencer', 'influencer name', 'creator', 'creator name'],
  instagram_url: ['instagram', 'instagram url', 'instagram_url', 'ig', 'ig url', 'profile', 'profile url'],
  followers: ['followers', 'follower count', 'reach', 'audience', 'fans'],
  location: ['location', 'city', 'market', 'region'],
  contact_number: ['contact', 'contact number', 'phone', 'phone number', 'mobile', 'whatsapp'],
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    const nextChar = text[index + 1]

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"'
      index += 1
    } else if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      row.push(cell.trim())
      cell = ''
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') index += 1
      row.push(cell.trim())
      if (row.some(Boolean)) rows.push(row)
      row = []
      cell = ''
    } else {
      cell += char
    }
  }

  row.push(cell.trim())
  if (row.some(Boolean)) rows.push(row)

  return rows
}

function guessMapping(headers: string[]): Record<FieldKey, string> {
  return (Object.keys(fieldLabels) as FieldKey[]).reduce((mapping, key) => {
    const match = headers.find((header) => fieldAliases[key].includes(header.trim().toLowerCase()))
    return { ...mapping, [key]: match || '' }
  }, {} as Record<FieldKey, string>)
}

export function BulkImportInfluencersDialog() {
  const [open, setOpen] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [mapping, setMapping] = useState<Record<FieldKey, string>>({
    name: '',
    instagram_url: '',
    followers: '',
    location: '',
    contact_number: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const parsed = useMemo(() => {
    const rows = parseCsv(csvText)
    const headers = rows[0] || []
    const bodyRows = rows.slice(1)
    return { headers, bodyRows }
  }, [csvText])

  const extraHeaders = parsed.headers.filter((header) => !Object.values(mapping).includes(header))

  const previewRows = useMemo(() => {
    return parsed.bodyRows.map((row) => {
      const record = Object.fromEntries(parsed.headers.map((header, index) => [header, row[index] || '']))
      return {
        name: mapping.name ? record[mapping.name] : '',
        instagram_url: mapping.instagram_url ? record[mapping.instagram_url] : '',
        followers: mapping.followers ? record[mapping.followers] : '',
        location: mapping.location ? record[mapping.location] : '',
        contact_number: mapping.contact_number ? record[mapping.contact_number] : '',
        extra_fields: Object.fromEntries(extraHeaders.map((header) => [header, record[header] || '']).filter(([, value]) => value)),
      }
    })
  }, [extraHeaders, mapping, parsed.bodyRows, parsed.headers])

  const handleCsvText = (value: string) => {
    setCsvText(value)
    const rows = parseCsv(value)
    const headers = rows[0] || []
    setMapping(guessMapping(headers))
    setError(null)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    handleCsvText(await file.text())
  }

  const handleImport = () => {
    setError(null)

    if (!mapping.name) {
      setError('Map one CSV column to Name before importing.')
      return
    }

    const formData = new FormData()
    formData.set('rows', JSON.stringify(previewRows))

    startTransition(async () => {
      try {
        await bulkCreateInfluencers(formData)
        setOpen(false)
        setCsvText('')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Import failed')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer border-slate-300 bg-white font-black text-slate-950 shadow-lg shadow-slate-950/15 hover:border-emerald-300 hover:bg-emerald-50" />}>
        <Upload className="mr-2 size-4" />
        Bulk CSV
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-6xl">
        <PremiumDialogFrame
          icon={FileSpreadsheet}
          eyebrow="Bulk import"
          title="Import CSV"
          description="Upload many creators at once. Unmapped columns are saved as custom dynamic fields."
          accent="emerald"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <Label htmlFor="csv-file" className="text-sm font-black text-slate-800">CSV file</Label>
                <input
                  id="csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                  className="mt-2 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="csv-paste" className="text-sm font-black text-slate-800">Or paste CSV</Label>
                <textarea
                  id="csv-paste"
                  value={csvText}
                  onChange={(event) => handleCsvText(event.target.value)}
                  placeholder="name,instagram,followers,location,category&#10;Neha Kumari,https://instagram.com/neha,4600,Delhi,Fashion"
                  className="min-h-36 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              {parsed.headers.length > 0 ? (
                <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
                  {(Object.keys(fieldLabels) as FieldKey[]).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                        {fieldLabels[field]}
                      </Label>
                      <select
                        value={mapping[field]}
                        onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value }))}
                        className="h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-950"
                      >
                        <option value="">Do not map</option>
                        {parsed.headers.map((header) => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Import preview</p>
              <p className="mt-3 text-3xl font-black">{previewRows.length}</p>
              <p className="text-sm font-medium text-slate-400">creator rows detected</p>
              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.07] p-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Dynamic fields</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extraHeaders.length > 0 ? extraHeaders.map((header) => (
                    <span key={header} className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs font-bold text-emerald-200">
                      {header}
                    </span>
                  )) : (
                    <span className="text-sm text-slate-400">No extra columns yet</span>
                  )}
                </div>
              </div>
              {previewRows[0] ? (
                <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.07] p-3 text-sm">
                  <p className="font-black">{previewRows[0].name || 'Unnamed creator'}</p>
                  <p className="mt-1 text-slate-400">{previewRows[0].instagram_url || 'No Instagram URL'}</p>
                </div>
              ) : null}
              {error ? (
                <div className="mt-4 rounded-lg border border-red-300/20 bg-red-500/10 p-3 text-sm font-semibold text-red-100">
                  {error}
                </div>
              ) : null}
              <Button
                type="button"
                onClick={handleImport}
                disabled={isPending || previewRows.length === 0}
                className="mt-5 h-11 w-full cursor-pointer bg-emerald-400 font-black text-slate-950 hover:bg-emerald-300"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                Import creators
              </Button>
            </aside>
          </div>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
