const fs = require('fs');
const { Client } = require('pg');

const sql = fs.readFileSync('supabase/migrations/20260311050000_loyalty_referral.sql', 'utf8');
const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

const client = new Client({ connectionString });

client.connect().then(() => {
    console.log('Connected to DB');
    return client.query(sql);
}).then(() => {
    console.log('✅ Successfully applied full migration including RPCs');
    return client.end();
}).catch(e => {
    console.error('Error applying migration:', e);
    client.end();
});
