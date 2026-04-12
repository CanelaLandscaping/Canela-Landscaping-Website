import { motion } from "framer-motion";
import { Link } from "react-router-dom";

type SectionCTAVariant = "light" | "emerald" | "dark";

interface SectionCTAProps {
  title: React.ReactNode;
  subtitle: string;
  buttonText: string;
  buttonTo: string;
  /** Display variant: 'light' (Home), 'emerald' (Services), 'dark' (Gallery) */
  variant?: SectionCTAVariant;
  /** Background image URL — only used when variant is 'dark' */
  bgImage?: string;
}

/**
 * Versatile CTA block used at the bottom of Home, Services, and Gallery pages.
 * Three visual variants controlled by the `variant` prop.
 */
const SectionCTA = ({
  title,
  subtitle,
  buttonText,
  buttonTo,
  variant = "light",
  bgImage,
}: SectionCTAProps) => {
  if (variant === "light") {
    return (
      <section className="py-40 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-slate-500 mb-12">{subtitle}</p>
          <Link
            to={buttonTo}
            className="inline-block bg-emerald-600 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all hover:scale-105"
          >
            {buttonText}
          </Link>
        </motion.div>
      </section>
    );
  }

  if (variant === "emerald") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-32 p-12 md:p-20 rounded-[3rem] bg-emerald-50 border border-emerald-100 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-[100px] -mr-32 -mt-32" />
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-8 relative">
          {title}
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12 relative">
          {subtitle}
        </p>
        <Link to={buttonTo}>
          <button className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold relative hover:bg-slate-800 transition-all hover:scale-105 shadow-xl">
            {buttonText}
          </button>
        </Link>
      </motion.div>
    );
  }

  // dark variant (Gallery)
  return (
    <div className="mt-40 text-center bg-slate-950 py-32 rounded-[4rem] text-white relative overflow-hidden">
      {bgImage && (
        <div className="absolute inset-0 opacity-10">
          <img
            src={bgImage}
            className="w-full h-full object-cover"
            alt=""
            loading="lazy"
          />
        </div>
      )}
      <div className="relative">
        <h3 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
          {title}
        </h3>
        <p className="text-xl text-white/50 mb-12 max-w-lg mx-auto">
          {subtitle}
        </p>
        <Link to={buttonTo}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-emerald-600 text-white px-12 py-6 rounded-full font-bold text-lg shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all font-inter"
          >
            {buttonText}
          </motion.button>
        </Link>
      </div>
    </div>
  );
};

export default SectionCTA;
