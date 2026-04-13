import { Trans, useTranslation } from "react-i18next";
import StorySection from "../components/StorySection";
import ValuesGrid from "../components/ValuesGrid";
import TeamSection, { type TeamMember } from "../components/TeamSection";

const STORY_IMAGE_URL =
  "https://images.unsplash.com/photo-1466781783364-391eaf53cf39?auto=format&fit=crop&q=80&w=1000";

const About = () => {
  const { t } = useTranslation();

  const members: TeamMember[] = [
    {
      id: "domingo",
      name: "Domingo Canela",
      role: t("about.members.domingo"),
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "nora",
      name: "Nora Canela",
      role: t("about.members.nora"),
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="pt-28 lg:pt-40 pb-20 bg-slate-50/30 overflow-hidden">
      {/* Story */}
      <StorySection
        badge={t("about.story.badge")}
        title={
          <Trans i18nKey="about.story.title">
            Rooted in <br />
            Quality.
          </Trans>
        }
        content={t("about.story.content")}
        quote={t("about.story.quote")}
        imageUrl={STORY_IMAGE_URL}
      />

      {/* Mission / Values grid */}
      <ValuesGrid
        mission={{
          title: t("about.mission.title"),
          content: t("about.mission.content"),
        }}
        promise={{
          title: t("about.promise.title"),
          content: t("about.promise.content"),
        }}
        team={{
          title: t("about.team.card.title"),
          content: t("about.team.card.description"),
        }}
      />

      {/* Team */}
      <TeamSection
        badge={t("about.team.badge")}
        title={t("about.team.title")}
        description={t("about.team.description")}
        members={members}
      />
    </div>
  );
};

export default About;
