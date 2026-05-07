ALTER TABLE public.influencers
ADD COLUMN IF NOT EXISTS extra_fields JSONB DEFAULT '{}'::jsonb;
