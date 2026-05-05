import { createClient } from '@/lib/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateCampaignDialog } from '@/components/create-campaign-dialog'
import Link from 'next/link'

export default async function CampaignsPage() {
  const supabase = await createClient()

  const { data: campaigns } = await supabase
    .from('campaigns')
    .select('*, brands(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Campaigns</h1>
          <p className="text-zinc-500 mt-1">Manage influencer campaigns for your brands</p>
        </div>
        <CreateCampaignDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns?.map((campaign: any) => (
          <Link key={campaign.id} href={`/admin/campaigns/${campaign.id}`}>
            <Card className="bg-white border-zinc-200 hover:border-blue-300 transition-all duration-300 group cursor-pointer h-full shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-zinc-900 group-hover:text-blue-600 transition-colors">
                    {campaign.name}
                  </CardTitle>
                  <Badge
                    variant="outline"
                    className={
                      campaign.status === 'active'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-zinc-200 bg-zinc-50 text-zinc-600'
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600">{campaign.brands?.name || 'Unknown Brand'}</p>
                <p className="text-xs text-zinc-500 mt-2">
                  Created {new Date(campaign.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}

        {(!campaigns || campaigns.length === 0) && (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-300">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14,2 14,8 20,8" />
              </svg>
            </div>
            <p className="text-zinc-600 font-medium">No campaigns yet</p>
            <p className="text-zinc-400 text-sm mt-1">Create your first campaign to start shortlisting influencers</p>
          </div>
        )}
      </div>
    </div>
  )
}
