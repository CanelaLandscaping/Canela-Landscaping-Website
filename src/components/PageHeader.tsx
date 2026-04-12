import { motion } from "framer-motion";

interface PageHeaderProps {
  badge: string;
  title: React.ReactNode;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

/**
 * Reusable page header used on Services, Gallery, Contact, and About pages.
 * Accepts a badge, title (ReactNode for Trans/JSX support), and optional subtitle.
 */
const PageHeader = ({
  badge,
  title,
  subtitle,
  centered = true,
  className = "",
}: PageHeaderProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className={`${centered ? "text-center max-w-3xl mx-auto" : ""} mb-20 ${className}`}
  >
    <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
      {badge}
    </span>
    <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight">
      {title}
    </h1>
    {subtitle && (
      <p className="text-xl text-slate-500 leading-relaxed">{subtitle}</p>
    )}
  </motion.div>
);

export default PageHeader;
