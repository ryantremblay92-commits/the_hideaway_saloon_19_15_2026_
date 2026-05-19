import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function signInAdmin() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com', // Using the test account we know works
        password: 'password123'
    });

    if (error) {
        console.error('Error signing in:', error);
        process.exit(1);
    }

    console.log('Signed in successfully!');
    console.log('User ID:', data.user?.id);

    // Let's promote this user to admin by updating their raw_user_meta_data if possible
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
        data: { role: 'admin' }
    });

    if (updateError) {
        console.log('Update error:', updateError);
    } else {
        console.log('Updated user meta data:', updateData.user?.user_metadata);
    }
}

signInAdmin();
