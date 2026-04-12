import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ServiceCard from "../components/ServiceCard";
import HeroSection from "../components/HeroSection";
import TrustBadgesBar, { type TrustBadge } from "../components/TrustBadgesBar";
import WhyUsSection from "../components/WhyUsSection";
import TestimonialBlock from "../components/TestimonialBlock";
import SectionCTA from "../components/SectionCTA";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { services } from "../data/services";

const HERO_VIDEO_URL =
  "https://media.istockphoto.com/id/2188117475/video/wide-angle-view-of-hispanic-man-raking-soil-with-a-team-planting-a-flowerbed-in-a.mp4?s=mp4-640x640-is&k=20&c=UyEURF_PxaMKcZ7Mmnt_FAjc_UqMpztVP_zmIrbL58M=";
const HERO_POSTER_URL =
  "https://images.unsplash.com/photo-1592591544551-4903513f2f1b?auto=format&fit=crop&q=80&w=2000";
const WHY_US_IMAGE_URL =
  "https://dennis7dees.com/wp-content/uploads/2021/08/modern-woodland-9.jpg";

const Home = () => {
  const { t } = useTranslation();

  const featuredServices = [
    services[0],  // Professional Lawn Mowing
    services[5],  // Mulch Installation
    services[14], // Snow Plowing
  ];

  const trustBadges: TrustBadge[] = [
    { text: t("trust.rated5"), icon: "star" },
    { text: t("trust.fullyInsured"), icon: "check" },
    { text: t("trust.yearsExp"), icon: "check" },
    { text: t("trust.certified"), icon: "star" },
  ];

  const whyUsPoints = [
    { id: "quality", title: t("home.whyUs.quality.title"), desc: t("home.whyUs.quality.desc") },
    { id: "reliable", title: t("home.whyUs.reliable.title"), desc: t("home.whyUs.reliable.desc") },
    { id: "passionate", title: t("home.whyUs.passionate.title"), desc: t("home.whyUs.passionate.desc") },
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <HeroSection
        badge={t("hero.badge")}
        title={
          <Trans i18nKey="hero.title">
            Expert Care for <br />
            <span className="text-brand-secondary italic">Your Outdoor Home.</span>
          </Trans>
        }
        subtitle={t("hero.subtitle")}
        ctaText={t("hero.cta")}
        ctaTo="/contact"
        secondaryText={t("hero.services")}
        secondaryTo="/services"
        videoUrl={HERO_VIDEO_URL}
        posterUrl={HERO_POSTER_URL}
      />

      {/* Trust Badges */}
      <TrustBadgesBar badges={trustBadges} />

      {/* Featured Services */}
      <section className="py-32 bg-slate-100/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20"
          >
            <div>
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block">
                {t("home.whatWeDo.badge")}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight">
                <Trans i18nKey="home.whatWeDo.title">
                  Crafting Exceptional <br />
                  Outdoor Experiences.
                </Trans>
              </h2>
            </div>
            <Link
              to="/services"
              className="text-emerald-600 font-bold flex items-center gap-2 mt-8 md:mt-0 hover:gap-4 transition-all"
            >
              {t("home.whatWeDo.viewAll")} <ArrowRight size={20} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <ServiceCard key={service.id} service={service} id={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <WhyUsSection
        badge={t("home.whyUs.badge")}
        title={t("home.whyUs.title")}
        statsCount="1k+"
        statsLabel={t("home.whyUs.stats")}
        imageUrl={WHY_US_IMAGE_URL}
        points={whyUsPoints}
      />

      {/* Testimonial */}
      <TestimonialBlock
        quote={t("home.testimonials.quote")}
        author={t("home.testimonials.author")}
        location={t("home.testimonials.location")}
      />

      {/* Bottom CTA */}
      <SectionCTA
        variant="light"
        title={
          <Trans i18nKey="home.cta.title">
            Ready to start your <br />
            <span className="text-emerald-600 italic">next outdoor project?</span>
          </Trans>
        }
        subtitle={t("home.cta.subtitle")}
        buttonText={t("home.cta.button")}
        buttonTo="/contact"
      />
    </div>
  );
};

export default Home;
