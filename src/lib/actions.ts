'use server'

import { createClient } from '@/lib/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

export async function createBrand(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string

  const { error } = await supabase
    .from('brands')
    .insert({ name })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/brands')
}

type BulkBrandInput = {
  name?: string
  extra_fields?: Record<string, string>
}

function cleanExtraFields(fields: Record<string, string> | undefined): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fields || {})
      .map(([key, value]) => [key.trim(), value?.toString().trim() || ''])
      .filter(([key, value]) => key && value)
  )
}

export async function bulkCreateBrands(formData: FormData) {
  const supabase = await createClient()
  const rowsPayload = formData.get('rows') as string
  const parsedRows = JSON.parse(rowsPayload || '[]') as BulkBrandInput[]

  if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
    throw new Error('No brands found in the CSV.')
  }

  if (parsedRows.length > 1000) {
    throw new Error('Please import 1000 brands or fewer at a time.')
  }

  const brands = parsedRows
    .map((row) => ({
      name: row.name?.toString().trim(),
      extra_fields: cleanExtraFields(row.extra_fields),
    }))
    .filter((row) => row.name)

  if (brands.length === 0) {
    throw new Error('Every row is missing a name. Map a CSV column to Brand Name and try again.')
  }

  const { error } = await supabase
    .from('brands')
    .insert(brands)

  if (error) {
    if (error.message.includes('extra_fields')) {
      throw new Error('CSV dynamic fields need the extra_fields column. Run migrations/002_add_brand_campaign_extra_fields.sql in Supabase, then import again.')
    }

    throw new Error(error.message)
  }

  revalidatePath('/admin/brands')
  return { inserted: brands.length }
}

export async function createBrandUser(formData: FormData) {
  const authClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const brandId = formData.get('brand_id') as string
  const role = formData.get('role') as string

  // Use an isolated auth client so creating a brand user does not replace
  // the current admin's cookie-backed session.
  const { data: authData, error: authError } = await authClient.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  if (authError) throw new Error(authError.message)

  if (authData.user) {
    // Update their profile with brand_id and role
    const { error: profileError } = await authClient
      .from('profiles')
      .update({ brand_id: brandId, role, full_name: fullName })
      .eq('id', authData.user.id)

    if (profileError) throw new Error(profileError.message)
  }

  await authClient.auth.signOut()

  revalidatePath('/admin/brands')
}

export async function createCampaign(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const brandId = formData.get('brand_id') as string

  const { error } = await supabase
    .from('campaigns')
    .insert({ name, brand_id: brandId })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/campaigns')
}

type BulkCampaignInput = {
  name?: string
  brand?: string
  brand_id?: string
  status?: string
  extra_fields?: Record<string, string>
}

export async function bulkCreateCampaigns(formData: FormData) {
  const supabase = await createClient()
  const rowsPayload = formData.get('rows') as string
  const parsedRows = JSON.parse(rowsPayload || '[]') as BulkCampaignInput[]

  if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
    throw new Error('No campaigns found in the CSV.')
  }

  if (parsedRows.length > 1000) {
    throw new Error('Please import 1000 campaigns or fewer at a time.')
  }

  const { data: brands, error: brandsError } = await supabase
    .from('brands')
    .select('id, name')

  if (brandsError) throw new Error(brandsError.message)

  const brandByName = new Map((brands || []).map((brand) => [brand.name.trim().toLowerCase(), brand.id]))
  const brandIds = new Set((brands || []).map((brand) => brand.id))

  const missingBrands = new Set<string>()
  const campaigns = parsedRows
    .map((row) => {
      const name = row.name?.toString().trim()
      const explicitBrandId = row.brand_id?.toString().trim()
      const brandName = row.brand?.toString().trim()
      const brandId = explicitBrandId && brandIds.has(explicitBrandId)
        ? explicitBrandId
        : brandName
          ? brandByName.get(brandName.toLowerCase())
          : undefined

      if (name && !brandId) missingBrands.add(brandName || explicitBrandId || 'blank')

      return {
        name,
        brand_id: brandId,
        status: row.status?.toString().trim() || 'active',
        extra_fields: cleanExtraFields(row.extra_fields),
      }
    })
    .filter((row) => row.name && row.brand_id)

  if (campaigns.length === 0) {
    throw new Error('Map Campaign Name and Brand/Brand ID columns. Brand names must already exist.')
  }

  if (missingBrands.size > 0) {
    throw new Error(`These brands were not found: ${Array.from(missingBrands).slice(0, 5).join(', ')}. Create/import brands first or map Brand ID.`)
  }

  const { error } = await supabase
    .from('campaigns')
    .insert(campaigns)

  if (error) {
    if (error.message.includes('extra_fields')) {
      throw new Error('CSV dynamic fields need the extra_fields column. Run migrations/002_add_brand_campaign_extra_fields.sql in Supabase, then import again.')
    }

    throw new Error(error.message)
  }

  revalidatePath('/admin/campaigns')
  return { inserted: campaigns.length }
}

export async function createInfluencer(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const instagramUrl = formData.get('instagram_url') as string
  const followers = parseInt(formData.get('followers') as string) || 0
  const location = formData.get('location') as string
  const contactNumber = formData.get('contact_number') as string

  const { error } = await supabase
    .from('influencers')
    .insert({ name, instagram_url: instagramUrl, followers, location, contact_number: contactNumber })

  if (error) throw new Error(error.message)
  revalidatePath('/admin/influencers')
}

type BulkInfluencerInput = {
  name?: string
  instagram_url?: string
  followers?: string | number
  location?: string
  contact_number?: string
  extra_fields?: Record<string, string>
}

function parseFollowerCount(value: string | number | undefined): number {
  if (typeof value === 'number') return Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0
  if (!value) return 0

  const normalized = value.toString().trim().toLowerCase().replace(/,/g, '')
  const multiplier = normalized.endsWith('m') ? 1000000 : normalized.endsWith('k') ? 1000 : 1
  const numericValue = Number.parseFloat(normalized.replace(/[^0-9.]/g, ''))

  return Number.isFinite(numericValue) ? Math.max(0, Math.round(numericValue * multiplier)) : 0
}

export async function bulkCreateInfluencers(formData: FormData) {
  const supabase = await createClient()
  const rowsPayload = formData.get('rows') as string
  const parsedRows = JSON.parse(rowsPayload || '[]') as BulkInfluencerInput[]

  if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
    throw new Error('No influencers found in the CSV.')
  }

  if (parsedRows.length > 1000) {
    throw new Error('Please import 1000 influencers or fewer at a time.')
  }

  const influencers = parsedRows
    .map((row) => ({
      name: row.name?.toString().trim(),
      instagram_url: row.instagram_url?.toString().trim() || null,
      followers: parseFollowerCount(row.followers),
      location: row.location?.toString().trim() || null,
      contact_number: row.contact_number?.toString().trim() || null,
      extra_fields: cleanExtraFields(row.extra_fields),
    }))
    .filter((row) => row.name)

  if (influencers.length === 0) {
    throw new Error('Every row is missing a name. Map a CSV column to Name and try again.')
  }

  const { error } = await supabase
    .from('influencers')
    .insert(influencers)

  if (error) {
    if (error.message.includes('extra_fields')) {
      throw new Error('CSV dynamic fields need the extra_fields column. Run migrations/001_add_influencer_extra_fields.sql in Supabase, then import again.')
    }

    throw new Error(error.message)
  }

  revalidatePath('/admin/influencers')
  return { inserted: influencers.length }
}

export async function addInfluencerToCampaign(campaignId: string, influencerId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('campaign_influencers')
    .insert({ campaign_id: campaignId, influencer_id: influencerId, status: 'pending' })

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/campaigns/${campaignId}`)
}

export async function removeInfluencerFromCampaign(campaignId: string, influencerId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('campaign_influencers')
    .delete()
    .eq('campaign_id', campaignId)
    .eq('influencer_id', influencerId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/campaigns/${campaignId}`)
}

export async function updateInfluencerStatus(
  campaignId: string,
  influencerId: string,
  status: 'pending' | 'shortlisted' | 'rejected'
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('campaign_influencers')
    .update({ status, updated_by: user?.id, updated_at: new Date().toISOString() })
    .eq('campaign_id', campaignId)
    .eq('influencer_id', influencerId)

  if (error) throw new Error(error.message)
  revalidatePath(`/admin/campaigns/${campaignId}`)
  revalidatePath(`/dashboard/campaigns/${campaignId}`)
}
