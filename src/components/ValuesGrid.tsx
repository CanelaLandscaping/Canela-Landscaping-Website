import { motion, type Variants } from "framer-motion";
import { Target, ShieldCheck, Users } from "lucide-react";

interface ValuesGridCard {
  title: string;
  content: string;
}

interface ValuesGridProps {
  mission: ValuesGridCard;
  promise: ValuesGridCard;
  team: ValuesGridCard;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Three-card values grid used on the About page.
 * Cards: Mission (dark), Promise (emerald), Team (white with link to #team).
 */
const ValuesGrid = ({ mission, promise, team }: ValuesGridProps) => (
  <section className="mb-40 px-6 md:px-12">
    <div className="container-custom">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Mission — dark */}
        <motion.div
          variants={itemVariants}
          className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-600/20 transition-all" />
          <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <Target className="text-emerald-400" size={32} />
          </div>
          <h3 className="text-3xl font-black text-white mb-6 tracking-tight">
            {mission.title}
          </h3>
          <p className="text-slate-400 leading-relaxed text-lg italic">
            {mission.content}
          </p>
        </motion.div>

        {/* Promise — emerald */}
        <motion.div
          variants={itemVariants}
          className="bg-emerald-600 p-12 rounded-[3rem] shadow-2xl shadow-emerald-600/20 relative overflow-hidden group hover:-translate-y-4 transition-all duration-500 md:-mt-8 md:mb-8"
        >
          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1),transparent)]" />
          <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:rotate-12 transition-transform duration-500">
            <ShieldCheck className="text-emerald-600" size={32} />
          </div>
          <h3 className="text-3xl font-black text-white mb-6 tracking-tight">
            {promise.title}
          </h3>
          <p className="text-emerald-50 leading-relaxed text-lg font-medium">
            {promise.content}
          </p>
        </motion.div>

        {/* Team — white with internal link */}
        <motion.div variants={itemVariants}>
          <a
            href="#team"
            className="h-full block bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mb-16" />
            <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500">
              <Users
                className="text-emerald-600 group-hover:text-white transition-colors duration-500"
                size={32}
              />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">
              {team.title}
            </h3>
            <p className="text-slate-500 leading-relaxed text-lg">{team.content}</p>
          </a>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default ValuesGrid;
