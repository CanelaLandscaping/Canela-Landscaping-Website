import { motion, type Variants } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";

type BadgeIcon = "star" | "check";

export interface TrustBadge {
  text: string;
  icon: BadgeIcon;
}

interface TrustBadgesBarProps {
  badges: TrustBadge[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Horizontal strip of trust/credibility badges.
 * Used in the Home page below the hero section.
 */
const TrustBadgesBar = ({ badges }: TrustBadgesBarProps) => (
  <section className="bg-slate-50 py-12 border-b border-slate-100">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="container-custom flex flex-wrap justify-center md:justify-between items-center gap-8"
    >
      {badges.map((badge, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="flex items-center gap-2 font-bold text-slate-900 border-r border-slate-200 pr-8 last:border-0 last:pr-0"
        >
          {badge.icon === "star" ? (
            <Star size={24} className="text-emerald-500 fill-emerald-500" />
          ) : (
            <CheckCircle2 size={24} className="text-emerald-500" />
          )}
          {badge.text}
        </motion.div>
      ))}
    </motion.div>
  </section>
);

export default TrustBadgesBar;
