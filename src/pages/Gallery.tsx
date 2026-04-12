import { useEffect } from "react";
import { motion } from "framer-motion";
import { services } from "../data/services";
import { useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import PageHeader from "../components/PageHeader";
import SectionCTA from "../components/SectionCTA";

const Gallery = () => {
  const { t } = useTranslation();
  // Service-specific image portfolios (completely local project photos)
  const serviceImages: Record<string, string[]> = {
    "lawn-mowing": [
      "/images/lawn-mowing-1.webp",
      "/images/lawn-mowing-2.webp",
      "/images/lawn-mowing-3.webp",
    ],
    edges: [
      "/images/edges-1.webp",
      "/images/mulch-2.webp",
      "/images/mulch-1.webp",
    ],
    "lawn-maintenance": [
      "/images/lawn-mowing-1.webp",
      "/images/bush-trimming-1.webp",
      "/images/lawn-mowing-3.webp",
    ],
    "bush-trimming": [
      "/images/bush-trimming-1.webp",
      "/images/bush-trimming-2.webp",
      "/images/bush-trimming-3.webp",
    ],
    weeds: [
      "/images/bush-trimming-2.webp",
      "/images/yard-cleanup-1.webp",
      "/images/lawn-mowing-2.webp",
    ],
    mulch: [
      "/images/mulch-1.webp",
      "/images/mulch-2.webp",
      "/images/mulch-3.webp",
    ],
    "top-soil": ["/images/mulch-3.webp", "/images/lawn-mowing-3.webp"],
    reseeding: ["/images/lawn-mowing-4.webp", "/images/bush-trimming-3.webp"],
    "storm-cleanup": [
      "/images/yard-cleanup-1.webp",
      "/images/bush-trimming-1.webp",
      "/images/lawn-mowing-1.webp",
    ],
    "yard-cleanup": [
      "/images/yard-cleanup-1.webp",
      "/images/yard-cleanup-2.webp",
      "/images/bush-trimming-4.webp",
    ],
    "leaf-cleanup": ["/images/yard-cleanup-2.webp", "/images/mulch-4.webp"],
    patios: [
      "/images/edges-1.webp",
      "/images/bush-trimming-4.webp",
      "/images/mulch-2.webp",
    ],
    "seasonal-cleanup": ["/images/lawn-mowing-3.webp"],
    gravel: [
      "/images/yard-cleanup-1.webp",
      "/images/bush-trimming-2.webp",
      "/images/lawn-mowing-2.webp",
    ],
    "snow-plow": ["/images/snow-plowing-1.webp"],
  };

  const categories = ["Lawn Care", "Maintenance", "Specialty", "Seasonal"];

  const location = useLocation();

  const scrollToSection = (id: string, updateHash = true) => {
    const element = document.getElementById(id);
    if (element) {
      const isMobile = window.innerWidth < 1024;
      const navHeight = isMobile ? 148 : 120; // Account for sticky navbars (72px navbar + ~76px sub-nav)
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
    if (location.hash) {
      // Small timeout to ensure DOM is fully ready and images are loading
      const timer = setTimeout(() => {
        const id = location.hash.replace("#", "");
        scrollToSection(id, false);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "Lawn Care":
        return t("servicesPage.filters.lawnCare");
      case "Maintenance":
        return t("servicesPage.filters.maintenance");
      case "Specialty":
        return t("servicesPage.filters.specialty");
      case "Seasonal":
        return t("servicesPage.filters.seasonal");
      default:
        return cat;
    }
  };

  return (
    <div className="pt-48 md:pt-36 pb-32 bg-white/50">
      {/* Mobile/Tablet Fixed Navigation Bar */}
      <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="container-gallery py-6 flex gap-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                scrollToSection(
                  `category-${category.toLowerCase().replace(/\s+/g, "-")}`,
                )
              }
              className="whitespace-nowrap px-6 py-2.5 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 shadow-sm active:scale-95 transition-transform"
            >
              {getCategoryLabel(category)}
            </button>
          ))}
        </div>
      </div>

      <div className="container-gallery">
        {/* Page header */}
        <div className="mb-20 lg:mb-24">
          <PageHeader
            badge={t("gallery.badge")}
            title={t("gallery.title")}
            subtitle={t("gallery.subtitle")}
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
                    <div key={category} className="space-y-3">
                      <button
                        onClick={() =>
                          scrollToSection(
                            `category-${category.toLowerCase().replace(/\s+/g, "-")}`,
                          )
                        }
                        className="text-sm font-black text-slate-900 hover:text-emerald-600 transition-colors uppercase tracking-tight"
                      >
                        {getCategoryLabel(category)}
                      </button>
                      <div className="pl-4 space-y-2 border-l border-slate-100">
                        {services
                          .filter((s) => s.category === category)
                          .map((service) => (
                            <button
                              key={service.id}
                              onClick={() =>
                                scrollToSection(`service-${service.id}`)
                              }
                              className="block text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors text-left"
                            >
                              {t(`services.${service.id}.title`)}
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
                (s) => s.category === category,
              );
              const categoryId = `category-${category.toLowerCase().replace(/\s+/g, "-")}`;

              return (
                <div
                  key={category}
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
                    {categoryServices.map((service) => (
                      <div
                        key={service.id}
                        id={`service-${service.id}`}
                        className="scroll-mt-72 lg:scroll-mt-48"
                      >
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                          <div className="max-w-xl">
                            <h3 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-3">
                              <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
                              {t(`services.${service.id}.title`)}
                            </h3>
                            <p className="text-slate-500 text-sm italic">
                              {t(`services.${service.id}.description`)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {(serviceImages[service.id] || []).map(
                            (imgUrl, imgIdx) => (
                              <motion.div
                                key={`${service.id}-${imgIdx}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: imgIdx * 0.1 }}
                                className="aspect-square rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group"
                              >
                                <img
                                  src={
                                    imgUrl.startsWith("http") ||
                                    imgUrl.startsWith("/images/")
                                      ? imgUrl
                                      : `https://images.unsplash.com/${imgUrl}?auto=format&fit=crop&q=80&w=800`
                                  }
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  alt={`${t(`services.${service.id}.title`)} View ${imgIdx + 1}`}
                                  loading="lazy"
                                />
                              </motion.div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
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
              <span className="text-emerald-500 italic">next transformation?</span>
            </Trans>
          }
          subtitle={t("gallery.cta.subtitle")}
          buttonText={t("gallery.cta.button")}
          buttonTo="/contact"
        />
      </div>
    </div>
  );
};

export default Gallery;
