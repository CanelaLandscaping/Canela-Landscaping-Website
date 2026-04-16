import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import SEO from "../components/SEO";
import StorySection from "../components/StorySection";
import ValuesGrid from "../components/ValuesGrid";
import TeamSection, { type TeamMember } from "../components/TeamSection";
import TestimonialBlock from "../components/TestimonialBlock";
import SectionCTA from "../components/SectionCTA";
import { 
  getPageSections, 
  type CMSSection, 
  type StoryContent, 
  type ValuesContent, 
  type TeamContent,
  type TestimonialContent,
  type CTAContent
} from "../supabase/queries";
import { Loader2 } from "lucide-react";

const About = () => {
  const { t, i18n } = useTranslation();
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const sectionData = await getPageSections("about");
        setSections(sectionData.filter((s) => s.is_active));
      } catch (err) {
        console.error("Error fetching about content:", err);
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
      case "story": {
        const storyContent = content as StoryContent;
        return (
          <StorySection
            key={section.id}
            badge={isEn ? storyContent.badge_en : storyContent.badge_es}
            title={
              <span className="block">
                {isEn ? storyContent.title_en : storyContent.title_es}
              </span>
            }
            content={isEn ? storyContent.content_en : storyContent.content_es}
            quote={isEn ? storyContent.quote_en : storyContent.quote_es}
            imageUrl={storyContent.image_url}
          />
        );
      }

      case "values": {
        const valuesContent = content as ValuesContent;
        return (
          <ValuesGrid
            key={section.id}
            mission={{
              title: isEn ? valuesContent.mission.title_en : valuesContent.mission.title_es,
              content: isEn ? valuesContent.mission.content_en : valuesContent.mission.content_es,
            }}
            promise={{
              title: isEn ? valuesContent.promise.title_en : valuesContent.promise.title_es,
              content: isEn ? valuesContent.promise.content_en : valuesContent.promise.content_es,
            }}
            team={{
              title: isEn ? valuesContent.team.title_en : valuesContent.team.title_es,
              content: isEn ? valuesContent.team.content_en : valuesContent.team.content_es,
            }}
          />
        );
      }

      case "team": {
        const teamContent = content as TeamContent;
        const members: TeamMember[] = (teamContent.members || []).map((m, idx: number) => ({
          id: `member-${idx}`,
          name: m.name,
          role: isEn ? m.role_en : m.role_es,
          img: m.img,
        }));
        return (
          <TeamSection
            key={section.id}
            badge={isEn ? teamContent.badge_en : teamContent.badge_es}
            title={isEn ? teamContent.title_en : teamContent.title_es}
            description={isEn ? teamContent.description_en : teamContent.description_es}
            members={members}
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
    <div className="pt-28 lg:pt-40 pb-20 bg-slate-50/30 overflow-hidden">
      <SEO 
        title={t("seo.about.title")} 
        description={t("seo.about.description")} 
        canonical="/about" 
      />
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
          <p className="font-bold">Honoring our history...</p>
        </div>
      ) : (
        sections.map((section) => renderSection(section))
      )}
    </div>
  );
};

export default About;
