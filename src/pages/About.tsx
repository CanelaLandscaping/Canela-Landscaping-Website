import { motion, type Variants } from "framer-motion";
import { Users, ShieldCheck, Target, Award } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const About = () => {
  const { t } = useTranslation();
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };

  return (
    <div className="pt-32 pb-32 bg-slate-50/30 overflow-hidden">
      <div className="container-custom">
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
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
                src="https://images.unsplash.com/photo-1466781783364-391eaf53cf39?auto=format&fit=crop&q=80&w=1000"
                className="w-full h-full object-cover"
                alt="Our Passion"
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

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
              {t("about.story.badge")}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight">
              <Trans i18nKey="about.story.title">
                Rooted in <br />
                Quality.
              </Trans>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {t("about.story.content")}
            </p>
            <p className="text-lg text-slate-500 leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
              {t("about.story.quote")}
            </p>
          </motion.div>
        </div>

        {/* Mission/Values Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-40"
        >
          {/* Mission - Dark Slate */}
          <motion.div variants={itemVariants} className="bg-slate-900 p-12 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/10 rounded-full -mr-16 -mt-16 group-hover:bg-emerald-600/20 transition-all" />
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
              <Target className="text-emerald-400" size={32} />
            </div>
            <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{t("about.mission.title")}</h3>
            <p className="text-slate-400 leading-relaxed text-lg italic">
              {t("about.mission.content")}
            </p>
          </motion.div>

          {/* Promise - Emerald Highlight */}
          <motion.div variants={itemVariants} className="bg-emerald-600 p-12 rounded-[3rem] shadow-2xl shadow-emerald-600/20 relative overflow-hidden group hover:-translate-y-4 transition-all duration-500 md:-mt-8 md:mb-8">
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0.1),transparent)]" />
            <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-inner group-hover:rotate-12 transition-transform duration-500">
              <ShieldCheck className="text-emerald-600" size={32} />
            </div>
            <h3 className="text-3xl font-black text-white mb-6 tracking-tight">{t("about.promise.title")}</h3>
            <p className="text-emerald-50 leading-relaxed text-lg font-medium">
              {t("about.promise.content")}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <a href="#team" className="h-full block bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mb-16" />
              <div className="bg-emerald-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-emerald-600 transition-all duration-500">
                <Users className="text-emerald-600 group-hover:text-white transition-colors duration-500" size={32} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">{t("about.team.card.title")}</h3>
              <p className="text-slate-500 leading-relaxed text-lg">
                {t("about.team.card.description")}
              </p>
            </a>
          </motion.div>
        </motion.div>

        {/* Team Section */}
        <div id="team" className="scroll-mt-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block underline decoration-emerald-200 underline-offset-8">
              {t("about.team.badge")}
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 tracking-tight">
              {t("about.team.title")}
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t("about.team.description")}
            </p>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto"
          >
            {[
              {
                id: "domingo",
                name: "Domingo Canela",
                role: t("about.members.domingo"),
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
              },
              {
                id: "nora",
                name: "Nora Canela",
                role: t("about.members.nora"),
                img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
              },
            ].map((member) => (
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
      </div>
    </div>
  );
};

export default About;
