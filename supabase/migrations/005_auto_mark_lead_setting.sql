-- Migration: Add auto_mark_leads_read setting

INSERT INTO public.cms_settings (key, value)
VALUES ('auto_mark_leads_read', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;
