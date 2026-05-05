import { createClient } from '@/lib/server'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CreateInfluencerDialog } from '@/components/create-influencer-dialog'

function formatFollowers(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
  return count.toString()
}

export default async function InfluencersPage() {
  const supabase = await createClient()

  const { data: influencers } = await supabase
    .from('influencers')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Influencer Pool</h1>
          <p className="text-zinc-500 mt-1">Manage your pool of influencers to assign to campaigns</p>
        </div>
        <CreateInfluencerDialog />
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50/50">
              <TableHead className="text-zinc-500 font-semibold">Name</TableHead>
              <TableHead className="text-zinc-500 font-semibold">Instagram</TableHead>
              <TableHead className="text-zinc-500 font-semibold">Followers</TableHead>
              <TableHead className="text-zinc-500 font-semibold">Location</TableHead>
              <TableHead className="text-zinc-500 font-semibold">Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencers?.map((influencer) => (
              <TableRow key={influencer.id} className="border-zinc-100 hover:bg-zinc-50 transition-colors">
                <TableCell className="font-medium text-zinc-900">{influencer.name}</TableCell>
                <TableCell>
                  {influencer.instagram_url ? (
                    <a
                      href={influencer.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:text-violet-700 transition-colors text-sm font-medium"
                    >
                      @{influencer.instagram_url.replace(/.*instagram\.com\//, '').replace(/\/$/, '')}
                    </a>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                    {formatFollowers(influencer.followers)}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-600 text-sm">{influencer.location || '—'}</TableCell>
                <TableCell className="text-zinc-600 text-sm">{influencer.contact_number || '—'}</TableCell>
              </TableRow>
            ))}

            {(!influencers || influencers.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-zinc-500">
                  No influencers added yet. Click &quot;Add Influencer&quot; to begin.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
