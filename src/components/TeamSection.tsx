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
  <section id="team" className="py-40 bg-white px-6 md:px-12">
    <div className="container-custom">
      <div className="flex flex-col lg:flex-row gap-20">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="lg:w-1/3"
        >
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
            {badge}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-8 tracking-tight">
            {title}
          </h2>
          <p className="text-xl text-slate-600 leading-relaxed">
            {description}
          </p>
        </motion.div>

        <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {members.map((member, idx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group"
            >
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl relative">
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 mb-1">
                {member.name}
              </h4>
              <p className="text-emerald-600 font-medium uppercase tracking-wider text-sm">
                {member.role}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default TeamSection;
