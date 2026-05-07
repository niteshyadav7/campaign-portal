ALTER TABLE public.brands
ADD COLUMN IF NOT EXISTS extra_fields JSONB DEFAULT '{}'::jsonb;

ALTER TABLE public.campaigns
ADD COLUMN IF NOT EXISTS extra_fields JSONB DEFAULT '{}'::jsonb;
