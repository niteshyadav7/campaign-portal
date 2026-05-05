import { createClient } from '@/lib/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateBrandDialog } from '@/components/create-brand-dialog'
import { CreateBrandUserDialog } from '@/components/create-brand-user-dialog'
import Link from 'next/link'

export default async function BrandsPage() {
  const supabase = await createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Brands</h1>
          <p className="text-zinc-500 mt-1">Manage your client brands and their team members</p>
        </div>
        <CreateBrandDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands?.map((brand) => (
          <Card key={brand.id} className="bg-white border-zinc-200 hover:border-violet-300 transition-all duration-300 group shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-zinc-900 group-hover:text-violet-600 transition-colors">{brand.name}</CardTitle>
                <Badge variant="outline" className="border-violet-200 bg-violet-50 text-violet-700 text-xs">Active</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-xs text-zinc-500">
                Created {new Date(brand.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="flex items-center gap-2">
                <CreateBrandUserDialog brandId={brand.id} brandName={brand.name} />
              </div>
            </CardContent>
          </Card>
        ))}

        {(!brands || brands.length === 0) && (
          <div className="col-span-full text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 text-zinc-300">
                <path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7z" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <p className="text-zinc-600 font-medium">No brands yet</p>
            <p className="text-zinc-400 text-sm mt-1">Create your first brand to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}
