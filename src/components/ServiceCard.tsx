import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { Service } from '../data/services';

interface ServiceCardProps {
  service: Service;
  id: number;
}

const ServiceCard = ({ service, id }: ServiceCardProps) => {
  const { t } = useTranslation();
  // @ts-expect-error - Dynamic icon lookup
  const Icon = LucideIcons[service.icon] || LucideIcons.Leaf;

  const categoryKey = service.category === 'Lawn Care' ? 'lawnCare' : service.category.toLowerCase();

  return (
    <Link to={`/gallery#${service.id}`} className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ 
          duration: 0.8, 
          delay: (id % 3) * 0.1,
          ease: [0.21, 0.47, 0.32, 0.98] 
        }}
        className="group bg-white rounded-[2.5rem] p-10 shadow-sm border border-slate-100 hover:shadow-2xl hover:-translate-y-2 hover:rotate-[0.5deg] transition-all duration-500 ease-out h-full relative overflow-hidden"
      >
        {/* Background Accent */}
        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
          <Icon size={120} strokeWidth={1} />
        </div>

        <div className="flex flex-col h-full relative z-10">
          <div className="bg-emerald-50 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ease-out shadow-inner">
            <Icon size={36} className="text-emerald-600 group-hover:text-white transition-all duration-500" />
          </div>
          <span className="text-sm font-extrabold text-emerald-600 uppercase tracking-[0.2em] mb-3 block">
            {t(`services.categories.${categoryKey}`)}
          </span>
          <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
            {t(`services.${service.id}.title`)}
          </h3>
          <p className="text-slate-500 text-base leading-relaxed mb-8 flex-grow">
            {t(`services.${service.id}.description`)}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-emerald-600 font-bold group/link">
              <span className="group-hover:underline underline-offset-4">{t("home.whatWeDo.viewProof", { defaultValue: "View Proof" })}</span>
              <LucideIcons.ArrowRight size={18} className="group-hover/link:translate-x-2 transition-transform duration-300" />
            </div>
            <div className="w-10 h-1 bg-emerald-100 rounded-full group-hover:w-16 group-hover:bg-emerald-500 transition-all duration-500" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ServiceCard;
