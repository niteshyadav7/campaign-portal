'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  FilterX,
  MapPin,
  Phone,
  Search,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { InitialAvatar } from '@/components/premium-ui'
import { SocialQuickActions } from '@/components/social-quick-actions'
import type { Influencer } from '@/lib/types'

type SortField = 'name' | 'instagram' | 'followers' | 'location'
type SortOrder = 'asc' | 'desc' | null

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export function InfluencerPoolTable({ initialInfluencers }: { initialInfluencers: Influencer[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  // Column Filters State
  const [showFilters, setShowFilters] = useState(false)
  const [colFilters, setColFilters] = useState({
    name: '',
    instagram: '',
    reach: 'all', // 'all' | 'nano' | 'micro' | 'mid' | 'macro' | 'mega'
    location: '',
    contact: '',
    custom: '',
  })

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (colFilters.name.trim()) count++
    if (colFilters.instagram.trim()) count++
    if (colFilters.reach !== 'all') count++
    if (colFilters.location.trim()) count++
    if (colFilters.contact.trim()) count++
    if (colFilters.custom.trim()) count++
    return count
  }, [colFilters])

  const handleClearFilters = () => {
    setColFilters({
      name: '',
      instagram: '',
      reach: 'all',
      location: '',
      contact: '',
      custom: '',
    })
    setSearchQuery('')
    setCurrentPage(1)
  }

  // 1. Filter influencers (both Global search and Column-Specific filters)
  const filteredInfluencers = useMemo(() => {
    return initialInfluencers.filter((inf) => {
      // Global Search Match
      const query = searchQuery.toLowerCase().trim()
      if (query) {
        const nameMatch = inf.name.toLowerCase().includes(query)
        const locationMatch = inf.location?.toLowerCase().includes(query) || false
        const handleMatch = inf.instagram_url?.toLowerCase().includes(query) || false
        const contactMatch = inf.contact_number?.includes(query) || false
        const extraMatch = inf.extra_fields
          ? Object.values(inf.extra_fields).some((val) =>
              val?.toString().toLowerCase().includes(query)
            )
          : false

        const matchGlobal = nameMatch || locationMatch || handleMatch || contactMatch || extraMatch
        if (!matchGlobal) return false
      }

      // Column-Specific Filter Matches
      if (colFilters.name.trim()) {
        const q = colFilters.name.toLowerCase().trim()
        if (!inf.name.toLowerCase().includes(q)) return false
      }

      if (colFilters.instagram.trim()) {
        const q = colFilters.instagram.toLowerCase().trim()
        const handle = (inf.instagram_url || '').toLowerCase()
        if (!handle.includes(q)) return false
      }

      if (colFilters.reach !== 'all') {
        const followers = inf.followers || 0
        if (colFilters.reach === 'nano' && followers >= 10000) return false
        if (colFilters.reach === 'micro' && (followers < 10000 || followers >= 50000)) return false
        if (colFilters.reach === 'mid' && (followers < 50000 || followers >= 100000)) return false
        if (colFilters.reach === 'macro' && (followers < 100000 || followers >= 500000)) return false
        if (colFilters.reach === 'mega' && followers < 500000) return false
      }

      if (colFilters.location.trim()) {
        const q = colFilters.location.toLowerCase().trim()
        if (!inf.location?.toLowerCase().includes(q)) return false
      }

      if (colFilters.contact.trim()) {
        const q = colFilters.contact.toLowerCase().trim()
        const contactVal = (inf.contact_number || '').toLowerCase()
        if (!contactVal.includes(q)) return false
      }

      if (colFilters.custom.trim()) {
        const q = colFilters.custom.toLowerCase().trim()
        const extraMatch = inf.extra_fields
          ? Object.entries(inf.extra_fields).some(([k, v]) =>
              k.toLowerCase().includes(q) || v?.toString().toLowerCase().includes(q)
            )
          : false
        if (!extraMatch) return false
      }

      return true
    })
  }, [initialInfluencers, searchQuery, colFilters])

  // 2. Sort influencers
  const sortedInfluencers = useMemo(() => {
    if (!sortField || !sortOrder) return filteredInfluencers

    return [...filteredInfluencers].sort((a, b) => {
      let valA: any = ''
      let valB: any = ''

      if (sortField === 'name') {
        valA = a.name.toLowerCase()
        valB = b.name.toLowerCase()
      } else if (sortField === 'instagram') {
        valA = (a.instagram_url || '').toLowerCase()
        valB = (b.instagram_url || '').toLowerCase()
      } else if (sortField === 'followers') {
        valA = a.followers || 0
        valB = b.followers || 0
      } else if (sortField === 'location') {
        valA = (a.location || '').toLowerCase()
        valB = (b.location || '').toLowerCase()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredInfluencers, sortField, sortOrder])

  // 3. Paginate influencers
  const paginatedInfluencers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedInfluencers.slice(startIndex, startIndex + pageSize)
  }, [sortedInfluencers, currentPage, pageSize])

  const totalPages = Math.ceil(sortedInfluencers.length / pageSize)

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortOrder === 'asc') {
        setSortOrder('desc')
      } else if (sortOrder === 'desc') {
        setSortField(null)
        setSortOrder(null)
      } else {
        setSortOrder('asc')
      }
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
    setCurrentPage(1) // reset page
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1) // reset page on search
  }

  const handleColFilterChange = (field: keyof typeof colFilters, value: string) => {
    setColFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
    setCurrentPage(1)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3.5 text-slate-400 transition-colors group-hover:text-slate-650" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="size-3.5 text-teal-650" />
    ) : (
      <ArrowDown className="size-3.5 text-teal-655" />
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar & Page Size controls */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search creator pool by name, handle, location..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-sm text-slate-800 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-all cursor-pointer ${
                showFilters || activeFilterCount > 0
                  ? 'border-teal-200 bg-teal-50 text-teal-700 hover:bg-teal-100/80'
                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="size-4" />
              <span>Column Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {(activeFilterCount > 0 || searchQuery) && (
              <button
                onClick={handleClearFilters}
                className="flex h-10 items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 text-sm font-semibold text-red-650 hover:bg-red-100/80 transition-all cursor-pointer"
                title="Clear all filters"
              >
                <FilterX className="size-4" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 outline-none focus:border-teal-500/50"
            >
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          </div>
          <span className="rounded-full border border-emerald-250 bg-emerald-50 px-3 py-1.5 font-bold text-emerald-700">
            {filteredInfluencers.length} profiles found
          </span>
        </div>
      </div>

      {/* Main Table */}
      <Table>
        <TableHeader>
          <TableRow className="border-slate-200 bg-slate-55 hover:bg-slate-55">
            <TableHead
              className={`group h-12 px-5 text-xs font-bold uppercase transition-colors cursor-pointer select-none hover:text-slate-800 ${
                sortField === 'name' ? 'bg-teal-50/45 text-teal-850 font-extrabold' : 'text-slate-500'
              }`}
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-1.5">
                Creator
                {renderSortIcon('name')}
              </div>
            </TableHead>
            <TableHead
              className={`group h-12 text-xs font-bold uppercase transition-colors hidden sm:table-cell cursor-pointer select-none hover:text-slate-800 ${
                sortField === 'instagram' ? 'bg-teal-50/45 text-teal-850 font-extrabold' : 'text-slate-500'
              }`}
              onClick={() => handleSort('instagram')}
            >
              <div className="flex items-center gap-1.5">
                Instagram
                {renderSortIcon('instagram')}
              </div>
            </TableHead>
            <TableHead
              className={`group h-12 text-xs font-bold uppercase transition-colors cursor-pointer select-none hover:text-slate-800 ${
                sortField === 'followers' ? 'bg-teal-50/45 text-teal-850 font-extrabold' : 'text-slate-500'
              }`}
              onClick={() => handleSort('followers')}
            >
              <div className="flex items-center gap-1.5">
                Reach
                {renderSortIcon('followers')}
              </div>
            </TableHead>
            <TableHead
              className={`group h-12 text-xs font-bold uppercase transition-colors hidden md:table-cell cursor-pointer select-none hover:text-slate-800 ${
                sortField === 'location' ? 'bg-teal-50/45 text-teal-850 font-extrabold' : 'text-slate-500'
              }`}
              onClick={() => handleSort('location')}
            >
              <div className="flex items-center gap-1.5">
                Market
                {renderSortIcon('location')}
              </div>
            </TableHead>
            <TableHead className="h-12 text-xs font-bold uppercase text-slate-500 hidden lg:table-cell">Contact</TableHead>
            <TableHead className="h-12 text-xs font-bold uppercase text-slate-500 hidden xl:table-cell">Custom</TableHead>
          </TableRow>

          {/* Column Filters Input Row */}
          {showFilters && (
            <TableRow className="border-b border-slate-200 bg-slate-50/40 hover:bg-slate-50/40">
              <TableHead className="px-5 py-2">
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={colFilters.name}
                  onChange={(e) => handleColFilterChange('name', e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400 transition-all"
                />
              </TableHead>
              <TableHead className="py-2 hidden sm:table-cell">
                <input
                  type="text"
                  placeholder="Filter handle/url..."
                  value={colFilters.instagram}
                  onChange={(e) => handleColFilterChange('instagram', e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400 transition-all"
                />
              </TableHead>
              <TableHead className="py-2">
                <select
                  value={colFilters.reach}
                  onChange={(e) => handleColFilterChange('reach', e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10"
                >
                  <option value="all">All Reach</option>
                  <option value="nano">Nano (&lt;10K)</option>
                  <option value="micro">Micro (10K-50K)</option>
                  <option value="mid">Mid (50K-100K)</option>
                  <option value="macro">Macro (100K-500K)</option>
                  <option value="mega">Mega (500K+)</option>
                </select>
              </TableHead>
              <TableHead className="py-2 hidden md:table-cell">
                <input
                  type="text"
                  placeholder="Filter market..."
                  value={colFilters.location}
                  onChange={(e) => handleColFilterChange('location', e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400 transition-all"
                />
              </TableHead>
              <TableHead className="py-2 hidden lg:table-cell">
                <input
                  type="text"
                  placeholder="Filter contact..."
                  value={colFilters.contact}
                  onChange={(e) => handleColFilterChange('contact', e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400 transition-all"
                />
              </TableHead>
              <TableHead className="py-2 hidden xl:table-cell">
                <input
                  type="text"
                  placeholder="Filter custom..."
                  value={colFilters.custom}
                  onChange={(e) => handleColFilterChange('custom', e.target.value)}
                  className="h-8 w-full rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-800 outline-none focus:border-teal-500/50 focus:ring-2 focus:ring-teal-500/10 placeholder:text-slate-400 transition-all"
                />
              </TableHead>
            </TableRow>
          )}
        </TableHeader>
        <TableBody>
          {paginatedInfluencers.map((influencer) => {
            const extraFields = Object.entries(influencer.extra_fields || {})

            return (
              <TableRow key={influencer.id} className="border-slate-100 hover:bg-emerald-50/30">
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <InitialAvatar name={influencer.name} tone="emerald" size="md" />
                    <div>
                      <span className="font-semibold text-slate-900">{influencer.name}</span>
                      <p className="text-xs font-medium text-slate-500">Influencer profile</p>
                      {/* Mobile Stacked Info */}
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500 sm:hidden">
                        {influencer.instagram_url && (
                          <a
                            href={influencer.instagram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sky-605 hover:underline"
                          >
                            @{influencer.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                          </a>
                        )}
                        {influencer.location && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-0.5">
                              <MapPin className="size-3" />
                              {influencer.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {influencer.instagram_url ? (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <a
                        href={influencer.instagram_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-sky-700 transition-colors hover:text-sky-900"
                      >
                        @{influencer.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                        <ExternalLink className="size-3.5" />
                      </a>
                      <SocialQuickActions instagramUrl={influencer.instagram_url} />
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full border-sky-200 bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-750">
                    {formatFollowers(influencer.followers)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-650 hidden md:table-cell">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-slate-400" />
                    {influencer.location || '-'}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-medium text-slate-650 hidden lg:table-cell">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="size-3.5 text-slate-400" />
                    {influencer.contact_number || '-'}
                  </span>
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  {extraFields.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {extraFields.slice(0, 2).map(([key, value]) => (
                        <span key={key} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                          {key}: {value}
                        </span>
                      ))}
                      {extraFields.length > 2 ? (
                        <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          +{extraFields.length - 2}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
          {sortedInfluencers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-12 text-center text-sm font-medium text-slate-500">
                No influencers match your search criteria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white/80 px-5 py-4">
          <p className="text-xs font-semibold text-slate-505">
            Showing <span className="text-slate-800">{Math.min((currentPage - 1) * pageSize + 1, sortedInfluencers.length)}</span> to{' '}
            <span className="text-slate-800">{Math.min(currentPage * pageSize, sortedInfluencers.length)}</span> of{' '}
            <span className="text-slate-850 font-bold">{sortedInfluencers.length}</span> profiles
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center size-8 rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, index) => {
              const pageNum = index + 1
              const isCurrent = pageNum === currentPage
              // Simple pagination ellipse for large page counts
              if (
                totalPages > 6 &&
                pageNum !== 1 &&
                pageNum !== totalPages &&
                Math.abs(pageNum - currentPage) > 1
              ) {
                if (pageNum === 2 && currentPage > 3) return <span key={pageNum} className="px-1 text-slate-400">...</span>
                if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key={pageNum} className="px-1 text-slate-400">...</span>
                return null
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex items-center justify-center size-8 rounded text-xs font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-teal-700 text-white shadow-md shadow-teal-900/10'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-55'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center size-8 rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
