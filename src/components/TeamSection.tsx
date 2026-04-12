import { motion, type Variants } from "framer-motion";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  img: string;
}

interface TeamSectionProps {
  badge: string;
  title: string;
  description: string;
  members: TeamMember[];
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
 * Team members grid section used on the About page.
 * Accepts the section header copy and an array of member objects.
 */
const TeamSection = ({ badge, title, description, members }: TeamSectionProps) => (
  <div id="team" className="scroll-mt-32">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="text-center max-w-3xl mx-auto mb-20"
    >
      <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
        {badge}
      </span>
      <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 tracking-tight">
        {title}
      </h2>
      <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </motion.div>

    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
    >
      {members.map((member) => (
        <motion.div
          key={member.id}
          variants={itemVariants}
          className="relative group"
        >
          <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-lg">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={member.img}
              className="w-full h-full object-cover"
              alt={member.name}
            />
          </div>
          <h4 className="text-2xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
            {member.name}
          </h4>
          <p className="text-emerald-600 text-sm font-bold uppercase tracking-widest">
            {member.role}
          </p>
        </motion.div>
      ))}
    </motion.div>
  </div>
);

export default TeamSection;
