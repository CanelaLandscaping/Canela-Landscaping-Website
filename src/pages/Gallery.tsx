import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import PageHeader from "../components/PageHeader";
import SectionCTA from "../components/SectionCTA";
import {
  getCategories,
  getServices,
  getServiceImages,
  type CMSCategory,
  type CMSService,
  type CMSImage,
  getSiteSettings
} from "../supabase/queries";
import { Loader2 } from "lucide-react";

interface PageHeaderContent {
  badge_en: string;
  badge_es: string;
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
}

const Gallery = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [imagesByService, setImagesByService] = useState<
    Record<string, CMSImage[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [headerContent, setHeaderContent] = useState<PageHeaderContent | null>(
    null,
  );

  const fetchData = async () => {
    try {
      const [cats, servs, imgs, headerData] = await Promise.all([
        getCategories(),
        getServices(),
        getServiceImages(),
        getSiteSettings('page_header_gallery')
      ]);
      if (headerData) setHeaderContent(headerData);

      setCategories(cats);
      setServices(servs.filter((s) => s.is_active));

      // Group images by service_id
      const grouped = imgs.reduce(
        (acc, img) => {
          if (!acc[img.service_id]) acc[img.service_id] = [];
          acc[img.service_id].push(img);
          return acc;
        },
        {} as Record<string, CMSImage[]>,
      );

      setImagesByService(grouped);
    } catch (err) {
      console.error("Error fetching gallery data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollToSection = (id: string, updateHash = true) => {
    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth < 1024;
      const navHeight = isMobile ? 148 : 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });

      if (updateHash) {
        window.history.replaceState(null, "", `#${id}`);
      }
    }
  };

  useEffect(() => {
    if (!loading && location.hash) {
      const timer = setTimeout(() => {
        const id = location.hash.replace("#", "");
        scrollToSection(id, false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [loading, location.hash]);

  const getCategoryLabel = (cat: CMSCategory) => {
    const lang = localStorage.getItem("i18nextLng") || "en";
    return lang.startsWith("es") ? cat.name_es : cat.name_en;
  };

  const getServiceTitle = (serv: CMSService) => {
    const lang = localStorage.getItem("i18nextLng") || "en";
    return lang.startsWith("es") ? serv.title_es : serv.title_en;
  };

  const getServiceDescription = (serv: CMSService) => {
    const lang = localStorage.getItem("i18nextLng") || "en";
    return lang.startsWith("es") ? serv.description_es : serv.description_en;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={48} className="animate-spin text-emerald-600 mb-4" />
        <p className="text-slate-500 font-bold animate-pulse">
          Loading Gallery...
        </p>
      </div>
    );
  }

  return (
    <section className="pt-48 md:pt-36 pb-32 bg-white/50 px-6 md:px-12">
      {/* Mobile/Tablet Fixed Navigation Bar */}
      <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="container-custom py-6 flex gap-4 px-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() =>
                scrollToSection(
                  `category-${category.name_en.toLowerCase().replace(/\s+/g, "-")}`,
                )
              }
              className="whitespace-nowrap px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 shadow-sm active:scale-95 transition-transform"
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      <div className="container-custom">
        {/* Page header */}
        <div className="mb-20 lg:mb-24 px-4 sm:px-0">
          <PageHeader
            badge={i18n.language.startsWith('es') ? (headerContent?.badge_es || t("gallery.badge")) : (headerContent?.badge_en || t("gallery.badge"))}
            title={i18n.language.startsWith('es') ? (headerContent?.title_es || t("gallery.title")) : (headerContent?.title_en || t("gallery.title"))}
            subtitle={i18n.language.startsWith('es') ? (headerContent?.subtitle_es || t("gallery.subtitle")) : (headerContent?.subtitle_en || t("gallery.subtitle"))}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8 relative">
          {/* Sticky Sidebar Navigation (Desktop Only) */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="sticky top-32 space-y-6 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hidden lg:block">
              <div>
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
                  {t("gallery.nav")}
                </h4>
                <nav className="space-y-6">
                  {categories.map((category) => (
                    <div key={category.id} className="space-y-3">
                      <button
                        onClick={() =>
                          scrollToSection(
                            `category-${category.name_en.toLowerCase().replace(/\s+/g, "-")}`,
                          )
                        }
                        className="text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors uppercase tracking-tight"
                      >
                        {getCategoryLabel(category)}
                      </button>
                      <div className="pl-4 space-y-2 border-l border-slate-100">
                        {services
                          .filter((s) => s.category_id === category.id)
                          .map((service) => (
                            <button
                              key={service.id}
                              onClick={() =>
                                scrollToSection(`service-${service.id}`)
                              }
                              className="block text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors text-left"
                            >
                              {getServiceTitle(service)}
                            </button>
                          ))}
                      </div>
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Main Gallery Content */}
          <div className="flex-grow space-y-40">
            {categories.map((category) => {
              const categoryServices = services.filter(
                (s) => s.category_id === category.id,
              );
              const categoryId = `category-${category.name_en.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <div
                  key={category.id}
                  id={categoryId}
                  className="scroll-mt-56 lg:scroll-mt-32"
                >
                  {/* Category Heading */}
                  <div className="flex items-center gap-6 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-950 whitespace-nowrap uppercase tracking-tighter">
                      {getCategoryLabel(category)}
                    </h2>
                    <div className="h-px bg-slate-200 w-full"></div>
                  </div>

                  {/* Subsections per Service */}
                  <div className="space-y-24">
                    {categoryServices.map((service) => {
                      const serviceImgs = imagesByService[service.id] || [];
                      if (serviceImgs.length === 0) return null;

                      return (
                        <div
                          key={service.id}
                          id={`service-${service.id}`}
                          className="scroll-mt-72 lg:scroll-mt-48"
                        >
                          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                            <div className="max-w-xl">
                              <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                                <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                                {getServiceTitle(service)}
                              </h3>
                              <p className="text-slate-500 text-sm italic">
                                {getServiceDescription(service)}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {serviceImgs.map((img, imgIdx) => (
                              <motion.div
                                key={img.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: imgIdx * 0.1 }}
                                className="aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
                              >
                                <img
                                  src={img.url}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  alt={`${getServiceTitle(service)} View ${imgIdx + 1}`}
                                  loading="lazy"
                                />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <SectionCTA
          variant="dark"
          bgImage="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=2000"
          title={
            <Trans i18nKey="gallery.cta.title">
              Ready for your <br />
              <span className="text-emerald-500 italic">
                next transformation?
              </span>
            </Trans>
          }
          subtitle={t("gallery.cta.subtitle")}
          buttonText={t("gallery.cta.button")}
          buttonTo="/contact"
        />
      </div>
    </section>
  );
};

export default Gallery;
