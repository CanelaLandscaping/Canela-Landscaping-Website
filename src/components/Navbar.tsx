import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Globe } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GALLERY_IMAGES, prefetchImages } from "../data/gallery-assets";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: t("nav.about"), path: "/about" },
    { name: t("nav.services"), path: "/services" },
    { name: t("nav.gallery"), path: "/gallery" },
    { name: t("nav.contact"), path: "/contact" },
  ];

  const handlePrefetch = (path: string) => {
    if (path === "/gallery") {
      prefetchImages(GALLERY_IMAGES);
    }
  };

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("es") ? "en" : "es";
    i18n.changeLanguage(newLang);
  };

  const isHome = location.pathname === "/";
  const showAlt = scrolled || !isHome || isOpen;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${showAlt ? "bg-white shadow-md md:pb-2 pt-2" : "bg-transparent py-4"}`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-4 group">
            <img
              src="/logo-icon.png"
              alt="Canela Landscaping & Snow Plow"
              className="h-16 md:h-18 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span
              className={`text-lg lg:text-2xl font-black leading-tight tracking-tighter max-w-[170px] lg:max-w-none ${showAlt ? "text-slate-900" : "text-white"}`}
            >
              Canela Landscaping & Snow Plow
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onMouseEnter={() => handlePrefetch(link.path)}
                className={`text-sm font-semibold transition-colors duration-200 ${
                  location.pathname === link.path
                    ? "text-emerald-500"
                    : showAlt
                      ? "text-slate-600 hover:text-emerald-600"
                      : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full border transition-all ${
                showAlt
                  ? "border-slate-200 text-slate-600 hover:bg-slate-50"
                  : "border-white/20 text-white/80 hover:bg-white/10"
              }`}
            >
              <Globe size={14} />
              {i18n.language.startsWith("es") ? "EN" : "ES"}
            </button>

            <Link
              to="/contact"
              className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-emerald-700 transition-all font-inter"
            >
              {t("nav.getQuote")}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={toggleLanguage}
              className={`text-sm font-bold uppercase ${showAlt ? "text-slate-600" : "text-white/80"}`}
            >
              {i18n.language.startsWith("es") ? "EN" : "ES"}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={showAlt ? "text-slate-900" : "text-white"}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-b border-slate-100 shadow-xl"
        >
          <div className="px-2 pt-2 pb-3 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                onMouseEnter={() => handlePrefetch(link.path)}
                className="text-right block px-3 py-2 text-base font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-md"
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="text-right block px-3 py-2 text-base font-bold text-emerald-600"
            >
              {t("nav.getQuote")}
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
