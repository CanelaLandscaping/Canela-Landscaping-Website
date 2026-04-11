import { useEffect } from "react";
import { motion } from "framer-motion";
import { services } from "../data/services";
import { Link, useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

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
      const navHeight = isMobile ? 240 : 120; // Account for sticky navbars
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
      case "Lawn Care": return t("servicesPage.filters.lawnCare");
      case "Maintenance": return t("servicesPage.filters.maintenance");
      case "Specialty": return t("servicesPage.filters.specialty");
      case "Seasonal": return t("servicesPage.filters.seasonal");
      default: return cat;
    }
  };

  return (
    <div className="pt-56 pb-32 bg-white/50">
      {/* Mobile/Tablet Fixed Navigation Bar */}
      <div className="lg:hidden fixed top-20 left-0 w-full bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
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
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-20 lg:mb-24">
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
            {t("gallery.badge")}
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight">
            {t("gallery.title")}
          </h1>
          <p className="text-xl text-slate-500 leading-relaxed font-medium">
            {t("gallery.subtitle")}
          </p>
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

        {/* Final Contact Section */}
        <div className="mt-40 text-center bg-slate-950 py-32 rounded-[4rem] text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=2000"
              className="w-full h-full object-cover"
              alt="BG"
              loading="lazy"
            />
          </div>
          <div className="relative">
            <h3 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
              <Trans i18nKey="gallery.cta.title">
                Ready for your <br />
                <span className="text-emerald-500 italic">
                  next transformation?
                </span>
              </Trans>
            </h3>
            <p className="text-xl text-white/50 mb-12 max-w-lg mx-auto">
              {t("gallery.cta.subtitle")}
            </p>
            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-emerald-600 text-white px-12 py-6 rounded-full font-bold text-lg shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all font-inter"
              >
                {t("gallery.cta.button")}
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
