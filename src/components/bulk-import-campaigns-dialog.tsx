'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileSpreadsheet, FileText, Loader2, Upload } from 'lucide-react'
import { bulkCreateCampaigns } from '@/lib/actions'
import { guessCsvMapping, parseCsv } from '@/lib/csv-import'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PremiumDialogFrame } from '@/components/premium-dialog'

type FieldKey = 'name' | 'brand' | 'brand_id' | 'status'

const fieldLabels: Record<FieldKey, string> = {
  name: 'Campaign Name',
  brand: 'Brand Name',
  brand_id: 'Brand ID',
  status: 'Status',
}

const fieldAliases: Record<FieldKey, string[]> = {
  name: ['name', 'campaign', 'campaign name', 'title', 'brief'],
  brand: ['brand', 'brand name', 'client', 'client name', 'company'],
  brand_id: ['brand id', 'brand_id', 'client id', 'client_id'],
  status: ['status', 'state'],
}

export function BulkImportCampaignsDialog() {
  const [open, setOpen] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [mapping, setMapping] = useState<Record<FieldKey, string>>({
    name: '',
    brand: '',
    brand_id: '',
    status: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const parsed = useMemo(() => {
    const rows = parseCsv(csvText)
    return { headers: rows[0] || [], bodyRows: rows.slice(1) }
  }, [csvText])

  const extraHeaders = parsed.headers.filter((header) => !Object.values(mapping).includes(header))

  const previewRows = useMemo(() => {
    return parsed.bodyRows.map((row) => {
      const record = Object.fromEntries(parsed.headers.map((header, index) => [header, row[index] || '']))
      return {
        name: mapping.name ? record[mapping.name] : '',
        brand: mapping.brand ? record[mapping.brand] : '',
        brand_id: mapping.brand_id ? record[mapping.brand_id] : '',
        status: mapping.status ? record[mapping.status] : 'active',
        extra_fields: Object.fromEntries(extraHeaders.map((header) => [header, record[header] || '']).filter(([, value]) => value)),
      }
    })
  }, [extraHeaders, mapping, parsed.bodyRows, parsed.headers])

  const handleCsvText = (value: string) => {
    setCsvText(value)
    setMapping(guessCsvMapping(parseCsv(value)[0] || [], fieldAliases))
    setError(null)
  }

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    handleCsvText(await file.text())
  }

  const handleImport = () => {
    setError(null)

    if (!mapping.name) {
      setError('Map one CSV column to Campaign Name before importing.')
      return
    }

    if (!mapping.brand && !mapping.brand_id) {
      setError('Map Brand Name or Brand ID so campaigns can be linked.')
      return
    }

    const formData = new FormData()
    formData.set('rows', JSON.stringify(previewRows))

    startTransition(async () => {
      try {
        await bulkCreateCampaigns(formData)
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
      <DialogTrigger render={<Button variant="outline" className="cursor-pointer border-emerald-100 bg-white/80 font-semibold text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 hover:text-teal-700" />}>
        <Upload className="mr-2 size-4" />
        Bulk CSV
      </DialogTrigger>
      <DialogContent className="max-w-[calc(100%-2rem)] border-0 bg-transparent p-0 shadow-none ring-0 sm:max-w-6xl">
        <PremiumDialogFrame
          icon={FileText}
          eyebrow="Bulk import"
          title="Import Campaigns"
          description="Upload campaign records in bulk. Brand names must match existing brands."
          accent="blue"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <Label htmlFor="campaign-csv-file" className="text-sm font-semibold text-slate-800">CSV file</Label>
                <input
                  id="campaign-csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                  className="mt-2 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-teal-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="campaign-csv-paste" className="text-sm font-semibold text-slate-800">Or paste CSV</Label>
                <textarea
                  id="campaign-csv-paste"
                  value={csvText}
                  onChange={(event) => handleCsvText(event.target.value)}
                  placeholder="campaign,brand,status,budget&#10;Summer Launch,Nike,active,500000&#10;Festive Push,Coca-Cola,active,300000"
                  className="min-h-36 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              {parsed.headers.length > 0 ? (
                <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
                  {(Object.keys(fieldLabels) as FieldKey[]).map((field) => (
                    <div key={field} className="space-y-2">
                      <Label className="text-xs font-semibold uppercase text-slate-500">
                        {fieldLabels[field]}
                      </Label>
                      <select
                        value={mapping[field]}
                        onChange={(event) => setMapping((current) => ({ ...current, [field]: event.target.value }))}
                        className="h-10 w-full rounded-md border border-emerald-100 bg-white/80 px-3 text-sm font-medium text-slate-800"
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

            <aside className="rounded-lg border border-white/80 bg-white/[0.82] p-4 text-slate-800 shadow-lg shadow-emerald-900/5">
              <p className="text-xs font-semibold uppercase text-teal-700">Import preview</p>
              <p className="mt-3 text-3xl font-semibold">{previewRows.length}</p>
              <p className="text-sm font-medium text-slate-500">campaign rows detected</p>
              <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Dynamic fields</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extraHeaders.length > 0 ? extraHeaders.map((header) => (
                    <span key={header} className="rounded-full border border-sky-100 bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700">
                      {header}
                    </span>
                  )) : (
                    <span className="text-sm text-slate-500">No extra columns yet</span>
                  )}
                </div>
              </div>
              {previewRows[0] ? (
                <div className="mt-4 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-sm">
                  <p className="font-semibold">{previewRows[0].name || 'Unnamed campaign'}</p>
                  <p className="mt-1 text-slate-500">{previewRows[0].brand || previewRows[0].brand_id || 'No brand mapped'}</p>
                </div>
              ) : null}
              {error ? (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}
              <Button
                type="button"
                onClick={handleImport}
                disabled={isPending || previewRows.length === 0}
                className="mt-5 h-11 w-full cursor-pointer bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-500 font-semibold text-white shadow-lg shadow-emerald-700/[0.15] hover:from-emerald-500 hover:via-teal-500 hover:to-sky-400"
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
                Import campaigns
              </Button>
            </aside>
          </div>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
