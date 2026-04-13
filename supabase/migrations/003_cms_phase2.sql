-- CMS Migration Phase 2: Services, Categories, and Settings

-- 1. Create service_categories table
CREATE TABLE IF NOT EXISTS public.cms_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL UNIQUE,
    name_es TEXT NOT NULL UNIQUE,
    display_order INT DEFAULT 0,
    sort_type TEXT DEFAULT 'alphabetical' CHECK (sort_type IN ('alphabetical', 'custom')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_categories ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to categories"
    ON public.cms_categories FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated update access
CREATE POLICY "Allow authenticated update access to categories"
    ON public.cms_categories FOR ALL
    TO authenticated
    USING (true);

-- 2. Create services table
CREATE TABLE IF NOT EXISTS public.cms_services (
    id TEXT PRIMARY KEY, -- Slug (e.g., 'lawn-mowing')
    category_id UUID REFERENCES public.cms_categories(id) ON DELETE SET NULL,
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,
    description_en TEXT NOT NULL,
    description_es TEXT NOT NULL,
    icon TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_services ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to services"
    ON public.cms_services FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated update access
CREATE POLICY "Allow authenticated update access to services"
    ON public.cms_services FOR ALL
    TO authenticated
    USING (true);

-- 3. Create site_settings table
CREATE TABLE IF NOT EXISTS public.cms_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to settings"
    ON public.cms_settings FOR SELECT
    TO anon, authenticated
    USING (true);

-- Allow authenticated update access
CREATE POLICY "Allow authenticated update access to settings"
    ON public.cms_settings FOR ALL
    TO authenticated
    USING (true);

-- 4. Seed Categories
INSERT INTO public.cms_categories (name_en, name_es, display_order)
VALUES 
    ('Lawn Care', 'Cuidado del Césped', 1),
    ('Maintenance', 'Mantenimiento', 2),
    ('Specialty', 'Especialidad', 3),
    ('Seasonal', 'Estacional', 4)
ON CONFLICT (name_en) DO NOTHING;

-- 5. Set Recent Leads Limit default
INSERT INTO public.cms_settings (key, value)
VALUES ('recent_leads_limit', '10'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 6. Seed Services (Full content from services.ts and es.json)
INSERT INTO public.cms_services (id, category_id, title_en, title_es, description_en, description_es, icon, is_featured, display_order)
VALUES 
    ('lawn-mowing', (SELECT id FROM cms_categories WHERE name_en = 'Lawn Care' LIMIT 1), 'Professional Lawn Mowing', 'Corte de Césped Profesional', 'Precision mowing with professional striping and trimming for a pristine look.', 'Corte de precisión con franjas y recortes profesionales para una apariencia impecable.', 'Scissors', true, 1),
    ('edges', (SELECT id FROM cms_categories WHERE name_en = 'Lawn Care' LIMIT 1), 'Clean Edging', 'Bordes Limpios', 'Sharp, clean borders between your lawn and walkways or garden beds.', 'Bordes nítidos y limpios entre su césped y los pasillos o camas de jardín.', 'Maximize', false, 2),
    ('lawn-maintenance', (SELECT id FROM cms_categories WHERE name_en = 'Lawn Care' LIMIT 1), 'Lawn Maintenance', 'Mantenimiento del Césped', 'Comprehensive care including fertilization and aeration to keep your grass healthy.', 'Cuidado integral que incluye fertilización y aireación para mantener su césped saludable.', 'Heart', false, 3),
    ('bush-trimming', (SELECT id FROM cms_categories WHERE name_en = 'Maintenance' LIMIT 1), 'Bush & Hedge Trimming', 'Poda de Arbustos y Setos', 'Expert pruning to maintain the shape and health of your shrubs and hedges.', 'Poda experta para mantener la forma y la salud de sus arbustos y setos.', 'Sun', false, 4),
    ('weeds', (SELECT id FROM cms_categories WHERE name_en = 'Lawn Care' LIMIT 1), 'Weed Pulling', 'Arrancando de Malezas', 'Thorough removal of invasive weeds from your garden beds and lawn.', 'Eliminación completa de malezas invasoras de sus macizos de flores y césped.', 'Trash2', false, 5),
    ('mulch', (SELECT id FROM cms_categories WHERE name_en = 'Maintenance' LIMIT 1), 'Mulch Installation', 'Instalación de Mantillo (Mulch)', 'Fresh, high-quality mulch to protect soil moisture and suppress weeds.', 'Mantillo fresco y de alta calidad para proteger la humedad del suelo y suprimir las malezas.', 'Layers', true, 6),
    ('top-soil', (SELECT id FROM cms_categories WHERE name_en = 'Lawn Care' LIMIT 1), 'Top Soil & Grading', 'Tierra Vegetal y Nivelación', 'Leveling and nutrient-rich soil application for optimal plant growth.', 'Aplicación de suelo rico en nutrientes y nivelación para un crecimiento óptimo de las plantas.', 'TrendingUp', false, 7),
    ('reseeding', (SELECT id FROM cms_categories WHERE name_en = 'Lawn Care' LIMIT 1), 'Lawn Reseeding', 'Resiembra de Césped', 'Repairing thin or bare spots with premium grass seed blends.', 'Reparación de áreas ralas o desnudas con mezclas de semillas de césped de primera calidad.', 'Sprout', false, 8),
    ('storm-cleanup', (SELECT id FROM cms_categories WHERE name_en = 'Specialty' LIMIT 1), 'Storm Damage Clean-up', 'Limpieza de Daños por Tormentas', 'Rapid response to clear debris, branches, and mess after severe weather.', 'Respuesta rápida para limpiar escombros, ramas y suciedad después de un clima severo.', 'Wind', false, 9),
    ('yard-cleanup', (SELECT id FROM cms_categories WHERE name_en = 'Maintenance' LIMIT 1), 'General Yard Cleanup', 'Limpieza General del Patio', 'Restoring order to your outdoor space with comprehensive clearing and hauling.', 'Restaurando el orden en su espacio exterior con limpieza y transporte integral.', 'RefreshCw', false, 10),
    ('leaf-cleanup', (SELECT id FROM cms_categories WHERE name_en = 'Seasonal' LIMIT 1), 'Leaf Removal', 'Recolección de Hojas', 'Efficient leaf collection and removal to protect your grass during fall.', 'Recolección y eliminación eficiente de hojas para proteger su césped durante el otoño.', 'CloudRain', false, 11),
    ('patios', (SELECT id FROM cms_categories WHERE name_en = 'Specialty' LIMIT 1), 'Patio Repair & Masonry', 'Reparación de Patios y Masonería', 'Fixing cracked pavers, leveling surfaces, and restoring stone features.', 'Reparación de adoquines agrietados, nivelación de superficies y restauración de elementos de piedra.', 'Grid', false, 12),
    ('seasonal-cleanup', (SELECT id FROM cms_categories WHERE name_en = 'Maintenance' LIMIT 1), 'Spring & Fall Clean-up', 'Limpieza de Primavera y Otoño', 'Deep cleaning and preparation for the changing seasons.', 'Limpieza profunda y preparación para el cambio de estaciones.', 'Calendar', false, 13),
    ('gravel', (SELECT id FROM cms_categories WHERE name_en = 'Specialty' LIMIT 1), 'River Gravel Installation', 'Instalación de Grava de Río', 'Beautiful, low-maintenance gravel features and drainage solutions.', 'Hermosos elementos de grava de bajo mantenimiento y soluciones de drenaje.', 'Anchor', false, 14),
    ('snow-plow', (SELECT id FROM cms_categories WHERE name_en = 'Seasonal' LIMIT 1), 'Snow Plowing', 'Eliminación de Nieve', 'Reliable, 24/7 snow removal for driveways and walkways during winter.', 'Remoción de nieve confiable las 24 horas, los 7 días de la semana para entradas y pasillos durante el invierno.', 'Snowflake', true, 15)
ON CONFLICT (id) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    title_en = EXCLUDED.title_en,
    title_es = EXCLUDED.title_es,
    description_en = EXCLUDED.description_en,
    description_es = EXCLUDED.description_es,
    icon = EXCLUDED.icon,
    is_featured = EXCLUDED.is_featured,
    display_order = EXCLUDED.display_order;
