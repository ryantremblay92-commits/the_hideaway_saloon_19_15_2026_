const { createClient } = require('@supabase/supabase-js');
// require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testReferrals() {
    const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .limit(10);

    if (error) {
        console.error('Error:', error);
        return;
    }

    console.log('Referrals:', data);

    if (data.length === 0) {
        console.log('No referrals found. Creating a test one...');
        // Need a user ID to link as referrer. Let's find an admin user.
        const { data: profiles } = await supabase.from('profiles').select('id').limit(1);
        if (profiles && profiles.length > 0) {
            const userId = profiles[0].id;
            const testCode = 'TEST' + Math.floor(Math.random() * 1000);
            const { data: newRef, error: insertError } = await supabase
                .from('referrals')
                .insert({
                    referrer_id: userId,
                    referral_code: testCode,
                    status: 'pending'
                })
                .select();
            if (insertError) console.error('Insert Error:', insertError);
            else console.log('Created test referral:', newRef);
        } else {
            console.log('No profiles found to use as referrer.');
        }
    }
}

testReferrals();
