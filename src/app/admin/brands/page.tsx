import { CalendarDays, Building2, Users } from 'lucide-react'
import { BulkImportBrandsDialog } from '@/components/bulk-import-brands-dialog'
import { CreateBrandDialog } from '@/components/create-brand-dialog'
import { CreateBrandUserDialog } from '@/components/create-brand-user-dialog'
import { createClient } from '@/lib/server'
import { EmptyState, PageHeader, PageSurface, PremiumActionCard } from '@/components/premium-ui'

export default async function BrandsPage() {
  const supabase = await createClient()

  const { data: brands } = await supabase
    .from('brands')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <PageSurface>
      <PageHeader
        eyebrow="Client directory"
        title="Brands"
        description="Manage client workspaces and invite the people who approve influencer shortlists."
        action={
          <div className="flex flex-wrap gap-2">
            <BulkImportBrandsDialog />
            <CreateBrandDialog />
          </div>
        }
      />

      {brands && brands.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {brands.map((brand) => {
            const dynamicFields = Object.entries((brand.extra_fields || {}) as Record<string, string>).slice(0, 4)

            return (
              <PremiumActionCard
                key={brand.id}
                icon={Building2}
                eyebrow="Brand workspace"
                title={brand.name}
                description="Client portal with campaign access and user permissions."
                status="Active"
                statusTone="emerald"
                tone="violet"
                meta={
                  <>
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-4" />
                      Created {new Date(brand.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    {dynamicFields.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {dynamicFields.map(([key, value]) => (
                          <span key={key} className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                            {key}: {value}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </>
                }
                footer={
                  <>
                    <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase text-slate-500">
                      <Users className="size-4" />
                      Team access
                    </div>
                    <CreateBrandUserDialog brandId={brand.id} brandName={brand.name} />
                  </>
                }
              />
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={Building2}
          title="No brands yet"
          description="Create your first client workspace, then invite brand users to review campaigns."
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <BulkImportBrandsDialog />
              <CreateBrandDialog />
            </div>
          }
        />
      )}

    </PageSurface>
  )
}
