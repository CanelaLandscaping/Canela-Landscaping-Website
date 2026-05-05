import { useNavigate, Link } from "react-router-dom";
import { getLeads, getSiteSettings, type Lead } from "../supabase/queries";
import AdminLayout from "../components/AdminLayout";
import { useTranslation } from "react-i18next";
import { Flame, Clock, Mail, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [leadsLimit, setLeadsLimit] = useState(4);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, limit] = await Promise.all([
          getLeads(),
          getSiteSettings("recent_leads_limit"),
        ]);
        setLeads(leadsData);
        if (limit) setLeadsLimit(parseInt(limit));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: t("admin.dashboard.stats.totalLeads"),
      value: leads.length.toString(),
      icon: Mail,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: t("admin.dashboard.stats.topService"),
      value: (() => {
        if (leads.length === 0) return "—";
        const freq: Record<string, number> = {};
        leads.forEach((l) => {
          freq[l.service] = (freq[l.service] || 0) + 1;
        });
        const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
        return top ? top[0] : "—";
      })(),
      icon: Flame,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      isSmallText: true,
    },
    {
      label: t("admin.dashboard.stats.newInquiries"),
      value: leads.filter((l) => l.status === "New").length.toString(),
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  const recentLeads = leads.slice(0, leadsLimit);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-emerald-900/20">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
              {t("admin.dashboard.welcome")}
            </h2>
            <p className="text-emerald-100 text-lg font-medium opacity-80">
              {t("admin.dashboard.subtitle")}
            </p>
          </div>
          <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-800/10 skew-x-[-20deg] translate-x-12"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <ChevronRight className="text-slate-200" size={20} />
              </div>
              <div className="mt-8">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {stat.label}
                </p>
                <h3 className={`font-black text-slate-900 ${stat.isSmallText ? "text-lg leading-snug" : "text-4xl"}`}>
                  {stat.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Leads Table Section */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                {t("admin.dashboard.recentLeads.title")}
              </h3>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {t("admin.dashboard.recentLeads.subtitle", {
                  limit: leadsLimit,
                })}
              </p>
            </div>
            <Link
              to="/admin/contacts"
              className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group"
            >
              {t("admin.dashboard.recentLeads.viewAll")}
              <ChevronRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </Link>
          </div>

          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2
                size={40}
                className="animate-spin mb-4 text-emerald-600"
              />
              <p className="font-bold">{t("admin.loading")}</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 mt-4">
                {t("admin.dashboard.recentLeads.noLeads")}
              </h3>
              <p className="text-slate-400 font-medium max-w-sm">
                {t("admin.dashboard.recentLeads.noLeadsDesc")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      {t("admin.dashboard.recentLeads.customer")}
                    </th>
                    <th className="hidden sm:table-cell px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      {t("admin.dashboard.recentLeads.service")}
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      {t("admin.dashboard.recentLeads.date")}
                    </th>
                    <th className="hidden md:table-cell px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      {t("admin.dashboard.recentLeads.status")}
                    </th>
                    <th className="px-4 py-4 border-b border-slate-100"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/admin/contacts/${lead.id}`)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-5">
                        <p className="font-bold text-slate-900 text-sm">
                          {lead.name}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 truncate max-w-[120px]">
                          {lead.email}
                        </p>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-5 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500">
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
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <span className="text-xs font-bold text-slate-600">
                          {new Date(lead.created_at).toLocaleString(undefined, {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-5 text-center">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                            lead.status === "New"
                              ? "bg-orange-50 text-orange-600"
                              : lead.status === "Read"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {lead.status === "New"
                            ? t("admin.leads.new")
                            : lead.status === "Read"
                              ? t("admin.leads.read", { defaultValue: "Read" })
                              : t("admin.leads.contacted")}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-right">
                        <ChevronRight
                          size={18}
                          className="text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1 inline-block"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
