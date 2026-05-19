-- ============================================================
-- The Hideaway Dubai — Coupons Table Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.coupons (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code                TEXT NOT NULL UNIQUE,
    description         TEXT NOT NULL,
    discount_type       TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value      NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_value     NUMERIC(10, 2) NOT NULL DEFAULT 0,
    max_uses            INTEGER,                          -- NULL = unlimited
    uses_count          INTEGER NOT NULL DEFAULT 0,
    valid_from          TIMESTAMPTZ NOT NULL DEFAULT now(),
    valid_until         TIMESTAMPTZ,                     -- NULL = never expires
    applicable_services TEXT[],                          -- NULL = all services
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast code lookups (used on every booking validation)
CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons (code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON public.coupons (is_active);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_coupons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_coupons_updated_at ON public.coupons;
CREATE TRIGGER trg_coupons_updated_at
    BEFORE UPDATE ON public.coupons
    FOR EACH ROW EXECUTE FUNCTION public.update_coupons_updated_at();

-- RLS: Only admins can write; anyone can read active coupons to validate them
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Public can validate (read active coupons)
CREATE POLICY "Anyone can read active coupons"
    ON public.coupons FOR SELECT
    USING (is_active = TRUE);

-- Authenticated users with admin role can manage coupons
CREATE POLICY "Admins can manage coupons"
    ON public.coupons FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- Seed a sample welcome coupon to test with
-- ============================================================
INSERT INTO public.coupons (code, description, discount_type, discount_value, min_order_value, max_uses)
VALUES
    ('WELCOME20',   'Welcome gift — 20% off your first visit',        'percentage', 20,  0,   NULL),
    ('HIDEAWAY50',  'AED 50 off any booking over AED 200',            'fixed',      50,  200, 100),
    ('BIRTHDAY15',  'Birthday month special — 15% off',               'percentage', 15,  0,   NULL)
ON CONFLICT (code) DO NOTHING;
