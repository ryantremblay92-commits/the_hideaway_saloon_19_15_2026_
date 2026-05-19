const { Client } = require('pg');

const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

async function run() {
    const client = new Client({ connectionString });
    await client.connect();
    console.log('Connected!');

    const userId = 'a5e57ff7-7855-4f72-8d76-5311d3ee7a2a';

    // First, delete the incomplete admin user we created before
    await client.query("DELETE FROM public.profiles WHERE email = 'admin@eleganciasalon.com'");
    await client.query(`DELETE FROM auth.identities WHERE user_id = '${userId}'`);
    await client.query(`DELETE FROM auth.users WHERE id = '${userId}'`);
    console.log('Cleaned up old admin user');

    // Create admin user with ALL required fields
    await client.query(`
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      is_super_admin,
      created_at,
      updated_at,
      confirmation_token,
      recovery_token,
      email_change_token_new,
      email_change
    ) VALUES (
      '${userId}',
      '00000000-0000-0000-0000-000000000000',
      'admin@eleganciasalon.com',
      crypt('AdminPassword123!', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{"full_name": "System Administrator"}',
      'authenticated',
      'authenticated',
      false,
      now(),
      now(),
      '',
      '',
      '',
      ''
    );
  `);
    console.log('✅ Auth user created');

    // Create the identity record - THIS IS THE KEY MISSING PIECE
    await client.query(`
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      provider_id,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      '${userId}'::uuid,
      jsonb_build_object('sub', '${userId}', 'email', 'admin@eleganciasalon.com', 'email_verified', true, 'phone_verified', false),
      'email',
      '${userId}',
      now(),
      now(),
      now()
    );
  `);
    console.log('✅ Auth identity created');

    // The trigger should have auto-created a profile, update it to admin
    await client.query(`UPDATE public.profiles SET role = 'admin' WHERE id = '${userId}'`);
    console.log('✅ Profile updated to admin');

    // Verify
    const users = await client.query("SELECT id, email FROM auth.users WHERE email = 'admin@eleganciasalon.com'");
    console.log('Auth user:', users.rows);

    const identities = await client.query(`SELECT id, provider FROM auth.identities WHERE user_id = '${userId}'`);
    console.log('Identities:', identities.rows);

    const profiles = await client.query(`SELECT id, email, role FROM public.profiles WHERE id = '${userId}'`);
    console.log('Profile:', profiles.rows);

    await client.end();
    console.log('\n🎉 Done! Admin user is ready.');
    console.log('Email: admin@eleganciasalon.com');
    console.log('Password: AdminPassword123!');
}

run().catch(console.error);
