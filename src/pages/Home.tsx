import { motion, type Variants } from "framer-motion";
import { ArrowRight, CheckCircle2, Star, Quote } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import ServiceCard from "../components/ServiceCard";
import { services } from "../data/services";
// import TemporaryManualExport from "../components/TemporaryManualExport";

const Home = () => {
  const { t } = useTranslation();
  const featuredServices = [
    services[0], // Professional Lawn Mowing
    services[5], // Mulch Installation
    services[14], // Snow Plowing
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="overflow-hidden">
      {/* <TemporaryManualExport /> */}
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="https://images.unsplash.com/photo-1592591544551-4903513f2f1b?auto=format&fit=crop&q=80&w=2000"
          >
            <source
              src="https://media.istockphoto.com/id/2188117475/video/wide-angle-view-of-hispanic-man-raking-soil-with-a-team-planting-a-flowerbed-in-a.mp4?s=mp4-640x640-is&k=20&c=UyEURF_PxaMKcZ7Mmnt_FAjc_UqMpztVP_zmIrbL58M="
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />
        </div>

        <div className="relative container-custom text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 font-bold text-xs uppercase tracking-widest mb-6"
          >
            {t("hero.badge")}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-8xl font-black mb-8 leading-tight tracking-tight"
          >
            <Trans i18nKey="hero.title">
              Expert Care for <br />
              <span className="text-brand-secondary italic">
                Your Outdoor Home.
              </span>
            </Trans>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/contact"
              className="bg-emerald-600 text-white px-10 py-5 rounded-full font-bold text-lg shadow-2xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-105"
            >
              {t("hero.cta")}
            </Link>
            <Link
              to="/services"
              className="px-10 py-5 rounded-full font-bold text-lg border border-white/30 hover:bg-white/10 backdrop-blur-md transition-all flex items-center gap-2"
            >
              {t("hero.services")} <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-emerald-500 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="bg-slate-50 py-12 border-b border-slate-100">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="container-custom flex flex-wrap justify-center md:justify-between items-center gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 font-bold text-slate-900 border-r border-slate-200 pr-8 last:border-0 last:pr-0"
          >
            <Star size={24} className="text-emerald-500 fill-emerald-500" />{" "}
            {t("trust.rated5")}
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 font-bold text-slate-900 border-r border-slate-200 pr-8 last:border-0 last:pr-0"
          >
            <CheckCircle2 size={24} className="text-emerald-500" />{" "}
            {t("trust.fullyInsured")}
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 font-bold text-slate-900 border-r border-slate-200 pr-8 last:border-0 last:pr-0"
          >
            <CheckCircle2 size={24} className="text-emerald-500" />{" "}
            {t("trust.yearsExp")}
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 font-bold text-slate-900"
          >
            <Star size={24} className="text-emerald-500 fill-emerald-500" />{" "}
            {t("trust.certified")}
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Services */}
      <section className="py-32 bg-slate-100/50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-20"
          >
            <div>
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block">
                {t("home.whatWeDo.badge")}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-950 tracking-tight leading-tight">
                <Trans i18nKey="home.whatWeDo.title">
                  Crafting Exceptional <br />
                  Outdoor Experiences.
                </Trans>
              </h2>
            </div>
            <Link
              to="/services"
              className="text-emerald-600 font-bold flex items-center gap-2 mt-8 md:mt-0 hover:gap-4 transition-all"
            >
              {t("home.whatWeDo.viewAll")} <ArrowRight size={20} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, idx) => (
              <ServiceCard key={service.id} service={service} id={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 bg-slate-50/50">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
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
                src="https://dennis7dees.com/wp-content/uploads/2021/08/modern-woodland-9.jpg"
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
              <span className="text-5xl font-black block mb-2">1k+</span>
              <span className="text-sm font-bold opacity-80 uppercase tracking-widest">
                {t("home.whyUs.stats")}
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            <div>
              <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block">
                {t("home.whyUs.badge")}
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-950 leading-tight">
                {t("home.whyUs.title")}
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  id: "quality",
                  title: t("home.whyUs.quality.title"),
                  desc: t("home.whyUs.quality.desc"),
                },
                {
                  id: "reliable",
                  title: t("home.whyUs.reliable.title"),
                  desc: t("home.whyUs.reliable.desc"),
                },
                {
                  id: "passionate",
                  title: t("home.whyUs.passionate.title"),
                  desc: t("home.whyUs.passionate.desc"),
                },
              ].map((item, idx) => (
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
                    <p className="text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
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
            "{t("home.testimonials.quote")}"
          </p>
          <div className="flex flex-col items-center">
            <span className="text-xl font-bold text-emerald-400">
              {t("home.testimonials.author")}
            </span>
            <span className="text-sm text-white/50 uppercase tracking-widest mt-2">
              {t("home.testimonials.location")}
            </span>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="py-40 bg-slate-50">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-4"
        >
          <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-8 tracking-tight">
            <Trans i18nKey="home.cta.title">
              Ready to start your <br />
              <span className="text-emerald-600 italic">
                next outdoor project?
              </span>
            </Trans>
          </h2>
          <p className="text-xl text-slate-500 mb-12">
            {t("home.cta.subtitle")}
          </p>
          <Link
            to="/contact"
            className="inline-block bg-emerald-600 text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all hover:scale-105"
          >
            {t("home.cta.button")}
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
