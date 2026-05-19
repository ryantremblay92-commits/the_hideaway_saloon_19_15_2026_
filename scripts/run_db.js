const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function run() {
    const client = new Client({
        connectionString,
    });

    try {
        await client.connect();
        console.log('Connected to database!');

        // Check if profiles table exists
        const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE  table_schema = 'public'
        AND    table_name   = 'profiles'
      );
    `);

        console.log('Profiles table exists:', res.rows[0].exists);

        if (!res.rows[0].exists) {
            console.log('Running migrations...');

            const migrationsDir = path.join(__dirname, '../supabase/migrations');
            const files = fs.readdirSync(migrationsDir).sort();

            for (const file of files) {
                if (file.endsWith('.sql')) {
                    console.log(`Executing ${file}...`);
                    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                    await client.query(sql);
                    console.log(`${file} executed successfully.`);
                }
            }
        } else {
            console.log('Tables already exist, running seed admin script only');
            const seedSql = fs.readFileSync(path.join(__dirname, '../supabase/migrations/20260311_seed_admin.sql'), 'utf8');
            await client.query(seedSql);
            console.log('Seed admin script executed successfully.');
        }

    } catch (err) {
        console.error('Error executing query:', err);
    } finally {
        await client.end();
    }
}

run();
