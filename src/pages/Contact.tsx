import { motion } from "framer-motion";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";
import SEO from "../components/SEO";
import {
  PHONE_NUMBER,
  EMAIL_ADDRESS,
  LOCATION_TEXT,
} from "../config/constants";
import { getSiteSettings } from "../supabase/queries";

const Contact = () => {
  const { t, i18n } = useTranslation();
  const [contactInfo, setContactInfo] = useState({
    phone: PHONE_NUMBER,
    email: EMAIL_ADDRESS,
    hours: { en: "Mon - Fri, 8am - 6pm", es: "Lun - Vie, 8am - 6pm" },
    reply: { en: "We reply within 24h", es: "Respondemos en menos de 24h" },
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const [phone, email, hours, hoursEs, reply, replyEs] = await Promise.all([
          getSiteSettings("business_phone"),
          getSiteSettings("business_email"),
          getSiteSettings("business_hours"),
          getSiteSettings("business_hours_es"),
          getSiteSettings("email_reply_time"),
          getSiteSettings("email_reply_time_es"),
        ]);

        setContactInfo({
          phone: phone || PHONE_NUMBER,
          email: email || EMAIL_ADDRESS,
          hours: {
            en: hours || "Mon - Fri, 8am - 6pm",
            es: hoursEs || "Lun - Vie, 8am - 6pm",
          },
          reply: {
            en: reply || "We reply within 24h",
            es: replyEs || "Respondemos en menos de 24h",
          },
        });
      } catch (err) {
        console.error("Error fetching contact info:", err);
      }
    };
    fetchContactInfo();
  }, []);

  const currentHours =
    i18n.language === "es" ? contactInfo.hours.es : contactInfo.hours.en;
  const currentReply =
    i18n.language === "es" ? contactInfo.reply.es : contactInfo.reply.en;

  return (
    <section className="pt-40 pb-32 bg-slate-50/50 px-6 md:px-12">
      <SEO
        title={t("seo.contact.title")}
        description={t("seo.contact.description")}
        canonical="/contact"
      />
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-4 block italic">
              {t("contact.badge")}
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tight">
              <Trans i18nKey="contact.title">
                Start Your <br />
                Transformation.
              </Trans>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed mb-12">
              {t("contact.subtitle")}
            </p>

            <div className="space-y-10">
              <div className="flex items-start space-x-6">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                  <Phone size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">
                    {t("contact.info.call.title")}
                  </h4>
                  <p className="text-slate-500 font-medium">{contactInfo.phone}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">
                    {currentHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                  <Mail size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">
                    {t("contact.info.email.title")}
                  </h4>
                  <p className="text-slate-500 font-medium">{contactInfo.email}</p>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">
                    {currentReply}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600">
                  <MapPin size={28} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-900 mb-1">
                    {t("contact.info.area.title")}
                  </h4>
                  <p className="text-slate-500 font-medium">{LOCATION_TEXT}</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl shadow-emerald-900/5 border border-slate-100"
          >
            <div className="flex items-center space-x-3 mb-10">
              <MessageSquare className="text-emerald-600" size={24} />
              <h3 className="text-2xl font-bold text-slate-900">
                {t("contact.form.title")}
              </h3>
            </div>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
