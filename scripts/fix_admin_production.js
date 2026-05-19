/**
 * Admin User Fix for The Hideaway Saloon
 * 
 * The admin user (admin@eleganciasalon.com / AdminPassword123!) 
 * was created on Supabase project: roftnowcdanmfdmpkyxs.supabase.co (Docker default)
 * but needs to be created on:     mbvvsdlixtabnwvikqom.supabase.co (Production/Railway)
 * 
 * Since DNS is not resolving for the production project from this environment,
 * you must run the SQL below in the Supabase Dashboard.
 * 
 * STEPS:
 * 1. Go to: https://supabase.com/dashboard/project/mbvvsdlixtabnwvikqom/sql/new
 * 2. Paste and run the SQL below
 * 3. Login at /auth/login with: admin@eleganciasalon.com / AdminPassword123!
 */

console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              ADMIN USER FIX - PRODUCTION DATABASE                   ║
║                                                                      ║
║   Admin exists on: roftnowcdanmfdmpkyxs (Docker dev)                ║
║   Need to create:  mbvvsdlixtabnwvikqom (Production/Railway)       ║
╚══════════════════════════════════════════════════════════════════════╝

Run this SQL in Supabase Dashboard SQL Editor:
  https://supabase.com/dashboard/project/mbvvsdlixtabnwvikqom/sql/new

----------------------------------------------------------------------

-- ⚠️ WARNING: This deletes any existing partial admin user first
BEGIN;

-- 1. Clean up any partial/incomplete admin user
DELETE FROM public.profiles WHERE email = 'admin@eleganciasalon.com';
DELETE FROM auth.identities 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@eleganciasalon.com');
DELETE FROM auth.users WHERE email = 'admin@eleganciasalon.com';

-- 2. Create admin user in auth.users
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  aud, role, is_super_admin, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  gen_random_uuid(), 
  '00000000-0000-0000-0000-000000000000',
  'admin@eleganciasalon.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator"}',
  'authenticated', 'authenticated', false,
  now(), now(), '', '', '', ''
);

-- 3. Create auth identity (CRITICAL - without this, login fails with "Invalid login credentials")
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users WHERE email = 'admin@eleganciasalon.com'),
  jsonb_build_object(
    'sub', (SELECT id::text FROM auth.users WHERE email = 'admin@eleganciasalon.com'),
    'email', 'admin@eleganciasalon.com',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  (SELECT id::text FROM auth.users WHERE email = 'admin@eleganciasalon.com'),
  now(), now(), now()
);

-- 4. Update or ensure profile role is admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@eleganciasalon.com');

COMMIT;

-- 5. Verify
SELECT 'AUTH USER:' as check_point, id, email, email_confirmed_at 
FROM auth.users WHERE email = 'admin@eleganciasalon.com';

SELECT 'IDENTITY:' as check_point, id, provider, user_id 
FROM auth.identities 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@eleganciasalon.com');

SELECT 'PROFILE:' as check_point, id, email, role 
FROM public.profiles WHERE email = 'admin@eleganciasalon.com';

----------------------------------------------------------------------
`);