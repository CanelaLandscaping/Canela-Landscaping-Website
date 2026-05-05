-- Migration 010: Social Media Links Settings
-- Adds default entries for social media links to the cms_settings table

-- 1. Ensure the settings table exists (in case it was missed in earlier migrations)
CREATE TABLE IF NOT EXISTS public.cms_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS if not already enabled
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

-- 3. Ensure policies exist (DROP and CREATE to avoid duplicates)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow public read access to settings') THEN
        CREATE POLICY "Allow public read access to settings" ON public.cms_settings FOR SELECT TO anon, authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow authenticated update access to settings') THEN
        CREATE POLICY "Allow authenticated update access to settings" ON public.cms_settings FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 4. Seed Settings
-- We use JSONB formatting to match the existing settings structure
INSERT INTO public.cms_settings (key, value)
VALUES 
    ('facebook_url', '""'::jsonb),
    ('instagram_url', '""'::jsonb),
    ('show_social_links', 'true'::jsonb),
    ('business_phone', '"(216) 538-4311"'::jsonb),
    ('business_email', '"contact@canela-landscaping.com"'::jsonb),
    ('business_hours', '"Mon - Fri, 8am - 6pm"'::jsonb),
    ('business_hours_es', '"Lun - Vie, 8am - 6pm"'::jsonb),
    ('email_reply_time', '"We reply within 24h"'::jsonb),
    ('email_reply_time_es', '"Respondemos en menos de 24h"'::jsonb)
ON CONFLICT (key) DO NOTHING;
