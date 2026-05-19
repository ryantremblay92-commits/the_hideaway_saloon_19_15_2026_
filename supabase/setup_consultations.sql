-- 1. Create Consultations Table
CREATE TABLE IF NOT EXISTS consultations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    color_level INTEGER NOT NULL,
    tone TEXT NOT NULL,
    selected_color_name TEXT NOT NULL,
    reference_images TEXT[] NOT NULL,
    current_hair_images TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    estimated_price NUMERIC,
    sessions_required INTEGER,
    stylist_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Consultation Messages Table
CREATE TABLE IF NOT EXISTS consultation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultation_id UUID REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'stylist')),
    sender_id UUID REFERENCES auth.users(id) NOT NULL,
    text_content TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Consultations
-- Users can see their own consultations
CREATE POLICY "Users can view own consultations" ON consultations
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own consultations
CREATE POLICY "Users can insert own consultations" ON consultations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Admins can view all consultations
CREATE POLICY "Admins can view all consultations" ON consultations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Admins can update all consultations (approve/reject/estimate)
CREATE POLICY "Admins can update consultations" ON consultations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 5. RLS Policies for Consultation Messages
-- Users can see messages for their consultations
CREATE POLICY "Users can view messages for their consultations" ON consultation_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM consultations 
            WHERE consultations.id = consultation_messages.consultation_id AND consultations.user_id = auth.uid()
        )
    );

-- Users can send messages to their consultations
CREATE POLICY "Users can insert messages to their consultations" ON consultation_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM consultations 
            WHERE consultations.id = consultation_messages.consultation_id AND consultations.user_id = auth.uid()
        )
    );

-- Admins can view all messages
CREATE POLICY "Admins can view all messages" ON consultation_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- Admins can send messages
CREATE POLICY "Admins can insert messages" ON consultation_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );

-- 6. Setup Realtime
alter publication supabase_realtime add table consultation_messages;

-- 7. Setup Storage Bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('consultation_images', 'consultation_images', true)
ON CONFLICT (id) DO NOTHING;

-- 8. Storage RLS Policies
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'consultation_images');

CREATE POLICY "Authenticated users can upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'consultation_images');
