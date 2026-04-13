import { useState, useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PHONE_NUMBER,
  EMAIL_ADDRESS,
  LOCATION_TEXT,
} from "../config/constants";
import {
  getSiteSettings,
  getServices,
  type CMSService,
} from "../supabase/queries";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const [footerServices, setFooterServices] = useState<CMSService[]>([]);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [selection, allServices] = await Promise.all([
          getSiteSettings("footer_services"),
          getServices(),
        ]);

        const selectedIds: string[] = Array.isArray(selection)
          ? selection
          : selection
            ? JSON.parse(selection)
            : [];

        // If we have a selection, map them in order
        if (selectedIds && selectedIds.length > 0) {
          const orderedServices = selectedIds
            .map((id) => allServices.find((s) => s.id === id))
            .filter(Boolean) as CMSService[];

          if (orderedServices.length > 0) {
            setFooterServices(orderedServices);
            return;
          }
        }

        // Fallback: take the first 10 active services
        setFooterServices(allServices.filter((s) => s.is_active).slice(0, 10));
      } catch (err) {
        console.error("Error fetching footer services:", err);
      }
    };
    fetchFooterData();
  }, []);

  const col1 = footerServices.slice(0, 5);
  const col2 = footerServices.slice(5, 10);

  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-12 px-6 md:px-12">
      <div className="container-custom">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-12 gap-x-8 lg:gap-x-8">
          {/* Logo Section - Order 1 on mobile & desktop */}
          <div className="order-1 col-span-2 md:col-span-1 lg:col-span-2 space-y-3">
            <img
              src="/logo-icon.png"
              alt="Canela Landscaping & Snow Plow"
              className="h-28 w-auto object-contain"
            />
            <p className="text-sm leading-relaxed md:max-w-xs">
              {t("footer.description")}
            </p>
            <div className="flex space-x-4 text-emerald-500">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links - Order 3 on mobile, Order 2 on md+ */}
          <div className="order-3 md:order-2 col-span-1 md:col-span-1 lg:col-span-1">
            <h4 className="text-white font-bold mb-6">
              {t("footer.quickLinks")}
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/services"
                  className="hover:text-emerald-500 transition-colors"
                >
                  {t("footer.links.ourServices")}
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-emerald-500 transition-colors"
                >
                  {t("footer.links.projectGallery")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-emerald-500 transition-colors"
                >
                  {t("footer.links.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-emerald-500 transition-colors"
                >
                  {t("footer.links.freeQuote")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services Container - Order 2 on mobile, Order 3 on md+ */}
          <div className="order-2 md:order-3 col-span-2 md:col-span-1 lg:col-span-2 grid grid-cols-2 lg:grid-cols-2 gap-x-8 gap-y-12 lg:gap-y-0">
            {/* Service Column 1 */}
            <div>
              <h4 className="text-white font-bold mb-6">
                {t("footer.serviceLinks.title")}
              </h4>
              <ul className="space-y-4 text-sm">
                {col1.map((service) => (
                  <li key={service.id}>
                    <Link
                      to="/services"
                      className="hover:text-emerald-500 transition-colors"
                    >
                      {i18n.language === "es"
                        ? service.title_es
                        : service.title_en}
                    </Link>
                  </li>
                ))}
                {col1.length === 0 && (
                  <li className="animate-pulse text-slate-700">...</li>
                )}
              </ul>
            </div>

            {/* Service Column 2 */}
            <div>
              <h4 className="text-white font-bold mb-6 lg:opacity-0 lg:select-none">
                <span className="lg:hidden opacity-0">_</span>
              </h4>
              <ul className="space-y-4 text-sm">
                {col2.map((service) => (
                  <li key={service.id}>
                    <Link
                      to="/services"
                      className="hover:text-emerald-500 transition-colors"
                    >
                      {i18n.language === "es"
                        ? service.title_es
                        : service.title_en}
                    </Link>
                  </li>
                ))}
                {col2.length === 0 && footerServices.length > 0 && (
                  <li className="animate-pulse text-slate-700">...</li>
                )}
              </ul>
            </div>
          </div>

          {/* Contact Info - Order 4 on mobile & md+ */}
          <div className="order-4 col-span-1 md:col-span-3 lg:col-span-1">
            <h4 className="text-white font-bold mb-6">
              {t("footer.contactInfo")}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span>{PHONE_NUMBER}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="break-all">{EMAIL_ADDRESS}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin
                  size={18}
                  className="text-emerald-500 shrink-0 mt-0.5"
                />
                <span>{LOCATION_TEXT}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-900 text-center text-xs">
          <p>
            &copy; {new Date().getFullYear()} Canela Landscaping & Snow Plow.{" "}
            {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
