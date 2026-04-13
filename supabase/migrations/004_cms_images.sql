-- CMS Migration Phase 3: Dynamic Image Management

-- 1. Create cms_images table
CREATE TABLE IF NOT EXISTS public.cms_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id TEXT REFERENCES public.cms_services(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    storage_path TEXT, -- Null for external links
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_images ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to images"
    ON public.cms_images FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated management
CREATE POLICY "Allow authenticated management of images"
    ON public.cms_images FOR ALL
    TO authenticated
    USING (true);

-- 2. Seed Initial Images (Migrating from local hardcoded data)
-- Lawn Mowing
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('lawn-mowing', '/images/lawn-mowing-1.webp', 1),
    ('lawn-mowing', '/images/lawn-mowing-2.webp', 2),
    ('lawn-mowing', '/images/lawn-mowing-3.webp', 3);

-- Clean Edging
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('edges', '/images/edges-1.webp', 1),
    ('edges', '/images/mulch-2.webp', 2),
    ('edges', '/images/mulch-1.webp', 3);

-- Lawn Maintenance
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('lawn-maintenance', '/images/lawn-mowing-1.webp', 1),
    ('lawn-maintenance', '/images/bush-trimming-1.webp', 2),
    ('lawn-maintenance', '/images/lawn-mowing-3.webp', 3);

-- Bush & Hedge Trimming
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('bush-trimming', '/images/bush-trimming-1.webp', 1),
    ('bush-trimming', '/images/bush-trimming-2.webp', 2),
    ('bush-trimming', '/images/bush-trimming-3.webp', 3);

-- Weed Pulling
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('weeds', '/images/bush-trimming-2.webp', 1),
    ('weeds', '/images/yard-cleanup-1.webp', 2),
    ('weeds', '/images/lawn-mowing-2.webp', 3);

-- Mulch Installation
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('mulch', '/images/mulch-1.webp', 1),
    ('mulch', '/images/mulch-2.webp', 2),
    ('mulch', '/images/mulch-3.webp', 3);

-- Top Soil & Grading
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('top-soil', '/images/mulch-3.webp', 1),
    ('top-soil', '/images/lawn-mowing-3.webp', 2);

-- Lawn Reseeding
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('reseeding', '/images/lawn-mowing-4.webp', 1),
    ('reseeding', '/images/bush-trimming-3.webp', 2);

-- Storm Damage Cleanup
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('storm-cleanup', '/images/yard-cleanup-1.webp', 1),
    ('storm-cleanup', '/images/bush-trimming-1.webp', 2),
    ('storm-cleanup', '/images/lawn-mowing-1.webp', 3);

-- General Yard Cleanup
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('yard-cleanup', '/images/yard-cleanup-1.webp', 1),
    ('yard-cleanup', '/images/yard-cleanup-2.webp', 2),
    ('yard-cleanup', '/images/bush-trimming-4.webp', 3);

-- Leaf Removal
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('leaf-cleanup', '/images/yard-cleanup-2.webp', 1),
    ('leaf-cleanup', '/images/mulch-4.webp', 2);

-- Patio Repair & Masonry
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('patios', '/images/edges-1.webp', 1),
    ('patios', '/images/bush-trimming-4.webp', 2),
    ('patios', '/images/mulch-2.webp', 3);

-- Spring & Fall Cleanup
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('seasonal-cleanup', '/images/lawn-mowing-3.webp', 1);

-- River Gravel Installation
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('gravel', '/images/yard-cleanup-1.webp', 1),
    ('gravel', '/images/bush-trimming-2.webp', 2),
    ('gravel', '/images/lawn-mowing-2.webp', 3);

-- Snow Plowing
INSERT INTO public.cms_images (service_id, url, display_order) VALUES 
    ('snow-plow', '/images/snow-plowing-1.webp', 1);
