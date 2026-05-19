const { Client } = require('pg');

const connectionString = 'postgresql://postgres.mbvvsdlixtabnwvikqom:Eligancia%402026%23Secure@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres';

async function run() {
    const client = new Client({ connectionString });
    await client.connect();
    console.log('Connected!');

    // 1. Create services table
    await client.query(`
    CREATE TABLE IF NOT EXISTS public.services (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      icon TEXT NOT NULL,
      short_desc TEXT NOT NULL,
      long_desc TEXT,
      sub_services TEXT[],
      image_url TEXT NOT NULL,
      starting_price NUMERIC NOT NULL,
      duration TEXT NOT NULL,
      tag TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
    console.log('✅ Services table created');

    // 2. RLS + Policies
    await client.query(`ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;`);
    try {
        await client.query(`CREATE POLICY "Public services are viewable by everyone." ON public.services FOR SELECT USING (true);`);
    } catch (e) { console.log('Policy already exists or:', e.message); }
    try {
        await client.query(`CREATE POLICY "Admins can manage services." ON public.services FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));`);
    } catch (e) { console.log('Policy already exists or:', e.message); }
    console.log('✅ Services RLS configured');

    // 3. Seed services data
    const services = [
        {
            slug: 'haircuts-styling', title: 'Haircuts & Styling', category: 'hair', icon: 'Scissors',
            short_desc: 'Clean lines and sharp edges. We listen to what you want and deliver it.',
            long_desc: 'Each cut is designed to work with your natural texture and grow out beautifully.',
            sub_services: ['Ladies Haircut', 'Gents Haircut', 'Kids Haircut', 'Blow Dry', 'Hair Setting', 'Trim & Shape'],
            image_url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80',
            starting_price: 350, duration: '30-60 mins', tag: 'Most Popular'
        },
        {
            slug: 'hair-coloring', title: 'Hair Color', category: 'hair', icon: 'Palette',
            short_desc: 'Balayage, highlights, global color, and correction.',
            long_desc: 'From subtle sun-kissed balayage to bold full-color transformations.',
            sub_services: ['Global Color', 'Balayage', 'Highlights', 'Ombre', 'Color Correction', 'Toning & Gloss'],
            image_url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80',
            starting_price: 1200, duration: '90-180 mins', tag: 'Trending'
        },
        {
            slug: 'hair-treatments', title: 'Treatments', category: 'hair', icon: 'Sparkles',
            short_desc: 'Keratin, spa, restoration.',
            long_desc: 'Every treatment is customized to your hair condition.',
            sub_services: ['Hair Spa', 'Keratin Treatment', 'Smoothening', 'Deep Conditioning', 'Scalp Treatment', 'Aromatherapy'],
            image_url: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=800&q=80',
            starting_price: 800, duration: '60-120 mins', tag: null
        },
        {
            slug: 'bridal-styling', title: 'Bridal Styling', category: 'bridals', icon: 'Crown',
            short_desc: 'Styles that hold through dancing and photographs.',
            long_desc: 'Your wedding day gets the full attention it deserves.',
            sub_services: ['Bridal Hair', 'Bridal Makeup', 'Pre-Bridal Package', 'Trial Session', 'Party Makeup', 'Saree Draping'],
            image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
            starting_price: 8000, duration: '3-6 hours', tag: 'Premium'
        },
        {
            slug: 'mens-grooming', title: "Men's Grooming", category: 'hair', icon: 'Zap',
            short_desc: 'Beards and cuts handled with equal precision.',
            long_desc: 'No compromise on technique.',
            sub_services: ['Haircut', 'Beard Trim', 'Beard Styling', 'Clean Shave', 'Scalp Treatment', 'Hair Color (Men)'],
            image_url: 'https://images.unsplash.com/photo-1503951914875-452162b28f1f?w=800&q=80',
            starting_price: 250, duration: '30-45 mins', tag: null
        },
        {
            slug: 'makeup', title: 'Makeup', category: 'makeup', icon: 'Wand2',
            short_desc: 'Color and technique that enhance what you have.',
            long_desc: 'We make you look like yourself — only better.',
            sub_services: ['Party Makeup', 'Bridal Makeup', 'Engagement Makeup', 'Photoshoot Makeup', 'Airbrush Makeup', 'HD Makeup'],
            image_url: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=800&q=80',
            starting_price: 1500, duration: '60-90 mins', tag: null
        },
        {
            slug: 'nail-care', title: 'Nail Care', category: 'nails', icon: 'Hand',
            short_desc: 'Finished hands complete the picture.',
            long_desc: 'Quality products and skilled technicians in every session.',
            sub_services: ['Basic Manicure', 'Gel Manicure', 'Basic Pedicure', 'Spa Pedicure', 'Nail Art', 'Gel Extensions', 'Nail Repair'],
            image_url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&q=80',
            starting_price: 400, duration: '45-90 mins', tag: null
        }
    ];

    for (const s of services) {
        try {
            await client.query(
                `INSERT INTO public.services (slug, title, category, icon, short_desc, long_desc, sub_services, image_url, starting_price, duration, tag)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (slug) DO NOTHING`,
                [s.slug, s.title, s.category, s.icon, s.short_desc, s.long_desc, s.sub_services, s.image_url, s.starting_price, s.duration, s.tag]
            );
        } catch (e) { console.error('Insert error for', s.slug, ':', e.message); }
    }
    console.log('✅ Services data seeded');

    // 4. Seed admin user into auth.users
    try {
        await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
        await client.query(`
      INSERT INTO auth.users (id, instance_id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
      VALUES (
        'a5e57ff7-7855-4f72-8d76-5311d3ee7a2a',
        '00000000-0000-0000-0000-000000000000',
        'admin@eleganciasalon.com',
        crypt('AdminPassword123!', gen_salt('bf')),
        now(),
        '{"provider": "email", "providers": ["email"]}',
        '{"full_name": "System Administrator", "role": "admin"}',
        'authenticated',
        'authenticated',
        now(),
        now()
      ) ON CONFLICT (id) DO NOTHING;
    `);
        console.log('✅ Admin auth user created');
    } catch (e) { console.error('Admin auth error:', e.message); }

    // 5. Insert admin profile
    try {
        await client.query(`
      INSERT INTO public.profiles (id, full_name, email, avatar_url, role, loyalty_points, total_spent)
      VALUES (
        'a5e57ff7-7855-4f72-8d76-5311d3ee7a2a',
        'System Administrator',
        'admin@eleganciasalon.com',
        null,
        'admin',
        0,
        0
      ) ON CONFLICT (id) DO NOTHING;
    `);
        console.log('✅ Admin profile created');
    } catch (e) { console.error('Admin profile error:', e.message); }

    // Verify final state
    const tables = await client.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;`);
    console.log('\n📋 Final tables:', tables.rows.map(r => r.table_name));

    const serviceCount = await client.query(`SELECT count(*) FROM public.services;`);
    console.log('📋 Services count:', serviceCount.rows[0].count);

    const adminCheck = await client.query(`SELECT id, email, role FROM public.profiles WHERE role = 'admin';`);
    console.log('📋 Admin users:', adminCheck.rows);

    await client.end();
    console.log('\n🎉 All done!');
}

run().catch(console.error);
