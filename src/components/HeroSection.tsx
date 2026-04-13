import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroSectionProps {
  badge: string;
  /** ReactNode — supports Trans components for styled line breaks */
  title: React.ReactNode;
  subtitle: string;
  ctaText: string;
  ctaTo: string;
  secondaryText: string;
  secondaryTo: string;
  videoUrl: string;
  posterUrl: string;
}

/**
 * Full-screen video hero section used on the Home page.
 * All text content is passed as props for future CMS editability.
 */
const HeroSection = ({
  badge,
  title,
  subtitle,
  ctaText,
  ctaTo,
  secondaryText,
  secondaryTo,
  videoUrl,
  posterUrl,
}: HeroSectionProps) => (
  <section className="relative h-screen flex items-center justify-center text-white px-6 md:px-12">
    {/* Background video */}
    <div className="absolute inset-0 overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        poster={posterUrl}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />
    </div>

    {/* Content */}
    <div className="relative container-custom text-center">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6"
      >
        {badge}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
      >
        {subtitle}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-6"
      >
        <Link
          to={ctaTo}
          className="bg-emerald-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-105"
        >
          {ctaText}
        </Link>
        <Link
          to={secondaryTo}
          className="px-10 py-5 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2"
        >
          {secondaryText} <ArrowRight size={20} />
        </Link>
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 2 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
    >
      <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
        <div className="w-1 h-2 bg-emerald-500 rounded-full" />
      </div>
    </motion.div>
  </section>
);

export default HeroSection;
