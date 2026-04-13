import AdminSidebar from "./AdminSidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared layout for all admin pages.
 *
 * Spacing logic:
 *   - Global Navbar is sticky at top-0, height 72px.
 *   - All admin content sits below it.
 */
const AdminLayout = ({ children }: AdminLayoutProps) => (
  <div className="min-h-screen bg-slate-50 flex flex-col pt-[72px] px-6 md:px-12">
    <main className="flex-1 w-full container-custom py-8 lg:py-16">
      {/* 
        On Desktop: Lateral layout with a sticky sidebar.
        On Mobile: Vertical layout with a fixed sub-nav bar.
      */}
      <div className="lg:flex lg:gap-12">
        {/* 
          AdminSidebar handles both the mobile fixed sub-nav 
          and the desktop lateral sidebar column.
        */}
        <AdminSidebar />
        
        {/* 
          Content Area
          Mobile: Needs 56px offset to clear the mobile fixed sub-nav.
          Desktop: Standard flow.
        */}
        <div className="flex-1 min-w-0 pt-14 lg:pt-0">
          {children}
        </div>
      </div>
    </main>
  </div>
);

export default AdminLayout;
