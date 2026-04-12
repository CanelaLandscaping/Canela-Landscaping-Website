import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialBlockProps {
  quote: string;
  author: string;
  location: string;
}

/**
 * Full-width dark testimonial block used on the Home page.
 */
const TestimonialBlock = ({ quote, author, location }: TestimonialBlockProps) => (
  <section className="py-32 bg-slate-950 text-white relative overflow-hidden">
    <div className="absolute top-0 right-0 opacity-10 pointer-events-none text-emerald-900">
      <Quote size={400} />
    </div>
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="max-w-4xl mx-auto px-4 text-center relative"
    >
      <Quote className="text-emerald-500 mb-8 mx-auto" size={48} />
      <p className="text-3xl md:text-4xl font-black italic leading-snug mb-12">
        "{quote}"
      </p>
      <div className="flex flex-col items-center">
        <span className="text-xl font-bold text-emerald-400">{author}</span>
        <span className="text-sm text-white/50 uppercase tracking-widest mt-2">
          {location}
        </span>
      </div>
    </motion.div>
  </section>
);

export default TestimonialBlock;
