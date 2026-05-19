require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkDB() {
    console.log("Checking instagram_posts table...");
    const { data: instaData, error: instaError } = await supabase.from('instagram_posts').select('*');
    if (instaError) {
        console.error("Error reading instagram_posts:", instaError.message);
    } else {
        console.log(`Found ${instaData.length} records in instagram_posts.`);
        console.log(JSON.stringify(instaData, null, 2));
    }
}

checkDB();
