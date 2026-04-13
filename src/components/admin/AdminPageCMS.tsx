import { useState, useEffect } from "react";
import {
  Plus,
  Settings,
  Trash2,
  MoveUp,
  MoveDown,
  Loader2,
  Eye,
  EyeOff,
  Layout,
  PlusCircle,
} from "lucide-react";
import {
  deletePageSection,
  getPageSections,
  updateSectionsOrder,
  upsertPageSection,
  type CMSSection,
} from "../../supabase/queries";
import AdminLayout from "../AdminLayout";
import CMSSectionEditor from "./CMSSectionEditor";

interface AdminPageCMSProps {
  pageId: string;
  pageTitle: string;
}

const AdminPageCMS = ({ pageId, pageTitle }: AdminPageCMSProps) => {
  const [sections, setSections] = useState<CMSSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] =
    useState<Partial<CMSSection> | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const data = await getPageSections(pageId);
      setSections(data);
    } catch (err) {
      console.error("Error fetching sections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageId]);

  const handleToggleActive = async (section: CMSSection) => {
    try {
      await upsertPageSection({ ...section, is_active: !section.is_active });
      fetchSections();
    } catch (err) {
      console.error("Error toggling status:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await deletePageSection(id);
      fetchSections();
    } catch (err) {
      console.error("Error deleting section:", err);
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newSections.length) return;

    // Swap
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Update display orders
    const updates = newSections.map((s, idx) => ({
      id: s.id,
      display_order: idx,
    }));

    try {
      setSections(newSections); // Optimistic update
      await updateSectionsOrder(updates);
      fetchSections();
    } catch (err) {
      console.error("Error reordering:", err);
    }
  };

  const handleAddSection = (type: string) => {
    setEditingSection({
      page_id: pageId,
      type,
      display_order: sections.length,
      is_active: true,
      content: {}, // Initial empty content
    });
    setIsEditorOpen(true);
  };

  const getSectionColor = (type: string) => {
    switch (type) {
      case "hero":
        return "bg-emerald-100 text-emerald-700";
      case "story":
        return "bg-blue-100 text-blue-700";
      case "team":
        return "bg-purple-100 text-purple-700";
      case "cta":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3 block underline decoration-emerald-200 underline-offset-8">
            CMS Management
          </span>
          <h1 className="text-5xl font-black text-slate-950 tracking-tight flex items-center gap-4">
            <Layout className="text-emerald-600" size={40} />
            {pageTitle}
          </h1>
          <p className="text-slate-500 mt-4 text-lg max-w-2xl">
            Design your page layout by adding, removing, and reordering content
            sections.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative group">
            <button className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10 active:scale-95">
              <PlusCircle size={20} />
              Add Section
            </button>
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
              <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-2">
                Available Components
              </p>
              {pageId === "home" ? (
                <>
                  {[
                    "hero",
                    "trust-badges",
                    "featured-services",
                    "why-us",
                    "testimonial",
                    "cta",
                  ].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAddSection(type)}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 capitalize"
                    >
                      {type.replace("-", " ")}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  {["story", "values", "team", "testimonial", "cta"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleAddSection(type)}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 capitalize"
                    >
                      {type}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {loading && sections.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[2.5rem] border border-slate-100">
          <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
          <p className="font-bold">Syncing layout...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`bg-white rounded-[2rem] border ${section.is_active ? "border-slate-100" : "border-slate-100 opacity-60 grayscale"} shadow-sm p-6 flex flex-col md:flex-row items-center justify-between gap-6 group transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => handleMove(idx, "up")}
                    disabled={idx === 0}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 disabled:opacity-20"
                  >
                    <MoveUp size={18} />
                  </button>
                  <button
                    onClick={() => handleMove(idx, "down")}
                    disabled={idx === sections.length - 1}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-emerald-600 disabled:opacity-20"
                  >
                    <MoveDown size={18} />
                  </button>
                </div>

                <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-400 text-lg">
                  {idx + 1}
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest ${getSectionColor(section.type)}`}
                    >
                      {section.type}
                    </span>
                    {!section.is_active && (
                      <span className="flex items-center gap-1 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <EyeOff size={10} /> Hidden
                      </span>
                    )}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors capitalize">
                    {section.type.replace("-", " ")} Section
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(section)}
                  title={section.is_active ? "Hide section" : "Show section"}
                  className={`p-3 rounded-xl transition-all ${section.is_active ? "text-slate-400 hover:bg-slate-50 hover:text-slate-600" : "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"}`}
                >
                  {section.is_active ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
                <button
                  onClick={() => {
                    setEditingSection(section);
                    setIsEditorOpen(true);
                  }}
                  className="p-3 text-slate-400 hover:bg-slate-50 hover:text-emerald-600 rounded-xl transition-all"
                >
                  <Settings size={20} />
                </button>
                <button
                  onClick={() => handleDelete(section.id)}
                  className="p-3 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}

          {sections.length === 0 && (
            <div className="py-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-400">
              <Plus size={48} className="mb-4 opacity-20" />
              <p className="font-bold text-lg">No sections yet.</p>
              <p className="text-sm">
                Click "Add Section" to begin building your page.
              </p>
            </div>
          )}
        </div>
      )}

      {isEditorOpen && editingSection && (
        <CMSSectionEditor
          section={editingSection}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingSection(null);
          }}
          onSaved={() => {
            setIsEditorOpen(false);
            setEditingSection(null);
            fetchSections();
          }}
        />
      )}
    </AdminLayout>
  );
};

export default AdminPageCMS;
