import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getLeads, type Lead } from '../supabase/queries';
import { 
  LogOut, 
  TrendingUp, 
  Clock, 
  Mail,
  ChevronRight,
  Loader2,
  Calendar,
  MoreVertical
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    { label: 'Total Leads', value: leads.length.toString(), icon: Mail, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { label: 'Active Projects', value: '0', icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'New Inquiries', value: leads.filter(l => l.status === 'New').length.toString(), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Admin Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-600/20">
              C
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight leading-none uppercase">Canela</h1>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Management</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs font-black text-slate-900 leading-none">{user?.email}</p>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Master Admin</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-[1600px] mx-auto space-y-8">
          {/* Welcome Section */}
          <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Welcome back, Canela Team!</h2>
              <p className="text-emerald-100 text-lg font-medium opacity-80">
                Your landscaping business dashboard is ready. Manage your customer leads and snow plowing requests from here.
              </p>
            </div>
            <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-800/10 skew-x-[-20deg] translate-x-12"></div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={stat.label}
                className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <ChevronRight className="text-slate-200" size={20} />
                </div>
                <div className="mt-8">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <h3 className="text-4xl font-black text-slate-900">{stat.value}</h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Leads Table Section */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-900">Recent Leads</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Contact form submissions from the website.</p>
              </div>
            </div>

            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
                <p className="font-bold">Fetching leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
                  <Mail size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2 mt-4">No recent leads yet.</h3>
                <p className="text-slate-400 font-medium max-w-sm">
                  When customers fill out the contact form, their details will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Customer</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Service</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Date</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">Status</th>
                      <th className="px-8 py-4 border-b border-slate-100"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-8 py-6">
                          <p className="font-bold text-slate-900">{lead.name}</p>
                          <a href={`mailto:${lead.email}`} className="text-sm font-medium text-emerald-600 hover:underline">
                            {lead.email}
                          </a>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                            {lead.service}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                            <Calendar size={14} />
                            {new Date(lead.created_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            lead.status === 'New' ? 'bg-orange-100 text-orange-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {lead.status || 'New'}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="text-slate-300 hover:text-emerald-600 transition-colors p-2">
                            <MoreVertical size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Admin Footer */}
      <footer className="p-8 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Canela Landscaping & Snow Plow Portal &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default AdminDashboard;
