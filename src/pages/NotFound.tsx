import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-200 rounded-full blur-[100px] -ml-48 -mb-48 opacity-30" />

      <div className="max-w-2xl w-full text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="text-[12rem] md:text-[18rem] font-black text-emerald-900/5 leading-none absolute inset-0 flex items-center justify-center -z-10 select-none">
            404
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            <Trans i18nKey="notFound.title">
              Oops! This path is <br />
              <span className="text-emerald-600 italic">a bit overgrown.</span>
            </Trans>
          </h1>
          <p className="text-xl text-slate-500 max-w-md mx-auto leading-relaxed">
            {t("notFound.subtitle")}
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Link
            to="/"
            className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all hover:scale-105"
          >
            <Home size={20} />
            {t("notFound.backHome")}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-slate-600 font-bold hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={20} />
            {t("notFound.goBack")}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
