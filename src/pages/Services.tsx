import { useState } from "react";
import { motion } from "framer-motion";
import { Trans, useTranslation } from "react-i18next";
import { services } from "../data/services";
import ServiceCard from "../components/ServiceCard";
import PageHeader from "../components/PageHeader";
import SectionCTA from "../components/SectionCTA";

type ServiceCategory = "All" | "Lawn Care" | "Maintenance" | "Specialty" | "Seasonal";

const CATEGORIES: ServiceCategory[] = [
  "All",
  "Lawn Care",
  "Maintenance",
  "Specialty",
  "Seasonal",
];

const Services = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("All");

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category === activeCategory);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "All": return t("servicesPage.filters.all");
      case "Lawn Care": return t("servicesPage.filters.lawnCare");
      case "Maintenance": return t("servicesPage.filters.maintenance");
      case "Specialty": return t("servicesPage.filters.specialty");
      case "Seasonal": return t("servicesPage.filters.seasonal");
      default: return cat;
    }
  };

  return (
    <div className="pt-32 pb-32 bg-slate-50/50">
      <div className="container-custom">
        {/* Page header */}
        <PageHeader
          badge={t("servicesPage.badge")}
          title={
            <Trans i18nKey="servicesPage.title">
              Comprehensive <br />
              Landscape Solutions.
            </Trans>
          }
          subtitle={t("servicesPage.subtitle")}
        />

        {/* Category filter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12 md:mb-20"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-7 md:px-8 py-3 rounded-full text-xs md:text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 scale-105"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-emerald-600 hover:text-emerald-600"
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </motion.div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service, idx) => (
            <ServiceCard key={service.id} service={service} id={idx} />
          ))}
        </div>

        {/* Bottom CTA */}
        <SectionCTA
          variant="emerald"
          title={t("servicesPage.cta.title")}
          subtitle={t("servicesPage.cta.subtitle")}
          buttonText={t("servicesPage.cta.button")}
          buttonTo="/contact"
        />
      </div>
    </div>
  );
};

export default Services;
