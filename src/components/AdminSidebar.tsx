import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Settings, Mail, Layers, Home, Info } from "lucide-react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  const NAV_ITEMS: NavItem[] = [
    {
      label: t("admin.sidebar.dashboard"),
      path: "/admin",
      icon: <LayoutDashboard size={16} />,
    },
    {
      label: t("admin.sidebar.contacts"),
      path: "/admin/contacts",
      icon: <Mail size={16} />,
    },
    {
      label: t("admin.sidebar.services"),
      path: "/admin/services",
      icon: <Layers size={16} />,
    },
    {
      label: t("admin.sidebar.home"),
      path: "/admin/home",
      icon: <Home size={16} />,
    },
    {
      label: t("admin.sidebar.about"),
      path: "/admin/about",
      icon: <Info size={16} />,
    },
    {
      label: t("admin.sidebar.settings"),
      path: "/admin/settings",
      icon: <Settings size={16} />,
    },
  ];

  const isActive = (path: string) =>
    path === "/admin" ? pathname === "/admin" : pathname.startsWith(path);

  return (
    <>
      {/* ── Mobile: horizontal top bar ──────────────────────────────── */}
      <div className="lg:hidden fixed top-[72px] left-0 w-full bg-white/95 backdrop-blur-md z-40 border-b border-slate-100 shadow-sm overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-3 px-4 h-14">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                isActive(item.path)
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                  : "bg-white border border-slate-200 text-slate-900 shadow-sm hover:border-emerald-400"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Desktop: side column ──────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0">
        <nav className="sticky top-[100px] flex-col space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20"
                  : "text-slate-500 hover:bg-white hover:text-emerald-600 hover:shadow-sm border border-transparent hover:border-slate-100"
              }`}
            >
              <span className={isActive(item.path) ? "text-white" : "text-slate-300"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
