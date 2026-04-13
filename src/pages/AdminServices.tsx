import { useTranslation } from "react-i18next";
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Layers,
  X,
  Check,
  Loader2,
  Upload,
  Image as ImageIcon,
  Globe,
  PlusCircle,
} from "lucide-react";
import {
  getCategories,
  getServices,
  upsertCategory,
  upsertService,
  deleteCategory,
  deleteService,
  type CMSCategory,
  type CMSService,
  type CMSImage,
  getServiceImages,
  uploadServiceImage,
  addExternalImageLink,
  deleteImage,
  getSiteSettings,
  updateSiteSetting,
} from "../supabase/queries";
import { useEffect, useState } from "react";
import { compressImage } from "../utils/imageUtils";
import AdminLayout from "../components/AdminLayout";
import { isSupabaseConfigured } from "../supabase/client";

const AdminServices = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState<CMSCategory[]>([]);
  const [services, setServices] = useState<CMSService[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "services" | "categories" | "content"
  >("services");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editObj, setEditObj] = useState<CMSCategory | CMSService | null>(null);
  const [serviceImages, setServiceImages] = useState<CMSImage[]>([]);
  const [serviceImagesLoading, setServiceImagesLoading] = useState(false);
  const [modalTab, setModalTab] = useState<"info" | "images">("info");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [servicesHeader, setServicesHeader] = useState({
    badge_en: "",
    badge_es: "",
    title_en: "",
    title_es: "",
    subtitle_en: "",
    subtitle_es: "",
  });
  const [galleryHeader, setGalleryHeader] = useState({
    badge_en: "",
    badge_es: "",
    title_en: "",
    title_es: "",
    subtitle_en: "",
    subtitle_es: "",
  });
  const [isSavingContent, setIsSavingContent] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [catData, servData, sHeader, gHeader] = await Promise.all([
        getCategories(),
        getServices(),
        getSiteSettings("page_header_services"),
        getSiteSettings("page_header_gallery"),
      ]);
      setCategories(catData);
      setServices(servData);
      if (sHeader) setServicesHeader(sHeader);
      if (gHeader) setGalleryHeader(gHeader);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceImages = async (serviceId: string) => {
    setServiceImagesLoading(true);
    try {
      const images = await getServiceImages(serviceId);
      setServiceImages(images);
    } catch (err) {
      console.error("Error fetching service images:", err);
    } finally {
      setServiceImagesLoading(false);
    }
  };

  const handleSaveCategory = async () => {
    if (!editObj) return;
    try {
      await upsertCategory(editObj as CMSCategory);
      setIsEditing(null);
      fetchData();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleSaveService = async () => {
    if (!editObj) return;
    try {
      await upsertService(editObj as CMSService);
      setIsEditing(null);
      fetchData();
    } catch (err) {
      console.error("Error saving service:", err);
    }
  };

  const handleDelete = async (type: "cat" | "serv", id: string) => {
    if (!confirm(t("admin.leadDetail.deleteConfirm"))) return;
    try {
      if (type === "cat") await deleteCategory(id);
      else await deleteService(id);
      fetchData();
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const startEdit = (type: "cat" | "serv", obj?: CMSCategory | CMSService) => {
    setModalTab("info");
    setServiceImages([]);
    setExternalUrl("");

    if (obj) {
      setEditObj({ ...obj } as CMSCategory | CMSService);
      setIsEditing(obj.id);
      if (type === "serv") {
        fetchServiceImages(obj.id);
      }
    } else {
      // New object
      if (type === "cat") {
        setEditObj({
          name_en: "",
          name_es: "",
          display_order: categories.length + 1,
          sort_type: "alphabetical",
        } as CMSCategory);
        setIsEditing("new-cat");
      } else {
        setEditObj({
          id: "",
          category_id: categories[0]?.id || "",
          title_en: "",
          title_es: "",
          description_en: "",
          description_es: "",
          icon: "Scissors",
          is_featured: false,
          is_active: true,
          display_order: services.length + 1,
        } as CMSService);
        setIsEditing("new-serv");
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editObj || !isSupabaseConfigured) return;

    setIsImageUploading(true);
    try {
      // 1. Compress
      const compressedBlob = await compressImage(file);

      // 2. Upload
      await uploadServiceImage(
        editObj.id,
        compressedBlob,
        file.name.replace(/\.[^/.]+$/, "") + ".webp",
      );

      // 3. Refresh
      fetchServiceImages(editObj.id);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert(t("admin.services.modal.uploadError"));
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleAddExternalLink = async () => {
    if (!externalUrl || !editObj) return;
    try {
      await addExternalImageLink(editObj.id, externalUrl);
      setExternalUrl("");
      fetchServiceImages(editObj.id);
    } catch (err) {
      console.error("Error adding link:", err);
    }
  };

  const handleDeleteImg = async (image: CMSImage) => {
    if (!confirm(t("admin.services.modal.confirmDeleteImg"))) return;
    try {
      await deleteImage(image.id, image.storage_path);
      if (editObj) fetchServiceImages(editObj.id);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-emerald-600 font-bold text-sm uppercase tracking-widest mb-3 block underline decoration-emerald-200 underline-offset-8">
              CMS Management
            </span>
            <h1 className="text-5xl font-black text-slate-950 tracking-tight flex items-center gap-4">
              <Layers className="text-emerald-600" size={40} />
              {t("admin.services.title")}
            </h1>
            <p className="text-slate-500 mt-4 text-lg max-w-2xl">
              {t("admin.services.subtitle")}
            </p>
          </div>
          <button
            onClick={() => setActiveTab("content")}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === "content" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t("admin.services.tabs.content")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-white rounded-[2.5rem] border border-slate-100">
          <Loader2 size={40} className="animate-spin mb-4 text-emerald-600" />
          <p className="font-bold">Syncing with database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activeTab === "content" ? (
            <div className="space-y-8">
              {/* Services Page Content */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <PlusCircle size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {t("admin.services.content.servicesHeader")}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      {t("admin.services.content.servicesSubtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Badge */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      Badge (EN / ES)
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.badgeEn")}
                        value={servicesHeader.badge_en}
                        onChange={(e) =>
                          setServicesHeader({
                            ...servicesHeader,
                            badge_en: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.badgeEs")}
                        value={servicesHeader.badge_es}
                        onChange={(e) =>
                          setServicesHeader({
                            ...servicesHeader,
                            badge_es: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      {t("admin.services.content.labels.titleLayout")}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.titleEn")}
                        value={servicesHeader.title_en}
                        onChange={(e) =>
                          setServicesHeader({
                            ...servicesHeader,
                            title_en: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.titleEs")}
                        value={servicesHeader.title_es}
                        onChange={(e) =>
                          setServicesHeader({
                            ...servicesHeader,
                            title_es: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      {t("admin.services.content.labels.subtitleLayout")}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <textarea
                        placeholder={t("admin.services.content.labels.subtitleEn")}
                        value={servicesHeader.subtitle_en}
                        onChange={(e) =>
                          setServicesHeader({
                            ...servicesHeader,
                            subtitle_en: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700 min-h-[100px]"
                      />
                      <textarea
                        placeholder={t("admin.services.content.labels.subtitleEs")}
                        value={servicesHeader.subtitle_es}
                        onChange={(e) =>
                          setServicesHeader({
                            ...servicesHeader,
                            subtitle_es: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
                  <button
                    onClick={async () => {
                      setIsSavingContent(true);
                      try {
                        await updateSiteSetting(
                          "page_header_services",
                          servicesHeader,
                        );
                        alert("Services header updated!");
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsSavingContent(false);
                      }
                    }}
                    disabled={isSavingContent}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10"
                  >
                    {isSavingContent ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    {t("admin.services.content.saveServices")}
                  </button>
                </div>
              </div>

              {/* Gallery Page Content */}
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <ImageIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {t("admin.services.content.galleryHeader")}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      {t("admin.services.content.gallerySubtitle")}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Badge */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      {t("admin.services.content.labels.badgeLayout")}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.badgeEn")}
                        value={galleryHeader.badge_en}
                        onChange={(e) =>
                          setGalleryHeader({
                            ...galleryHeader,
                            badge_en: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.badgeEs")}
                        value={galleryHeader.badge_es}
                        onChange={(e) =>
                          setGalleryHeader({
                            ...galleryHeader,
                            badge_es: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      {t("admin.services.content.labels.titleLayout")}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.titleEn")}
                        value={galleryHeader.title_en}
                        onChange={(e) =>
                          setGalleryHeader({
                            ...galleryHeader,
                            title_en: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder={t("admin.services.content.labels.titleEs")}
                        value={galleryHeader.title_es}
                        onChange={(e) =>
                          setGalleryHeader({
                            ...galleryHeader,
                            title_es: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div className="space-y-4 md:col-span-2">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest pl-1">
                      {t("admin.services.content.labels.subtitleLayout")}
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <textarea
                        placeholder={t("admin.services.content.labels.subtitleEn")}
                        value={galleryHeader.subtitle_en}
                        onChange={(e) =>
                          setGalleryHeader({
                            ...galleryHeader,
                            subtitle_en: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700 min-h-[100px]"
                      />
                      <textarea
                        placeholder={t("admin.services.content.labels.subtitleEs")}
                        value={galleryHeader.subtitle_es}
                        onChange={(e) =>
                          setGalleryHeader({
                            ...galleryHeader,
                            subtitle_es: e.target.value,
                          })
                        }
                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:outline-none focus:border-emerald-500 transition-all font-medium text-slate-700 min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50 flex justify-end">
                  <button
                    onClick={async () => {
                      setIsSavingContent(true);
                      try {
                        await updateSiteSetting(
                          "page_header_gallery",
                          galleryHeader,
                        );
                        alert("Gallery header updated!");
                      } catch (err) {
                        console.error(err);
                      } finally {
                        setIsSavingContent(false);
                      }
                    }}
                    disabled={isSavingContent}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-xl shadow-slate-900/10"
                  >
                    {isSavingContent ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <Save size={20} />
                    )}
                    {t("admin.services.content.saveGallery")}
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === "categories" ? (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">
                  {t("admin.services.categories.title")}
                </h3>
                <button
                  onClick={() => startEdit("cat")}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <Plus size={18} /> {t("admin.services.categories.add")}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t("admin.services.categories.name")}
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t("admin.services.categories.order")}
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {t("admin.services.categories.sorting")}
                      </th>
                      <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                        {t("admin.services.categories.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">
                            {i18n.language.startsWith("es")
                              ? cat.name_es
                              : cat.name_en}
                          </div>
                          <div className="text-xs font-medium text-slate-400">
                            {i18n.language.startsWith("es")
                              ? cat.name_en
                              : cat.name_es}
                          </div>
                        </td>
                        <td className="px-8 py-6 font-bold text-slate-600">
                          {cat.display_order}
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${cat.sort_type === "alphabetical" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
                          >
                            {cat.sort_type}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit("cat", cat)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete("cat", cat.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {t("admin.services.list.title")}
                  </h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                    {t("admin.services.list.total", {
                      count: services.length,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => startEdit("serv")}
                  className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all active:scale-95"
                >
                  <Plus size={18} /> {t("admin.services.list.add")}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 ring-1 ring-slate-100/50">
                      <th className="pl-8 pr-4 py-4 text-[10px] font-black uppercase tracking-widest">
                        {t("admin.services.list.service")}
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest">
                        {t("admin.services.list.category")}
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">
                        {t("admin.services.list.featured")}
                      </th>
                      <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-center">
                        {t("admin.services.list.status")}
                      </th>
                      <th className="pl-4 pr-8 py-4 text-[10px] font-black uppercase tracking-widest text-right">
                        {t("admin.services.list.actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {services.map((serv) => (
                      <tr
                        key={serv.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="pl-8 pr-4 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white transition-colors">
                              <Layers size={16} />
                            </div>
                            <div className="font-bold text-slate-900 truncate max-w-[150px] lg:max-w-none">
                              {serv.title_en}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-5">
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-wider">
                            {categories.find((c) => c.id === serv.category_id)
                              ?.name_en || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-4 py-5 text-center">
                          {serv.is_featured ? (
                            <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center mx-auto ring-1 ring-emerald-100">
                              <Check className="text-emerald-600" size={12} />
                            </div>
                          ) : (
                            <span className="text-slate-200">--</span>
                          )}
                        </td>
                        <td className="px-4 py-5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${serv.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                          >
                            {serv.is_active
                              ? t("admin.services.list.active")
                              : t("admin.services.list.hidden")}
                          </span>
                        </td>
                        <td className="pl-4 pr-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => startEdit("serv", serv)}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 border border-transparent hover:border-emerald-100"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete("serv", serv.id)}
                              className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow-md active:scale-95 border border-transparent hover:border-red-100"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isEditing.startsWith("new")
                    ? t("admin.services.modal.add")
                    : t("admin.services.modal.edit")}{" "}
                  {activeTab === "categories"
                    ? t("admin.services.tabs.categories")
                    : t("admin.services.tabs.services")}
                </h3>
                {activeTab === "services" && !isEditing.startsWith("new") && (
                  <div className="flex gap-4 mt-4 bg-slate-100 p-1 rounded-xl w-fit">
                    <button
                      onClick={() => setModalTab("info")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTab === "info" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {t("admin.services.modal.details")}
                    </button>
                    <button
                      onClick={() => setModalTab("images")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTab === "images" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                    >
                      {t("admin.services.modal.gallery")}
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setIsEditing(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-10 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {modalTab === "info" ? (
                <>
                  {activeTab === "categories" && editObj
                    ? (() => {
                        const cat = editObj as CMSCategory;
                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  {t("admin.services.modal.labels.nameEn")}
                                </label>
                                <input
                                  type="text"
                                  value={cat.name_en}
                                  onChange={(e) =>
                                    setEditObj({
                                      ...cat,
                                      name_en: e.target.value,
                                    })
                                  }
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  {t("admin.services.modal.labels.nameEs")}
                                </label>
                                <input
                                  type="text"
                                  value={cat.name_es}
                                  onChange={(e) =>
                                    setEditObj({
                                      ...cat,
                                      name_es: e.target.value,
                                    })
                                  }
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-inter"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  {t("admin.services.modal.labels.order")}
                                </label>
                                <input
                                  type="number"
                                  value={cat.display_order}
                                  onChange={(e) =>
                                    setEditObj({
                                      ...cat,
                                      display_order: parseInt(e.target.value),
                                    })
                                  }
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  {t("admin.services.modal.labels.sorting")}
                                </label>
                                <select
                                  value={cat.sort_type}
                                  onChange={(e) =>
                                    setEditObj({
                                      ...cat,
                                      sort_type: e.target.value as
                                        | "alphabetical"
                                        | "custom",
                                    })
                                  }
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
                                >
                                  <option value="alphabetical">
                                    Alphabetical
                                  </option>
                                  <option value="custom">Custom Order</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        );
                      })()
                    : activeTab === "services" && editObj
                      ? (() => {
                          const serv = editObj as CMSService;
                          return (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.slug")}
                                  </label>
                                  <input
                                    type="text"
                                    disabled={!isEditing?.startsWith("new")}
                                    placeholder={t(
                                      "admin.services.modal.placeholders.slug",
                                    )}
                                    value={serv.id}
                                    onChange={(e) =>
                                      setEditObj({
                                        ...serv,
                                        id: e.target.value,
                                      })
                                    }
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all disabled:opacity-50"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.category")}
                                  </label>
                                  <select
                                    value={serv.category_id}
                                    onChange={(e) =>
                                      setEditObj({
                                        ...serv,
                                        category_id: e.target.value,
                                      })
                                    }
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
                                  >
                                    <option value="">
                                      {t(
                                        "admin.services.modal.placeholders.selectCategory",
                                      )}
                                    </option>
                                    {categories.map((c) => (
                                      <option key={c.id} value={c.id}>
                                        {c.name_en}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.titleEn")}
                                  </label>
                                  <input
                                    type="text"
                                    value={serv.title_en}
                                    onChange={(e) =>
                                      setEditObj({
                                        ...serv,
                                        title_en: e.target.value,
                                      })
                                    }
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-inter"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.titleEs")}
                                  </label>
                                  <input
                                    type="text"
                                    value={serv.title_es}
                                    onChange={(e) =>
                                      setEditObj({
                                        ...serv,
                                        title_es: e.target.value,
                                      })
                                    }
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-inter"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  {t("admin.services.modal.labels.descEn")}
                                </label>
                                <textarea
                                  value={serv.description_en}
                                  onChange={(e) =>
                                    setEditObj({
                                      ...serv,
                                      description_en: e.target.value,
                                    })
                                  }
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-24 font-inter"
                                />
                              </div>
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                  {t("admin.services.modal.labels.descEs")}
                                </label>
                                <textarea
                                  value={serv.description_es}
                                  onChange={(e) =>
                                    setEditObj({
                                      ...serv,
                                      description_es: e.target.value,
                                    })
                                  }
                                  className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all h-24 font-inter"
                                />
                              </div>

                              <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.order")}
                                  </label>
                                  <input
                                    type="number"
                                    value={serv.display_order}
                                    onChange={(e) =>
                                      setEditObj({
                                        ...serv,
                                        display_order: parseInt(e.target.value),
                                      })
                                    }
                                    className="w-full bg-slate-50 border border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.featured")}
                                  </label>
                                  <div className="flex items-center h-[58px]">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={serv.is_featured}
                                        onChange={(e) =>
                                          setEditObj({
                                            ...serv,
                                            is_featured: e.target.checked,
                                          })
                                        }
                                        className="sr-only peer"
                                      />
                                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    {t("admin.services.modal.labels.active")}
                                  </label>
                                  <div className="flex items-center h-[58px]">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={serv.is_active}
                                        onChange={(e) =>
                                          setEditObj({
                                            ...serv,
                                            is_active: e.target.checked,
                                          })
                                        }
                                        className="sr-only peer"
                                      />
                                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()
                      : null}
                </>
              ) : (
                <div className="space-y-10">
                  {/* Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {t("admin.services.modal.labels.upload")}
                      </label>
                      <label
                        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${isImageUploading ? "bg-slate-50 border-slate-100 opacity-50 cursor-not-allowed" : "bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-emerald-200"}`}
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-6">
                          {isImageUploading ? (
                            <Loader2
                              size={32}
                              className="animate-spin text-emerald-600 mb-3"
                            />
                          ) : (
                            <Upload size={32} className="text-slate-300 mb-3" />
                          )}
                          <p className="text-xs font-bold text-slate-600 mb-1">
                            {isImageUploading
                              ? "Compressing & Uploading..."
                              : t("admin.services.modal.labels.uploadHint")}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {t("admin.services.modal.labels.uploadLimit")}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          disabled={isImageUploading}
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">
                        {t("admin.services.modal.labels.link")}
                      </label>
                      <div className="space-y-4">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                            <Globe size={18} />
                          </div>
                          <input
                            type="url"
                            placeholder={t(
                              "admin.services.modal.placeholders.link",
                            )}
                            value={externalUrl}
                            onChange={(e) => setExternalUrl(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-100 pl-11 pr-4 py-4 rounded-2xl font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                          />
                        </div>
                        <button
                          onClick={handleAddExternalLink}
                          disabled={!externalUrl}
                          className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-900 transition-all hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <PlusCircle size={18} />{" "}
                          {t("admin.services.modal.labels.addLink")}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Gallery List */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">
                        {t("admin.services.modal.labels.galleryTitle", {
                          count: serviceImages.length,
                        })}
                      </h4>
                      {serviceImagesLoading && (
                        <Loader2
                          size={16}
                          className="animate-spin text-emerald-600"
                        />
                      )}
                    </div>

                    {serviceImages.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-slate-300">
                        <ImageIcon size={40} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold">
                          No images uploaded for this service
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {serviceImages.map((img) => (
                          <div
                            key={img.id}
                            className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
                          >
                            <img
                              src={img.url}
                              alt="Gallery"
                              className="w-full h-full object-cover transition-transform group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => handleDeleteImg(img)}
                                className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-xl active:scale-95 transition-all"
                              >
                                <Trash2 size={20} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400">
                {t("admin.services.modal.liveNote")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(null)}
                  className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-all"
                >
                  {t("admin.services.modal.cancel")}
                </button>
                {modalTab === "info" && (
                  <button
                    onClick={
                      activeTab === "categories"
                        ? handleSaveCategory
                        : handleSaveService
                    }
                    className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <Save size={18} /> {t("admin.services.modal.save")}{" "}
                    {activeTab === "categories"
                      ? t("admin.services.tabs.categories")
                      : t("admin.services.tabs.services")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminServices;
