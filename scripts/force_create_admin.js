const { Client } = require('pg');

// Use session pooler (port 6543) - password is URL-encoded
const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:6543/postgres?pgbouncer=true';

async function run() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log('Connected to production DB!');

        // Check existing admin
        const { rows: existing } = await client.query(
            "SELECT id, email FROM auth.users WHERE email = 'admin@eleganciasalon.com'"
        );
        console.log('Existing users found:', existing.length);

        let userId;

        if (existing.length > 0) {
            userId = existing[0].id;
            console.log('Admin already exists with ID:', userId);
            // Update profile role
            await client.query("UPDATE public.profiles SET role = 'admin' WHERE id = $1", [userId]);
            console.log('Profile role updated to admin');
        } else {
            console.log('Creating admin user...');
            
            // Clean up any partial data
            await client.query("DELETE FROM public.profiles WHERE email = 'admin@eleganciasalon.com'");
            
            // Insert into auth.users
            const { rows: newUser } = await client.query(`
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
                )
                RETURNING id
            `);
            
            userId = newUser[0].id;
            console.log('Created user ID:', userId);

            // Insert into auth.identities (REQUIRED for login)
            await client.query(`
                INSERT INTO auth.identities (
                    id, user_id, identity_data, provider, provider_id,
                    last_sign_in_at, created_at, updated_at
                ) VALUES (
                    gen_random_uuid(), $1,
                    jsonb_build_object(
                        'sub', $1::text,
                        'email', 'admin@eleganciasalon.com',
                        'email_verified', true,
                        'phone_verified', false
                    ),
                    'email', $1::text,
                    now(), now(), now()
                )
            `, [userId]);
            console.log('Identity created');

            // Set profile role
            await client.query(
                "UPDATE public.profiles SET role = 'admin' WHERE id = $1",
                [userId]
            );
            console.log('Profile role set to admin');
        }

        // Verify
        const { rows: users } = await client.query(
            "SELECT id, email FROM auth.users WHERE email = 'admin@eleganciasalon.com'"
        );
        console.log('\nVerified auth.users:', JSON.stringify(users));

        const { rows: identities } = await client.query(
            "SELECT id, provider FROM auth.identities WHERE user_id = $1",
            [userId]
        );
        console.log('Verified identities:', JSON.stringify(identities));

        const { rows: profiles } = await client.query(
            "SELECT id, email, role FROM public.profiles WHERE email = 'admin@eleganciasalon.com'"
        );
        console.log('Verified profiles:', JSON.stringify(profiles));

        await client.end();
        console.log('\n✅ Admin user is ready on PRODUCTION!');
        console.log('   Email: admin@eleganciasalon.com');
        console.log('   Password: AdminPassword123!');
    } catch (err) {
        console.error('Error:', err.message);
        console.error('Stack:', err.stack);
    }
}

run();