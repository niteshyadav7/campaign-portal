'use server'

import { createClient } from '@/lib/server'
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

export async function createBrandUser(formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const brandId = formData.get('brand_id') as string
  const role = formData.get('role') as string

  // Create auth user via Supabase admin (using service role would be ideal,
  // but for MVP we'll use client signup)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  if (authError) throw new Error(authError.message)

  if (authData.user) {
    // Update their profile with brand_id and role
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ brand_id: brandId, role, full_name: fullName })
      .eq('id', authData.user.id)

    if (profileError) throw new Error(profileError.message)
  }

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
