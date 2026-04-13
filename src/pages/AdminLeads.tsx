import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads, type Lead } from "../supabase/queries";
import AdminLayout from "../components/AdminLayout";
import { useTranslation } from "react-i18next";
import { Mail, Loader2, ChevronRight, Search } from "lucide-react";

const AdminLeads = () => {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(
    (lead: Lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.service.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              {t("admin.leads.title")}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              {t("admin.leads.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder={t("admin.leads.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2
                size={40}
                className="animate-spin mb-4 text-emerald-600"
              />
              <p className="font-bold">Loading submissions...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                <Mail size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 mt-4">
                {searchTerm
                  ? t("admin.leads.noResults")
                  : t("admin.leads.noLeads")}
              </h3>
              <p className="text-slate-400 font-medium max-w-sm">
                {searchTerm
                  ? t("admin.leads.noResultsDesc")
                  : t("admin.leads.noLeadsDesc")}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                      {t("admin.leads.customer")}
                    </th>
                    <th className="hidden sm:table-cell px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      {t("admin.leads.service")}
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      {t("admin.leads.date")}
                    </th>
                    <th className="hidden md:table-cell px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                      {t("admin.leads.status")}
                    </th>
                    <th className="px-4 py-4 border-b border-slate-100"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => navigate(`/admin/contacts/${lead.id}`)}
                      className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    >
                      <td className="px-4 py-5">
                        <p className="font-bold text-slate-900 text-sm">
                          {lead.name}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400 truncate max-w-[150px]">
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
                          {new Date(lead.created_at).toLocaleDateString()}
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

export default AdminLeads;
