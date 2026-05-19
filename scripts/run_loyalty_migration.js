const { Client } = require('pg');

const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

async function run() {
    const client = new Client({ connectionString });
    await client.connect();
    console.log('Connected!');

    // Create loyalty_programs table
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS public.loyalty_programs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL DEFAULT 'Default Loyalty Program',
          points_per_rupee NUMERIC(5,2) DEFAULT 1.00,
          points_to_redeem INTEGER DEFAULT 100,
          rupee_value_per_point NUMERIC(5,2) DEFAULT 1.00,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
        `);
        console.log('✅ loyalty_programs table created');
    } catch (e) { console.log('Error:', e.message); }

    // Create customer_points table
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS public.customer_points (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
          total_points INTEGER DEFAULT 0,
          available_points INTEGER DEFAULT 0,
          lifetime_points INTEGER DEFAULT 0,
          tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          UNIQUE(customer_id)
        );
        `);
        console.log('✅ customer_points table created');
    } catch (e) { console.log('Error:', e.message); }

    // Create points_transactions table
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS public.points_transactions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
          points INTEGER NOT NULL,
          transaction_type TEXT NOT NULL CHECK (transaction_type IN ('earn', 'redeem', 'expire', 'bonus', 'referral_earn', 'referral_bonus')),
          description TEXT,
          booking_id UUID REFERENCES public.bookings(id),
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        `);
        console.log('✅ points_transactions table created');
    } catch (e) { console.log('Error:', e.message); }

    // Create referrals table
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS public.referrals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          referrer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          referee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
          referral_code TEXT UNIQUE NOT NULL,
          referrer_reward_points INTEGER DEFAULT 100,
          referee_reward_points INTEGER DEFAULT 50,
          status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired')),
          referred_at TIMESTAMPTZ DEFAULT NOW(),
          completed_at TIMESTAMPTZ
        );
        `);
        console.log('✅ referrals table created');
    } catch (e) { console.log('Error:', e.message); }

    // Create tier_benefits table
    try {
        await client.query(`
        CREATE TABLE IF NOT EXISTS public.tier_benefits (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          tier_name TEXT NOT NULL UNIQUE,
          min_points INTEGER DEFAULT 0,
          max_points INTEGER,
          bonus_percentage INTEGER DEFAULT 0,
          description TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        `);
        console.log('✅ tier_benefits table created');
    } catch (e) { console.log('Error:', e.message); }

    // Insert tier benefits
    try {
        await client.query(`
        INSERT INTO public.tier_benefits (tier_name, min_points, max_points, bonus_percentage, description) VALUES
          ('Bronze', 0, 499, 0, 'Welcome tier - 1 point per ₹1 spent'),
          ('Silver', 500, 999, 5, '5% bonus points on all services'),
          ('Gold', 1000, 2499, 10, '10% bonus points on all services'),
          ('Platinum', 2500, NULL, 15, '15% bonus points + priority booking')
        ON CONFLICT (tier_name) DO NOTHING;
        `);
        console.log('✅ Tier benefits seeded');
    } catch (e) { console.log('Error:', e.message); }

    // Enable RLS on all tables
    try {
        await client.query('ALTER TABLE public.loyalty_programs ENABLE ROW LEVEL SECURITY;');
        await client.query('ALTER TABLE public.customer_points ENABLE ROW LEVEL SECURITY;');
        await client.query('ALTER TABLE public.points_transactions ENABLE ROW LEVEL SECURITY;');
        await client.query('ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;');
        await client.query('ALTER TABLE public.tier_benefits ENABLE ROW LEVEL SECURITY;');
        console.log('✅ RLS enabled on loyalty tables');
    } catch (e) { console.log('Error:', e.message); }

    // Create policies
    try {
        await client.query(`CREATE POLICY "Anyone can view loyalty programs" ON public.loyalty_programs FOR SELECT USING (true);`);
        await client.query(`CREATE POLICY "Anyone can view tier benefits" ON public.tier_benefits FOR SELECT USING (true);`);
        await client.query(`CREATE POLICY "Admins can manage loyalty programs" ON public.loyalty_programs FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));`);
        await client.query(`CREATE POLICY "Admins can manage tier benefits" ON public.tier_benefits FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));`);
        console.log('✅ RLS policies created');
    } catch (e) { console.log('Error:', e.message); }

    await client.end();
    console.log('✅ Loyalty migration complete!');
}

run().catch(e => console.error('Error:', e.message));
