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
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AdminLayout from "../components/AdminLayout";

const AdminSettings = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const [leadsLimit, setLeadsLimit] = useState(10);
  const [autoMarkRead, setAutoMarkRead] = useState(true);
  const [footerServices, setFooterServices] = useState<string[]>([]);
  const [allServices, setAllServices] = useState<CMSService[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [limit, autoRead, footerServs, servs] = await Promise.all([
          getSiteSettings("recent_leads_limit"),
          getSiteSettings("auto_mark_leads_read"),
          getSiteSettings("footer_services"),
          getServices(),
        ]);
        if (limit) setLeadsLimit(parseInt(limit));
        if (autoRead !== null)
          setAutoMarkRead(autoRead === true || autoRead === "true");
        if (footerServs)
          setFooterServices(
            Array.isArray(footerServs) ? footerServs : JSON.parse(footerServs),
          );
        setAllServices(servs);
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
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
