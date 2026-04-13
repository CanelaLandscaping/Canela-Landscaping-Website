-- Migration: 007_cms_dynamic_pages.sql
-- Description: Adds tables for dynamic page and section management.

-- 1. Page Table
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id TEXT PRIMARY KEY,
    title_en TEXT NOT NULL,
    title_es TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Section Table
CREATE TABLE IF NOT EXISTS public.cms_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_id TEXT REFERENCES public.cms_pages(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content JSONB NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. RLS Policies
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on cms_pages" ON public.cms_pages FOR SELECT USING (true);
CREATE POLICY "Allow public read access on cms_sections" ON public.cms_sections FOR SELECT USING (true);

-- Allow full access to authenticated admins (simplified)
CREATE POLICY "Allow full access to admins on cms_pages" ON public.cms_pages FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow full access to admins on cms_sections" ON public.cms_sections FOR ALL TO authenticated USING (true);

-- 4. Storage Bucket Setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-assets', 'cms-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Note: Using DO blocks to safely create policies without failing if they exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public Access for cms-assets'
    ) THEN
        CREATE POLICY "Public Access for cms-assets" ON storage.objects FOR SELECT USING (bucket_id = 'cms-assets');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Admin All Access for cms-assets'
    ) THEN
        CREATE POLICY "Admin All Access for cms-assets" ON storage.objects FOR ALL TO authenticated USING (bucket_id = 'cms-assets');
    END IF;
END
$$;

-- 5. Initial Seed Data
INSERT INTO public.cms_pages (id, title_en, title_es) VALUES
('home', 'Home Page', 'Página de Inicio'),
('about', 'About Us', 'Sobre Nosotros')
ON CONFLICT (id) DO NOTHING;

-- Home Page Sections
INSERT INTO public.cms_sections (page_id, type, display_order, content) VALUES
('home', 'hero', 0, '{
  "badge_en": "Premium Landscaping",
  "badge_es": "Paisajismo de Primera",
  "title_en": "Expert Care for Your Outdoor Home.",
  "title_es": "Cuidado Experto para su Hogar Exterior.",
  "subtitle_en": "Transforming your outdoor spaces into living masterpieces with precision, passion, and unparalleled expertise.",
  "subtitle_es": "Transformando sus espacios exteriores en obras maestras vivientes con precisión, pasión y una experiencia inigualable.",
  "cta_en": "Get a Free Estimate",
  "cta_es": "Obtenga un Presupuesto Gratuito",
  "cta_to": "/contact",
  "secondary_en": "Our Services",
  "secondary_es": "Nuestros Servicios",
  "secondary_to": "/services",
  "video_url": "https://media.istockphoto.com/id/2188117475/video/wide-angle-view-of-hispanic-man-raking-soil-with-a-team-planting-a-flowerbed-in-a.mp4?s=mp4-640x640-is&k=20&c=UyEURF_PxaMKcZ7Mmnt_FAjc_UqMpztVP_zmIrbL58M=",
  "poster_url": "https://images.unsplash.com/photo-1592591544551-4903513f2f1b?auto=format&fit=crop&q=80&w=2000"
}'),
('home', 'trust-badges', 1, '{
  "badges": [
    {"text_en": "Rated 5 Stars", "text_es": "Calificado con 5 Estrellas", "icon": "star"},
    {"text_en": "Fully Insured", "text_es": "Totalmente Asegurado", "icon": "check"},
    {"text_en": "15+ Years Experience", "text_es": "Más de 15 Años de Experiencia", "icon": "check"},
    {"text_en": "Certified Arborists", "text_es": "Arbolistas Certificados", "icon": "star"}
  ]
}'),
('home', 'featured-services', 2, '{
  "badge_en": "What we do",
  "badge_es": "Lo Que Hacemos",
  "title_en": "Crafting Exceptional Outdoor Experiences.",
  "title_es": "Creando Experiencias Exteriores Excepcionales.",
  "viewAll_en": "View All 15+ Services",
  "viewAll_es": "Ver Todos los Más de 15 Servicios"
}'),
('home', 'why-us', 3, '{
  "badge_en": "The Canela Difference",
  "badge_es": "La Diferencia Canela",
  "title_en": "Why homeowners trust us with their vision.",
  "title_es": "Por qué los propietarios confían en nosotros para su visión.",
  "stats_count": "1k+",
  "stats_label_en": "Properties Restored",
  "stats_label_es": "Propiedades Restauradas",
  "image_url": "https://dennis7dees.com/wp-content/uploads/2021/08/modern-woodland-9.jpg",
  "points": [
    {
      "title_en": "Quality Guaranteed",
      "title_es": "Calidad Garantizada",
      "desc_en": "We never cut corners. Our team uses the highest-grade materials and equipment.",
      "desc_es": "Nunca escatimamos esfuerzos. Nuestro equipo utiliza materiales y equipos de la más alta calidad."
    },
    {
      "title_en": "Reliable Schedules",
      "title_es": "Horarios Confiables",
      "desc_en": "We show up when we say we will. Your time is valuable, and we respect it.",
      "desc_es": "Nos presentamos cuando decimos que lo haremos. Su tiempo es valioso y lo respetamos."
    },
    {
      "title_en": "Passionate Care",
      "title_es": "Cuidado Apasionado",
      "desc_en": "We treat every garden as if it were our own, with attention to every detail.",
      "desc_es": "Tratamos cada jardín como si fuera el nuestro, con atención a cada detalle."
    }
  ]
}'),
('home', 'testimonial', 4, '{
  "quote_en": "Canela Landscaping completely transformed our backyard. Their attention to detail during the spring cleanup was unlike anything we''ve seen before. Our lawn has never looked better!",
  "quote_es": "Canela Landscaping transformó completamente nuestro patio trasero. Su atención al detalle durante la limpieza de primavera fue diferente a todo lo que habíamos visto antes. ¡Nuestro césped nunca se ha visto mejor!",
  "author": "Sarah & Michael J.",
  "location_en": "Homeowners, Cleveland, Ohio",
  "location_es": "Propietarios, Cleveland, Ohio"
}'),
('home', 'cta', 5, '{
  "variant": "light",
  "title_en": "Ready to start your next outdoor project?",
  "title_es": "¿Listo para comenzar su próximo proyecto al aire libre?",
  "subtitle_en": "Join hundreds of happy homeowners today. Get a free, no-obligation quote.",
  "subtitle_es": "Únase a cientos de propietarios felices hoy. Obtenga un presupuesto gratuito y sin compromiso.",
  "button_en": "Start My Transformation",
  "button_es": "Comenzar Mi Transformación",
  "button_to": "/contact"
}');

-- About Page Sections
INSERT INTO public.cms_sections (page_id, type, display_order, content) VALUES
('about', 'story', 0, '{
  "badge_en": "Our Story",
  "badge_es": "Nuestra Historia",
  "title_en": "Rooted in Quality.",
  "title_es": "Arraigados en la Calidad.",
  "content_en": "Founded over 15 years ago, Canela Landscaping began with a simple mission: to provide the highest level of craftsmanship and care for every outdoor space we touch.",
  "content_es": "Fundada hace más de 15 años, Canela Landscaping comenzó con una misión simple: brindar el más alto nivel de artesanía y cuidado en cada espacio al aire libre que tocamos.",
  "quote_en": "\"We don''t just mow lawns; we cultivate environments where families grow and memories are made.\"",
  "quote_es": "\"No solo cortamos el césped; cultivamos entornos donde las familias crecen y se crean recuerdos.\"",
  "image_url": "https://images.unsplash.com/photo-1466781783364-391eaf53cf39?auto=format&fit=crop&q=80&w=1000"
}'),
('about', 'values', 1, '{
  "mission": {
    "title_en": "Our Mission",
    "title_es": "Nuestra Misión",
    "content_en": "\"To elevate the standard of residential landscaping through innovation, reliability, and artistic design.\"",
    "content_es": "\"Elevar el estándar del paisajismo residencial a través de la innovación, la confiabilidad y el diseño artístico.\""
  },
  "promise": {
    "title_en": "Our Promise",
    "title_es": "Nuestra Promesa",
    "content_en": "Full insurance, certified technicians, and a satisfaction guarantee on every single project we undertake.",
    "content_es": "Seguro completo, técnicos certificados y garantía de satisfacción en cada proyecto que emprendemos."
  },
  "team": {
    "title_en": "Our Team",
    "title_es": "Nuestro Equipo",
    "content_en": "A dedicated group of horticultural experts, designers, and maintenance pros who love what they do.",
    "content_es": "Un grupo dedicado de expertos en horticultura, diseñadores y profesionales del mantenimiento que aman lo que hacen."
  }
}'),
('about', 'team', 2, '{
  "badge_en": "The Experts",
  "badge_es": "Los Expertos",
  "title_en": "Meet the Canela Family.",
  "title_es": "Conozca a la Familia Canela.",
  "description_en": "At Canela Landscaping, we treat every lawn like our own. As a family-owned and operated team, our passion for excellence is a personal commitment from our family to yours—led with heart by Domingo and Nora.",
  "description_es": "En Canela Landscaping, tratamos cada césped como el nuestro. Como un equipo familiar, nuestra pasión por la excelencia es un compromiso personal de nuestra familia para la suya, liderado con el corazón por Domingo y Nora.",
  "members": [
    {
      "name": "Domingo Canela",
      "role_en": "Founder & Lead Technician",
      "role_es": "Fundador y Técnico Principal",
      "img": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
    },
    {
      "name": "Nora Canela",
      "role_en": "Co-Founder & Operations",
      "role_es": "Cofundadora y Operaciones",
      "img": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
    }
  ]
}');
