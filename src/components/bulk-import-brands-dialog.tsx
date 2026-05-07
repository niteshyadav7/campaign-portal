'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, FileSpreadsheet, Loader2, Upload } from 'lucide-react'
import { bulkCreateBrands } from '@/lib/actions'
import { guessCsvMapping, parseCsv } from '@/lib/csv-import'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { PremiumDialogFrame } from '@/components/premium-dialog'

type FieldKey = 'name'

const fieldAliases: Record<FieldKey, string[]> = {
  name: ['name', 'brand', 'brand name', 'client', 'client name', 'company', 'company name'],
}

export function BulkImportBrandsDialog() {
  const [open, setOpen] = useState(false)
  const [csvText, setCsvText] = useState('')
  const [mapping, setMapping] = useState<Record<FieldKey, string>>({ name: '' })
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
        extra_fields: Object.fromEntries(extraHeaders.map((header) => [header, record[header] || '']).filter(([, value]) => value)),
      }
    })
  }, [extraHeaders, mapping.name, parsed.bodyRows, parsed.headers])

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
      setError('Map one CSV column to Brand Name before importing.')
      return
    }

    const formData = new FormData()
    formData.set('rows', JSON.stringify(previewRows))

    startTransition(async () => {
      try {
        await bulkCreateBrands(formData)
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
          icon={Building2}
          eyebrow="Bulk import"
          title="Import Brands"
          description="Upload brand workspaces in bulk. Extra CSV columns become dynamic brand fields."
          accent="violet"
        >
          <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
            <div className="space-y-5">
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                <Label htmlFor="brand-csv-file" className="text-sm font-black text-slate-800">CSV file</Label>
                <input
                  id="brand-csv-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => handleFile(event.target.files?.[0])}
                  className="mt-2 block w-full cursor-pointer rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-black file:text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand-csv-paste" className="text-sm font-black text-slate-800">Or paste CSV</Label>
                <textarea
                  id="brand-csv-paste"
                  value={csvText}
                  onChange={(event) => handleCsvText(event.target.value)}
                  placeholder="brand,industry,region&#10;Nike,Sports,India&#10;Coca-Cola,FMCG,West"
                  className="min-h-36 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              {parsed.headers.length > 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <Label className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Brand Name
                  </Label>
                  <select
                    value={mapping.name}
                    onChange={(event) => setMapping({ name: event.target.value })}
                    className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-950"
                  >
                    <option value="">Do not map</option>
                    {parsed.headers.map((header) => (
                      <option key={header} value={header}>{header}</option>
                    ))}
                  </select>
                </div>
              ) : null}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-950 p-4 text-white">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-300">Import preview</p>
              <p className="mt-3 text-3xl font-black">{previewRows.length}</p>
              <p className="text-sm font-medium text-slate-400">brand rows detected</p>
              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.07] p-3">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">Dynamic fields</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {extraHeaders.length > 0 ? extraHeaders.map((header) => (
                    <span key={header} className="rounded-full bg-violet-300/10 px-2.5 py-1 text-xs font-bold text-violet-200">
                      {header}
                    </span>
                  )) : (
                    <span className="text-sm text-slate-400">No extra columns yet</span>
                  )}
                </div>
              </div>
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
                {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
                Import brands
              </Button>
            </aside>
          </div>
        </PremiumDialogFrame>
      </DialogContent>
    </Dialog>
  )
}
