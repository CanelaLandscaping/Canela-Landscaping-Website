import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export interface WhyUsPoint {
  id: string;
  title: string;
  desc: string;
}

interface WhyUsSectionProps {
  badge: string;
  title: string;
  statsCount: string;
  statsLabel: string;
  imageUrl: string;
  points: WhyUsPoint[];
}

/**
 * Two-column "Why Choose Us" section from the Home page.
 * Left: image with floating stat badge. Right: badge, title, and feature points.
 */
const WhyUsSection = ({
  badge,
  title,
  statsCount,
  statsLabel,
  imageUrl,
  points,
}: WhyUsSectionProps) => (
  <section className="py-32 bg-slate-50/50">
    <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      {/* Image col */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="relative group"
      >
        <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src={imageUrl}
            className="w-full h-full object-cover"
            alt="Our Work"
          />
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="absolute -bottom-10 -right-10 bg-emerald-600 text-white p-12 rounded-[2rem] hidden md:block shadow-2xl"
        >
          <span className="text-5xl font-black block mb-2">{statsCount}</span>
          <span className="text-sm font-bold opacity-80 uppercase tracking-widest">
            {statsLabel}
          </span>
        </motion.div>
      </motion.div>

      {/* Text col */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="space-y-10"
      >
        <div>
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block">
            {badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
            {title}
          </h2>
        </div>

        <div className="space-y-8">
          {points.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="flex gap-6 group"
            >
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl h-fit group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">
                  {item.title}
                </h4>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  </section>
);

export default WhyUsSection;
