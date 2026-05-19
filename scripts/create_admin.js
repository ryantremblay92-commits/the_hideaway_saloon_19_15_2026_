// This script creates the admin user via Supabase Auth REST API
// It works with the anon key (no service_role key needed)
// Run: node scripts/create_admin.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://mbvvsdlixtabnwvikqom.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1idnZzZGxpeHRhYm53dmlrcW9tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMjkxNzAsImV4cCI6MjA4ODgwNTE3MH0.jZnEufOCcvFBRynIT2CFsk8PwLq05txZzZ6e9aSAEHc';

// Try using anon key first (will work if email confirmation is disabled in Supabase project settings)
const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
    console.log('=== Step 1: Attempting to sign up admin user ===');
    
    // First try signInWithPassword to see if user already exists
    const { data: existingCheck, error: checkError } = await supabase.auth.signInWithPassword({
        email: 'admin@eleganciasalon.com',
        password: 'AdminPassword123!'
    });
    
    if (existingCheck?.user) {
        console.log('✅ Admin user already exists and login works!');
        console.log('User ID:', existingCheck.user.id);
        console.log('Email confirmed:', existingCheck.user.email_confirmed_at ? 'Yes' : 'No');
        return;
    }
    
    console.log('Admin user does not exist or cannot login. Attempting sign up...');
    
    // Try signUp
    const { data, error } = await supabase.auth.signUp({
        email: 'admin@eleganciasalon.com',
        password: 'AdminPassword123!',
        options: {
            data: {
                full_name: 'System Administrator',
                role: 'admin'
            }
        }
    });
    
    if (error) {
        console.error('❌ Sign up failed:', error.message);
        
        if (error.message.includes('already registered')) {
            console.log('User already exists but login failed. The account may need email confirmation.');
            console.log('\n🔧 FIX: Go to Supabase Dashboard → Authentication → Users');
            console.log('   Find admin@eleganciasalon.com and click "Confirm" to verify the email.');
            console.log('   Then run this script again.\n');
        }
        
        console.log('\n=== Step 2: If step 1 fails, use the Supabase Dashboard SQL Editor ===');
        console.log('Go to: https://supabase.com/dashboard/project/mbvvsdlixtabnwvikqom/sql/new');
        console.log('And run this SQL:');
        console.log(`
-- 1. Delete any partial admin user first
DELETE FROM public.profiles WHERE email = 'admin@eleganciasalon.com';
DELETE FROM auth.identities WHERE user_id = (SELECT id FROM auth.users WHERE email = 'admin@eleganciasalon.com');
DELETE FROM auth.users WHERE email = 'admin@eleganciasalon.com';

-- 2. Create admin user (with gen_random_uuid to avoid ID conflicts)
INSERT INTO auth.users (
  id, instance_id, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  aud, role, is_super_admin, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) VALUES (
  gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
  'admin@eleganciasalon.com',
  crypt('AdminPassword123!', gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator"}',
  'authenticated', 'authenticated', false,
  now(), now(), '', '', '', ''
);

-- 3. Create auth identity (REQUIRED for login)
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

-- 4. Update profile role to admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@eleganciasalon.com');

-- 5. Verify
SELECT id, email, email_confirmed_at FROM auth.users WHERE email = 'admin@eleganciasalon.com';
SELECT id, email, role FROM public.profiles WHERE email = 'admin@eleganciasalon.com';
        `);
        return;
    }
    
    if (data?.user) {
        console.log('✅ Sign up successful!');
        console.log('User ID:', data.user.id);
        console.log('Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');
        
        if (!data.user.email_confirmed_at) {
            console.log('\n⚠️  Email confirmation required.');
            console.log('   Go to Supabase Dashboard → Authentication → Users');
            console.log('   Find admin@eleganciasalon.com and click "Confirm"');
            console.log('   Then login will work.\n');
        } else {
            // Now update the profile role to admin
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ role: 'admin' })
                .eq('id', data.user.id);
                
            if (profileError) {
                console.log('⚠️ Could not update profile role:', profileError.message);
                console.log('   Run this in Supabase SQL Editor:');
                console.log(`   UPDATE public.profiles SET role = 'admin' WHERE id = '${data.user.id}';`);
            } else {
                console.log('✅ Profile role updated to admin!');
            }
            
            console.log('\n✅ Admin user is ready!');
            console.log('   Email: admin@eleganciasalon.com');
            console.log('   Password: AdminPassword123!');
        }
    }
}

createAdmin().catch(console.error);