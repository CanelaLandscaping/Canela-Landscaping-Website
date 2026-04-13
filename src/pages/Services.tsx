import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  getCategories,
  getServices,
  getSiteSettings,
  type CMSCategory,
  type CMSService,
} from "../supabase/queries";
import { type Service } from "../data/services";
import ServiceCard from "../components/ServiceCard";
import PageHeader from "../components/PageHeader";
import SectionCTA from "../components/SectionCTA";
import { Loader2 } from "lucide-react";

interface PageHeaderContent {
  badge_en: string;
  badge_es: string;
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
}

const Services = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [loading, setLoading] = useState(true);
  const [headerContent, setHeaderContent] = useState<PageHeaderContent | null>(
    null,
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [catData, servData, headerData] = await Promise.all([
          getCategories(),
          getServices(),
          getSiteSettings("page_header_services"),
        ]);
        setCategories(catData);
        setServices(servData.filter((s) => s.is_active));
        if (headerData) setHeaderContent(headerData);
      } catch (err) {
        console.error("Error fetching services data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getCategoryName = (cat: CMSCategory) => {
    return i18n.language.startsWith("es") ? cat.name_es : cat.name_en;
  };

  const getSortedServices = (
    servs: CMSService[],
    categoryId: string | "All",
  ) => {
    const filtered =
      categoryId === "All"
        ? servs
        : servs.filter((s) => s.category_id === categoryId);

    if (categoryId === "All") {
      return filtered.sort((a, b) => a.display_order - b.display_order);
    }

    const category = categories.find((c) => c.id === categoryId);
    if (category?.sort_type === "alphabetical") {
      return [...filtered].sort((a, b) => {
        const titleA = i18n.language.startsWith("es") ? a.title_es : a.title_en;
        const titleB = i18n.language.startsWith("es") ? b.title_es : b.title_en;
        return titleA.localeCompare(titleB);
      });
    }

    return [...filtered].sort((a, b) => a.display_order - b.display_order);
  };
  const displayedServices = getSortedServices(services, activeCategory);

  return (
    <section className="pt-40 pb-32 bg-slate-50/50 px-6 md:px-12 min-h-screen">
      <div className="container-custom">
        {/* Page header */}
        <PageHeader
          badge={
            i18n.language.startsWith("es")
              ? headerContent?.badge_es || t("servicesPage.badge")
              : headerContent?.badge_en || t("servicesPage.badge")
          }
          title={
            i18n.language.startsWith("es")
              ? headerContent?.title_es || t("servicesPage.title")
              : headerContent?.title_en || t("servicesPage.title")
          }
          subtitle={
            i18n.language.startsWith("es")
              ? headerContent?.subtitle_es || t("servicesPage.subtitle")
              : headerContent?.subtitle_en || t("servicesPage.subtitle")
          }
        />

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
            <p className="font-bold">Loading services...</p>
          </div>
        ) : (
          <>
            {/* Category filter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 1 }}
              className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-20"
            >
              <button
                onClick={() => setActiveCategory("All")}
                className={`px-7 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold transition-all ${
                  activeCategory === "All"
                    ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-105"
                    : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600"
                }`}
              >
                {t("servicesPage.filters.all")}
              </button>
              {categories
                .sort((a, b) => a.display_order - b.display_order)
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-7 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold transition-all ${
                      activeCategory === cat.id
                        ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-105"
                        : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600"
                    }`}
                  >
                    {getCategoryName(cat)}
                  </button>
                ))}
            </motion.div>

            {/* Services grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedServices.map((service, idx) => {
                // Adapt CMSService to Service interface for ServiceCard
                const adaptedService: Service = {
                  id: service.id,
                  title: i18n.language.startsWith("es")
                    ? service.title_es
                    : service.title_en,
                  description: i18n.language.startsWith("es")
                    ? service.description_es
                    : service.description_en,
                  category: (categories.find((c) => c.id === service.category_id)
                    ?.name_en || "Lawn Care") as Service["category"],
                  icon: service.icon,
                };
                return (
                  <ServiceCard
                    key={service.id}
                    service={adaptedService}
                    id={idx}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Bottom CTA */}
        <SectionCTA
          variant="emerald"
          title={t("servicesPage.cta.title")}
          subtitle={t("servicesPage.cta.subtitle")}
          buttonText={t("servicesPage.cta.button")}
          buttonTo="/contact"
        />
      </div>
    </section>
  );
};

export default Services;
