import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getLeadById, updateLeadStatus, getSiteSettings, type Lead } from "../supabase/queries";
import AdminLayout from "../components/AdminLayout";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Tag,
  MessageSquare,
  Clock,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const AdminLeadDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      try {
        const data = await getLeadById(id);
        if (data) {
          setLead(data);
          // Auto-mark as read if enabled and it was New
          const autoReadSetting = await getSiteSettings('auto_mark_leads_read');
          const isAutoMarkEnabled = autoReadSetting === null || autoReadSetting === true || autoReadSetting === 'true';

          if (data.status === "New" && isAutoMarkEnabled) {
            try {
              await updateLeadStatus(id, "Read");
              setLead((prev) => (prev ? { ...prev, status: "Read" } : null));
            } catch (err) {
              console.error("Error auto-updating status:", err);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching lead:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLead();
  }, [id]);

  const handleStatusChange = async (newStatus: Lead["status"]) => {
    if (!id || !lead) return;
    try {
      await updateLeadStatus(id, newStatus);
      setLead({ ...lead, status: newStatus });
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
          <p className="font-bold">{t("admin.leadDetail.loading")}</p>
        </div>
      </AdminLayout>
    );
  }

  if (!lead) {
    return (
      <AdminLayout>
        <div className="p-8 max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            {t("admin.leadDetail.notFound")}
          </h2>
          <p className="text-slate-500 mb-8 font-medium">
            {t("admin.leadDetail.notFoundDesc")}
          </p>
          <Link
            to="/admin/contacts"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <ArrowLeft size={18} />
            {t("admin.leadDetail.backToLeads")}
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {t("admin.leadDetail.back")}
        </button>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <select
                  value={lead.status}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as Lead["status"])
                  }
                  className={`appearance-none px-4 py-1.5 pr-8 rounded-full text-[10px] font-black uppercase tracking-[0.15em] cursor-pointer transition-all border-none focus:ring-2 focus:ring-offset-2 ${
                    lead.status === "New"
                      ? "bg-orange-100 text-orange-700 focus:ring-orange-200"
                      : lead.status === "Read"
                        ? "bg-blue-100 text-blue-700 focus:ring-blue-200"
                        : "bg-emerald-100 text-emerald-700 focus:ring-emerald-200"
                  }`}
                >
                  <option value="New">{t("admin.leads.new")}</option>
                  <option value="Read">{t("admin.leads.read", { defaultValue: "Read" })}</option>
                  <option value="Contacted">{t("admin.leads.contacted")}</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                  <Clock size={10} />
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Clock size={12} />
                {new Date(lead.created_at).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              {lead.name}
            </h1>
          </div>

          <div className="flex gap-3">
            <a
              href={`mailto:${lead.email}`}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:border-emerald-500 transition-all shadow-sm"
            >
              <Mail size={18} />
              {t("admin.leadDetail.emailBtn")}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:border-emerald-500 transition-all shadow-sm"
              >
                <Phone size={18} />
                {t("admin.leadDetail.call")}
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Message Card */}
            <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 text-slate-400 mb-6">
                <MessageSquare size={20} />
                <span className="text-xs font-black uppercase tracking-widest">
                  {t("admin.leadDetail.message")}
                </span>
              </div>
              <p className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium">
                {lead.message || t("admin.leadDetail.noMessage")}
              </p>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">
                {t("admin.leadDetail.projectInfo")}
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Tag size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      {t("admin.leadDetail.service")}
                    </p>
                    <p className="font-bold text-slate-900">
                      {(() => {
                        const serviceMap: Record<string, string> = {
                          "Lawn Maintenance": "services.lawn-maintenance.title",
                          "Garden Cleanup": "services.yard-cleanup.title",
                          "Patio Repair": "services.patios.title",
                          "Snow Removal": "services.snow-plow.title",
                          "Other / Multiple": "contact.form.placeholders.service",
                        };
                        const key = serviceMap[lead.service];
                        return key ? t(key) : lead.service;
                      })()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      {t("admin.leadDetail.date")}
                    </p>
                    <p className="font-bold text-slate-900">
                      {new Date(lead.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-900 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-900/10">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 size={24} className="text-emerald-400" />
                <h3 className="text-lg font-black tracking-tight">
                  {t("admin.leadDetail.statusInsight")}
                </h3>
              </div>
              <p className="text-sm text-emerald-100/70 font-medium leading-relaxed">
                {t("admin.leadDetail.statusNote", {
                  status:
                    lead.status === "New"
                      ? t("admin.leads.new")
                      : lead.status === "Read"
                        ? t("admin.leads.read", { defaultValue: "Read" })
                        : t("admin.leads.contacted"),
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeadDetail;
