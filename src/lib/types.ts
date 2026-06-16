export type UserRole = 'super_admin' | 'brand_admin' | 'brand_user'

export interface Profile {
  id: string
  brand_id: string | null
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Brand {
  id: string
  name: string
  extra_fields: Record<string, string> | null
  created_at: string
}

export interface Campaign {
  id: string
  brand_id: string
  name: string
  status: string
  extra_fields: Record<string, string> | null
  created_at: string
}

export interface Influencer {
  id: string
  name: string
  instagram_url: string | null
  followers: number
  location: string | null
  contact_number: string | null
  extra_fields: Record<string, string> | null
  created_at: string
}

export type CampaignInfluencerStatus = 'pending' | 'shortlisted' | 'rejected'

export interface CampaignInfluencer {
  campaign_id: string
  influencer_id: string
  status: CampaignInfluencerStatus
  updated_by: string | null
  updated_at: string
  comment: string | null
  // Joined fields
  influencers?: Influencer
  profiles?: Profile
}
