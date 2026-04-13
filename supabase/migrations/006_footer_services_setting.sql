-- Migration: Seed Footer Services Config

INSERT INTO public.cms_settings (key, value)
VALUES (
    'footer_services', 
    '["lawn-mowing", "lawn-maintenance", "edges", "bush-trimming", "mulch", "leaf-cleanup", "snow-plow", "yard-cleanup", "patios", "storm-cleanup"]'::jsonb
)
ON CONFLICT (key) DO NOTHING;
