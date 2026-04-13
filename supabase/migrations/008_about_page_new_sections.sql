-- Add CTA section to the About page (Removed Testimonial per request)
INSERT INTO public.cms_sections (page_id, type, display_order, content) VALUES
('about', 'cta', 3, '{
  "variant": "emerald",
  "title_en": "Ready to tell your story in green?",
  "title_es": "¿Listo para contar su historia en verde?",
  "subtitle_en": "Join the Canela family of satisfied homeowners today and let us bring your vision to life.",
  "subtitle_es": "Únase a la familia Canela de propietarios satisfechos hoy y permítanos dar vida a su visión.",
  "button_en": "Get Your Quote",
  "button_es": "Obtenga su Cotización",
  "button_to": "/contact"
}');
