import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import SEO from "../components/SEO";
import ServiceCard from "../components/ServiceCard";
import HeroSection from "../components/HeroSection";
import TrustBadgesBar, { type TrustBadge } from "../components/TrustBadgesBar";
import WhyUsSection from "../components/WhyUsSection";
import TestimonialBlock from "../components/TestimonialBlock";
import SectionCTA from "../components/SectionCTA";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  getServices,
  getPageSections,
  type CMSService,
  type CMSSection,
  type HeroContent,
  type TrustBadgesContent,
  type WhyUsContent,
  type TestimonialContent,
  type CTAContent,
  type FeaturedServicesContent,
} from "../supabase/queries";
import type { Service } from "../data/services";

const Home = () => {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [featuredServices, setFeaturedServices] = useState<CMSService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [servData, sectionData] = await Promise.all([
          getServices(),
          getPageSections("home"),
        ]);
        setFeaturedServices(
          servData.filter((s) => s.is_featured && s.is_active),
        );
        setSections(sectionData.filter((s) => s.is_active));
      } catch (err) {
        console.error("Error fetching home content:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const renderSection = (section: CMSSection) => {
    const isEn = i18n.language.startsWith("en");
    const { content } = section;

    switch (section.type) {
      case "hero": {
        const heroContent = content as HeroContent;
        return (
          <HeroSection
            key={section.id}
            badge={isEn ? heroContent.badge_en : heroContent.badge_es}
            title={
              <span className="block">
                {isEn ? heroContent.title_en : heroContent.title_es}
              </span>
            }
            subtitle={isEn ? heroContent.subtitle_en : heroContent.subtitle_es}
            ctaText={isEn ? heroContent.cta_en : heroContent.cta_es}
            ctaTo={heroContent.cta_to || "/contact"}
            secondaryText={
              (isEn ? heroContent.secondary_en : heroContent.secondary_es) || 
              (isEn ? "Our Services" : "Nuestros Servicios")
            }
            secondaryTo={heroContent.secondary_to || "/services"}
            videoUrl={heroContent.video_url || "https://media.istockphoto.com/id/2188117475/video/wide-angle-view-of-hispanic-man-raking-soil-with-a-team-planting-a-flowerbed-in-a.mp4?s=mp4-640x640-is&k=20&c=UyEURF_PxaMKcZ7Mmnt_FAjc_UqMpztVP_zmIrbL58M="}
            posterUrl={heroContent.poster_url || "https://images.unsplash.com/photo-1592591544551-4903513f2f1b?auto=format&fit=crop&q=80&w=2000"}
          />
        );
      }

      case "trust-badges": {
        const trustContent = content as TrustBadgesContent;
        const badges: TrustBadge[] = (trustContent.badges || []).map((b) => ({
          text: isEn ? b.text_en : b.text_es,
          icon: (b.icon === "star" || b.icon === "check" ? b.icon : "check") as TrustBadge["icon"],
        }));
        return <TrustBadgesBar key={section.id} badges={badges} />;
      }

      case "featured-services": {
        const featuredContent = content as FeaturedServicesContent;
        return (
          <section
            key={section.id}
            className="py-32 bg-slate-100/50 px-6 md:px-12"
          >
            <div className="container-custom">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row md:items-end justify-between mb-20"
              >
                <div>
                  <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block text-center md:text-left">
                    {isEn ? featuredContent.badge_en : featuredContent.badge_es}
                  </span>
                  <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight text-center md:text-left max-w-[800px] mx-auto md:mx-0">
                    {isEn ? featuredContent.title_en : featuredContent.title_es}
                  </h2>
                </div>
                <Link
                  to="/services"
                  className="text-emerald-600 font-bold flex items-center justify-center md:justify-start gap-2 mt-8 md:mt-0 hover:gap-4 transition-all"
                >
                  {isEn ? featuredContent.viewAll_en : featuredContent.viewAll_es}{" "}
                  <ArrowRight size={20} />
                </Link>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredServices.length === 0 ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-400">
                    <p className="font-bold">No featured services available.</p>
                  </div>
                ) : (
                  featuredServices.map((service, idx) => {
                    const adaptedService: Service = {
                      id: service.id,
                      title: isEn ? service.title_en : service.title_es,
                      description: isEn
                        ? service.description_en
                        : service.description_es,
                      category: "Maintenance",
                      icon: service.icon,
                    };
                    return (
                      <ServiceCard
                        key={service.id}
                        service={adaptedService}
                        id={idx}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </section>
        );
      }

      case "why-us": {
        const whyUsContent = content as WhyUsContent;
        return (
          <WhyUsSection
            key={section.id}
            badge={isEn ? whyUsContent.badge_en : whyUsContent.badge_es}
            title={isEn ? whyUsContent.title_en : whyUsContent.title_es}
            statsCount={whyUsContent.stats_count}
            statsLabel={isEn ? whyUsContent.stats_label_en : whyUsContent.stats_label_es}
            imageUrl={whyUsContent.image_url}
            points={(whyUsContent.points || []).map((p) => ({
              id: p.title_en.toLowerCase().replace(/\s+/g, "-"),
              title: isEn ? p.title_en : p.title_es,
              desc: isEn ? p.desc_en : p.desc_es,
            }))}
          />
        );
      }

      case "testimonial": {
        const testimonialContent = content as TestimonialContent;
        return (
          <TestimonialBlock
            key={section.id}
            quote={isEn ? testimonialContent.quote_en : testimonialContent.quote_es}
            author={testimonialContent.author}
            location={isEn ? testimonialContent.location_en : testimonialContent.location_es}
          />
        );
      }

      case "cta": {
        const ctaContent = content as CTAContent;
        return (
          <SectionCTA
            key={section.id}
            variant={ctaContent.variant || "light"}
            title={isEn ? ctaContent.title_en : ctaContent.title_es}
            subtitle={isEn ? ctaContent.subtitle_en : ctaContent.subtitle_es}
            buttonText={isEn ? ctaContent.button_en : ctaContent.button_es}
            buttonTo={ctaContent.button_to || "/contact"}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden">
      <SEO 
        title={t("seo.home.title")} 
        description={t("seo.home.description")} 
        canonical="/" 
      />
      {loading ? (
        <div className="min-h-screen flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
          <p className="font-bold">Syncing experience...</p>
        </div>
      ) : (
        sections.map((section) => renderSection(section))
      )}
    </div>
  );
};

export default Home;
