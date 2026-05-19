const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setTestBirthday() {
    // Replace with a valid user ID from your DB if you want to test specifically
    const { data: users } = await supabase.from('profiles').select('id, full_name').limit(1);

    if (users && users.length > 0) {
        const userId = users[0].id;
        const today = new Date();
        const dob = `${today.getFullYear()}-03-15`; // Set to March 15th

        const { error } = await supabase
            .from('profiles')
            .update({ date_of_birth: dob })
            .eq('id', userId);

        if (error) {
            console.error('Error updating DOB:', error);
        } else {
            console.log(`Set DOB for ${users[0].full_name} to ${dob}`);
        }
    } else {
        console.log('No users found in profiles table');
    }
}

setTestBirthday();
