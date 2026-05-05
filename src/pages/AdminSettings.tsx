import { useState, useEffect } from "react";
import {
  getSiteSettings,
  updateSiteSetting,
  getServices,
  type CMSService,
} from "../supabase/queries";
import { useTranslation } from "react-i18next";
import {
  LogOut,
  Settings,
  Save,
  Loader2,
  ArrowUp,
  ArrowDown,
  SortAsc,
  Trash2,
  PlusCircle,
  ExternalLink,
  PlayCircle,
  X,
  Phone,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

const AdminSettings = () => {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const [leadsLimit, setLeadsLimit] = useState(10);
  const [autoMarkRead, setAutoMarkRead] = useState(true);
  const [footerServices, setFooterServices] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<CMSService[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [facebookUrl, setFacebookUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [showSocial, setShowSocial] = useState(true);
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [businessHoursEs, setBusinessHoursEs] = useState("");
  const [emailReplyTime, setEmailReplyTime] = useState("");
  const [emailReplyTimeEs, setEmailReplyTimeEs] = useState("");
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [limit, autoRead, footerServs, servs, fb, ig, show, phone, email, hours, hoursEs, reply, replyEs] = await Promise.all([
          getSiteSettings("recent_leads_limit"),
          getSiteSettings("auto_mark_leads_read"),
          getSiteSettings("footer_services"),
          getServices(),
          getSiteSettings("facebook_url"),
          getSiteSettings("instagram_url"),
          getSiteSettings("show_social_links"),
          getSiteSettings("business_phone"),
          getSiteSettings("business_email"),
          getSiteSettings("business_hours"),
          getSiteSettings("business_hours_es"),
          getSiteSettings("email_reply_time"),
          getSiteSettings("email_reply_time_es"),
        ]);
        if (limit) setLeadsLimit(parseInt(limit));
        if (autoRead !== null)
          setAutoMarkRead(autoRead === true || autoRead === "true");
        if (footerServs)
          setFooterServices(
            Array.isArray(footerServs) ? footerServs : JSON.parse(footerServs),
          );
        setAllServices(servs);
        if (fb) setFacebookUrl(fb);
        if (ig) setInstagramUrl(ig);
        if (show !== null) setShowSocial(show === true || show === "true");
        if (phone) setBusinessPhone(phone);
        if (email) setBusinessEmail(email);
        if (hours) setBusinessHours(hours);
        if (hoursEs) setBusinessHoursEs(hoursEs);
        if (reply) setEmailReplyTime(reply);
        if (replyEs) setEmailReplyTimeEs(replyEs);
      } catch (err) {
        console.error("Error loading settings:", err);
      }
    };
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setSaveStatus("saving");
    try {
      await Promise.all([
        updateSiteSetting("recent_leads_limit", leadsLimit.toString()),
        updateSiteSetting("auto_mark_leads_read", autoMarkRead),
        updateSiteSetting("footer_services", footerServices),
        updateSiteSetting("facebook_url", facebookUrl),
        updateSiteSetting("instagram_url", instagramUrl),
        updateSiteSetting("show_social_links", showSocial),
        updateSiteSetting("business_phone", businessPhone),
        updateSiteSetting("business_email", businessEmail),
        updateSiteSetting("business_hours", businessHours),
        updateSiteSetting("business_hours_es", businessHoursEs),
        updateSiteSetting("email_reply_time", emailReplyTime),
        updateSiteSetting("email_reply_time_es", emailReplyTimeEs),
      ]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const moveService = (index: number, direction: "up" | "down") => {
    const newOrder = [...footerServices];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    [newOrder[index], newOrder[targetIndex]] = [
      newOrder[targetIndex],
      newOrder[index],
    ];
    setFooterServices(newOrder);
  };

  const removeService = (id: string) => {
    setFooterServices(footerServices.filter((s) => s !== id));
  };

  const addService = (id: string) => {
    if (footerServices.length >= 10) return;
    if (footerServices.includes(id)) return;
    setFooterServices([...footerServices, id]);
  };

  const sortAlphabetically = () => {
    const sorted = [...footerServices].sort((a, b) => {
      const sA = allServices.find((s) => s.id === a);
      const sB = allServices.find((s) => s.id === b);
      const nameA = sA?.title_en || "";
      const nameB = sB?.title_en || "";
      return nameA.localeCompare(nameB);
    });
    setFooterServices(sorted);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="mb-12">
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3 block underline decoration-emerald-200 underline-offset-8">
            Admin
          </span>
          <h1 className="text-5xl font-black text-slate-950 tracking-tight flex items-center gap-4">
            <Settings className="text-emerald-600" size={40} />
            {t("admin.settings.title")}
          </h1>
          <p className="text-slate-500 mt-4 text-lg">
            {t("admin.settings.subtitle")}
          </p>
        </div>

        {/* Account card */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden mb-6">
          <div className="px-10 py-6 border-b border-slate-100">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.settings.account")}
            </h2>
          </div>
          <div className="px-10 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <p className="text-sm font-black text-slate-900">{user?.email}</p>
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                {t("admin.settings.role")}
              </span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors border border-red-100"
            >
              <LogOut size={16} />
              {t("admin.settings.signOut")}
            </button>
          </div>
        </div>

        {/* Site Configuration */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              {t("admin.settings.config")}
            </h2>
            {saveStatus === "saved" && (
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                {t("admin.settings.saved")}
              </span>
            )}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100 shadow-sm shadow-emerald-600/5"
            >
              <Phone size={14} />
              {t("admin.settings.businessInfo.edit")}
            </button>
          </div>
          <div className="px-10 py-10 space-y-8">
            <div className="max-w-md">
              <label className="block text-sm font-black text-slate-900 mb-2 uppercase tracking-tight">
                {t("admin.settings.leadsLimit")}
              </label>
              <p className="text-xs text-slate-500 mb-4 font-medium leading-relaxed">
                {t("admin.settings.leadsLimitDesc")}
              </p>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="1"
                  value={leadsLimit}
                  onChange={(e) => setLeadsLimit(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-900 border border-slate-100">
                  {leadsLimit}
                </div>
              </div>
            </div>

            <div className="max-w-md pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <label className="block text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">
                    {t("admin.settings.autoMarkRead", {
                      defaultValue: "Auto-mark leads as Read",
                    })}
                  </label>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t("admin.settings.autoMarkReadDesc", {
                      defaultValue:
                        "Automatically change status to 'Read' when opening a lead detail page.",
                    })}
                  </p>
                </div>
                <button
                  onClick={() => setAutoMarkRead(!autoMarkRead)}
                  className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                    autoMarkRead ? "bg-emerald-600" : "bg-slate-200"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${
                      autoMarkRead ? "translate-x-6" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">
                    {t("admin.settings.footerServices", {
                      defaultValue: "Footer Services",
                    })}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {t("admin.settings.footerServicesDesc", {
                      defaultValue:
                        "Select and order up to 10 services to display in the website footer. Ideally 5 per column.",
                    })}
                  </p>
                  <button
                    onClick={sortAlphabetically}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100"
                  >
                    <SortAsc size={14} />
                    {t("admin.settings.sortAlpha", {
                      defaultValue: "Sort A-Z",
                    })}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Active Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {t("admin.settings.activeFooter", {
                        defaultValue: "Selected Services",
                      })}{" "}
                      ({footerServices.length}/10)
                    </span>
                  </div>
                  <div className="space-y-2">
                    {footerServices.map((id, idx) => {
                      const service = allServices.find((s) => s.id === id);
                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 group"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-700">
                              {service?.title_en}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => moveService(idx, "up")}
                              disabled={idx === 0}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              onClick={() => moveService(idx, "down")}
                              disabled={idx === footerServices.length - 1}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 disabled:opacity-30"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <button
                              onClick={() => removeService(id)}
                              className="p-1.5 text-slate-400 hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {footerServices.length === 0 && (
                      <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 text-xs font-bold">
                        No services selected for footer
                      </div>
                    )}
                  </div>
                </div>

                {/* Availability Pool */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {t("admin.settings.availableServices", {
                      defaultValue: "Available Services",
                    })}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                    {allServices
                      .filter((s) => !footerServices.includes(s.id))
                      .map((service) => (
                        <button
                          key={service.id}
                          onClick={() => addService(service.id)}
                          disabled={footerServices.length >= 10}
                          className="flex items-center justify-between p-3 text-left bg-white border border-slate-100 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/30 transition-all group disabled:opacity-40"
                        >
                          <span className="text-xs font-bold text-slate-600 truncate mr-2">
                            {service.title_en}
                          </span>
                          <PlusCircle
                            size={14}
                            className="text-slate-300 group-hover:text-emerald-500"
                          />
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-tight">
                {t("admin.settings.socialLinks")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      {t("admin.settings.facebook")}
                    </label>
                    <input
                      type="url"
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/your-page"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                      {t("admin.settings.instagram")}
                    </label>
                    <input
                      type="url"
                      value={instagramUrl}
                      onChange={(e) => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/your-profile"
                      className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <div className="flex items-center justify-between gap-6">
                    <div>
                      <label className="block text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">
                        {t("admin.settings.showSocial")}
                      </label>
                    </div>
                    <button
                      onClick={() => setShowSocial(!showSocial)}
                      className={`relative w-14 h-8 rounded-full transition-all duration-300 ${
                        showSocial ? "bg-emerald-600" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-sm ${
                          showSocial ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50">
              <button
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50 active:scale-95"
              >
                {isSaving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {t("admin.settings.save")}
              </button>
            </div>
          </div>
        </div>

        {/* Help & Tutorials Section */}
        <div className="bg-emerald-900 text-white rounded-[2.5rem] p-10 relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-emerald-800/50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                <PlayCircle size={12} />
                Resources
              </div>
              <h2 className="text-3xl font-black mb-3 tracking-tight">
                {t("admin.settings.help.title")}
              </h2>
              <p className="text-emerald-100 font-medium opacity-80 leading-relaxed">
                {t("admin.settings.help.subtitle")}
              </p>
            </div>
            <a
              href={`https://github.com/CanelaLandscaping/Canela-Landscaping-Website/blob/main/README.md${i18n.language.startsWith("es") ? "#--guías-en-video-para-el-administrador" : "#-admin-video-guides"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-emerald-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-emerald-50 transition-all active:scale-95 shadow-xl shrink-0"
            >
              {t("admin.settings.help.button")}
              <ExternalLink size={18} />
            </a>
          </div>
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-64 h-full bg-emerald-800/20 skew-x-[-20deg] translate-x-32" />
        </div>
      </div>

      {/* Business Info Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  {t("admin.settings.businessInfo.title")}
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Update your public contact details
                </p>
              </div>
              <button
                onClick={() => setIsContactModalOpen(false)}
                className="p-2 hover:bg-white rounded-xl transition-colors text-slate-400 hover:text-slate-900 shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {t("admin.settings.businessInfo.phone")}
                  </label>
                  <input
                    type="text"
                    value={businessPhone}
                    onChange={(e) => setBusinessPhone(e.target.value)}
                    placeholder="(216) 000-0000"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {t("admin.settings.businessInfo.hours")}
                  </label>
                  <input
                    type="text"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    placeholder="Mon - Fri, 8am - 6pm"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {t("admin.settings.businessInfo.hours")} (Spanish)
                  </label>
                  <input
                    type="text"
                    value={businessHoursEs}
                    onChange={(e) => setBusinessHoursEs(e.target.value)}
                    placeholder="Lun - Vie, 8am - 6pm"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>
                <div className="pt-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {t("admin.settings.businessInfo.email")}
                  </label>
                  <input
                    type="email"
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="contact@company.com"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {t("admin.settings.businessInfo.reply")}
                  </label>
                  <input
                    type="text"
                    value={emailReplyTime}
                    onChange={(e) => setEmailReplyTime(e.target.value)}
                    placeholder="We reply within 24h"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                    {t("admin.settings.businessInfo.reply")} (Spanish)
                  </label>
                  <input
                    type="text"
                    value={emailReplyTimeEs}
                    onChange={(e) => setEmailReplyTimeEs(e.target.value)}
                    placeholder="Respondemos en menos de 24h"
                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="w-full py-5 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-[0.98]"
                >
                  {t("admin.services.modal.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSettings;
