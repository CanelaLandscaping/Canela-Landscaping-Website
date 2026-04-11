import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { submitContactForm } from '../supabase/queries';

const ContactForm = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Lawn Maintenance',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await submitContactForm(formData);
      setSubmitted(true);
      
      // Reset form after a few seconds
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', email: '', service: 'Lawn Maintenance', message: '' });
      }, 5000);

    } catch (err: unknown) {
      console.error("Submission error:", err);
      const errorMessage = err instanceof Error ? err.message : t("contact.form.error", { defaultValue: "Something went wrong. Please try again or call us." });
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[500px]"
      >
        <CheckCircle size={64} className="text-emerald-600 mb-6" />
        <h3 className="text-3xl font-bold text-slate-900 mb-4">{t("contact.form.success")}</h3>
        <p className="text-slate-600 max-w-sm">
          {t("contact.info.email.reply")}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-start gap-3 text-sm font-medium border border-red-100"
        >
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p>{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t("contact.form.labels.name")}</label>
          <input 
            required
            type="text" 
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder={t("contact.form.placeholders.name")}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">{t("contact.form.labels.email")}</label>
          <input 
            required
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t("contact.form.placeholders.email")}
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{t("contact.form.labels.service")}</label>
        <select 
          name="service"
          value={formData.service}
          onChange={handleChange}
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
        >
          <option value="Lawn Maintenance">{t("services.lawn-maintenance.title")}</option>
          <option value="Garden Cleanup">{t("services.yard-cleanup.title")}</option>
          <option value="Patio Repair">{t("services.patios.title")}</option>
          <option value="Snow Removal">{t("services.snow-plow.title")}</option>
          <option value="Other / Multiple">{t("contact.form.placeholders.service")}</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2">{t("contact.form.labels.message")}</label>
        <textarea 
          required
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder={t("contact.form.placeholders.message")}
          className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        ></textarea>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-emerald-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-emerald-700 disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center space-x-3 transition-colors"
      >
        <span>{isSubmitting ? t("contact.form.sending") : t("contact.form.button")}</span>
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
      </motion.button>
    </form>
  );
};

export default ContactForm;

