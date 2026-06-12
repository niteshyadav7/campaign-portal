-- Migration to allow brand admins and super admins to change user passwords securely.

CREATE OR REPLACE FUNCTION public.admin_update_user_password(
  p_user_id UUID,
  p_new_password TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_caller_role TEXT;
  v_caller_brand_id UUID;
  v_target_brand_id UUID;
BEGIN
  -- Get the caller's role and brand_id
  SELECT role, brand_id INTO v_caller_role, v_caller_brand_id
  FROM public.profiles
  WHERE id = auth.uid();

  -- Get the target's brand_id
  SELECT brand_id INTO v_target_brand_id
  FROM public.profiles
  WHERE id = p_user_id;

  -- Verify authorization:
  -- 1. Caller is super_admin
  -- 2. Caller is brand_admin AND belongs to the same brand as the target
  -- 3. Caller is the user themselves (allow self-update)
  IF v_caller_role = 'super_admin' OR 
     (v_caller_role = 'brand_admin' AND v_caller_brand_id IS NOT NULL AND v_caller_brand_id = v_target_brand_id) OR
     auth.uid() = p_user_id THEN
    
    -- Update the password in auth.users
    UPDATE auth.users
    SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
        updated_at = NOW()
    WHERE id = p_user_id;
    
    RETURN TRUE;
  ELSE
    RAISE EXCEPTION 'Not authorized to change this user password';
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
