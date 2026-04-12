import { motion } from "framer-motion";
import { Award } from "lucide-react";

interface StorySectionProps {
  badge: string;
  /** ReactNode — supports Trans components for styled line breaks */
  title: React.ReactNode;
  content: string;
  quote: string;
  imageUrl: string;
}

/**
 * Two-column story section used on the About page.
 * Left: photo with floating award badge. Right: badge, title, body, pull-quote.
 */
const StorySection = ({
  badge,
  title,
  content,
  quote,
  imageUrl,
}: StorySectionProps) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
    {/* Image col */}
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative"
    >
      <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          src={imageUrl}
          className="w-full h-full object-cover"
          alt="Our Story"
        />
      </div>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 xl:-top-10 xl:-left-10 bg-emerald-600 p-6 lg:p-8 rounded-2xl lg:rounded-[2rem] text-white shadow-xl"
      >
        <Award className="w-8 h-8 lg:w-12 lg:h-12" />
      </motion.div>
    </motion.div>

    {/* Text col */}
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
    >
      <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
        {badge}
      </span>
      <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight">
        {title}
      </h1>
      <p className="text-xl text-slate-600 leading-relaxed mb-8">{content}</p>
      <p className="text-lg text-slate-500 leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
        {quote}
      </p>
    </motion.div>
  </div>
);

export default StorySection;
