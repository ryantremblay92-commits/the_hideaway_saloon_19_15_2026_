const { Client } = require('pg');
const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

async function check() {
    const client = new Client({ connectionString });
    await client.connect();

    const tablesToCheck = ['loyalty_programs', 'customer_points', 'points_transactions', 'referrals', 'tier_benefits'];
    const results = {};

    for (const table of tablesToCheck) {
        try {
            await client.query(`SELECT 1 FROM public.${table} LIMIT 1`);
            results[table] = 'EXISTS';
        } catch (e) {
            results[table] = 'MISSING';
        }
    }

    console.log(JSON.stringify(results, null, 2));
    await client.end();
}

check().catch(console.error);
