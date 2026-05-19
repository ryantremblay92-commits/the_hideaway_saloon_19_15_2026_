import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // We need service role for this, let's try with what we have

// We need SUPABASE_SERVICE_ROLE_KEY to bypass RLS and create users directly
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, serviceRoleKey!);

async function seedAdmin() {
    console.log('Seeding admin user...');

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
        console.error('Error creating admin auth user:', error);
        // If it already exists, let's just make sure profile is there
        if (error.message.includes('already registered')) {
            console.log('User already exists. Trying to find user ID...');
            // Cannot easily query auth.users with anon key, skipping profile update script
            return;
        }
        process.exit(1);
    }

    console.log('Admin user created successfully!');
    console.log('Email: admin@eleganciasalon.com');
    console.log('Password: AdminPassword123!');
    console.log('User ID:', data.user?.id);
}

seedAdmin();
