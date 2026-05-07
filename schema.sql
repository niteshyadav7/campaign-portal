-- 0. TEARDOWN (Clean Slate)
-- This deletes the old tables and the test user so you don't get duplicate errors
DROP TABLE IF EXISTS public.campaign_influencers CASCADE;
DROP TABLE IF EXISTS public.influencers CASCADE;
DROP TABLE IF EXISTS public.campaigns CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;
DELETE FROM auth.users WHERE email IN ('admin@1to7media.com', 'admin@gmail.com');

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Create Brands table
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    extra_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Extend auth.users with profiles
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brands(id) ON DELETE SET NULL,
    full_name TEXT,
    role TEXT CHECK (role IN ('super_admin', 'brand_admin', 'brand_user')) DEFAULT 'brand_user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Campaigns table
CREATE TABLE public.campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    extra_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Influencers table (Pool)
CREATE TABLE public.influencers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    instagram_url TEXT,
    followers INTEGER DEFAULT 0,
    location TEXT,
    contact_number TEXT,
    extra_fields JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Campaign Influencers (Workflow Table)
CREATE TABLE public.campaign_influencers (
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
    influencer_id UUID REFERENCES public.influencers(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('pending', 'shortlisted', 'rejected')) DEFAULT 'pending',
    updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (campaign_id, influencer_id)
);

-- 6. Function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;

-- 9. RLS POLICIES & HELPER FUNCTIONS
CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_brand_id() RETURNS UUID AS $$
DECLARE
  v_brand_id UUID;
BEGIN
  SELECT brand_id INTO v_brand_id FROM public.profiles WHERE id = auth.uid();
  RETURN v_brand_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Brands Policies
CREATE POLICY "Users can view their own brand" ON public.brands FOR SELECT USING (id = get_user_brand_id() OR is_super_admin());
CREATE POLICY "Super admins can insert brands" ON public.brands FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "Super admins can update brands" ON public.brands FOR UPDATE USING (is_super_admin());
CREATE POLICY "Super admins can delete brands" ON public.brands FOR DELETE USING (is_super_admin());

-- Profiles Policies
CREATE POLICY "Users can view team members" ON public.profiles FOR SELECT USING (id = auth.uid() OR brand_id = get_user_brand_id() OR is_super_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid() OR is_super_admin());
CREATE POLICY "Allow trigger to insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Campaigns Policies
CREATE POLICY "Users can view their brand campaigns" ON public.campaigns FOR SELECT USING (brand_id = get_user_brand_id() OR is_super_admin());
CREATE POLICY "Super admins can insert campaigns" ON public.campaigns FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "Super admins can update campaigns" ON public.campaigns FOR UPDATE USING (is_super_admin());
CREATE POLICY "Super admins can delete campaigns" ON public.campaigns FOR DELETE USING (is_super_admin());

-- Influencers Policies
CREATE POLICY "Everyone can view influencers" ON public.influencers FOR SELECT USING (TRUE);
CREATE POLICY "Super admins can insert influencers" ON public.influencers FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "Super admins can update influencers" ON public.influencers FOR UPDATE USING (is_super_admin());
CREATE POLICY "Super admins can delete influencers" ON public.influencers FOR DELETE USING (is_super_admin());

-- Campaign Influencers Policies
CREATE POLICY "Users can view campaign influencers" ON public.campaign_influencers FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_influencers.campaign_id AND (c.brand_id = get_user_brand_id() OR is_super_admin()))
);
CREATE POLICY "Super admins can insert campaign influencers" ON public.campaign_influencers FOR INSERT WITH CHECK (is_super_admin());
CREATE POLICY "Users can update campaign influencers" ON public.campaign_influencers FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.campaigns c WHERE c.id = campaign_influencers.campaign_id AND (c.brand_id = get_user_brand_id() OR is_super_admin()))
);
CREATE POLICY "Super admins can delete campaign influencers" ON public.campaign_influencers FOR DELETE USING (is_super_admin());


-- 10. CREATE TEST SUPER ADMIN USER
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
BEGIN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud,
      confirmation_token, recovery_token, email_change_token_new, email_change
    ) VALUES (
      new_user_id, '00000000-0000-0000-0000-000000000000', 'admin@gmail.com', 
      crypt('Admin@123', gen_salt('bf')), NOW(), 
      '{"provider":"email","providers":["email"]}', '{"full_name":"Agency Admin"}', 
      NOW(), NOW(), 'authenticated', 'authenticated',
      '', '', '', ''
    );

    UPDATE public.profiles 
    SET role = 'super_admin' 
    WHERE id = new_user_id;
END $$;
