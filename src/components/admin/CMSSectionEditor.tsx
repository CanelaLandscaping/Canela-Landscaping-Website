import { useState } from "react";
import {
  X,
  Save,
  Loader2,
  Upload,
  Link as LinkIcon,
  Plus,
  Trash2,
} from "lucide-react";
import {
  upsertPageSection,
  uploadCMSMedia,
  type CMSSection,
  type CMSSectionContent,
  type HeroContent,
  type WhyUsContent,
  type TeamContent,
  type TestimonialContent,
  type CTAContent,
  type ValuesContent,
  type TrustBadgesContent,
  type FeaturedServicesContent,
} from "../../supabase/queries";

interface CMSSectionEditorProps {
  section: Partial<CMSSection>;
  onClose: () => void;
  onSaved: () => void;
}

const CMSSectionEditor = ({
  section,
  onClose,
  onSaved,
}: CMSSectionEditorProps) => {
  const [content, setContent] = useState<CMSSectionContent>(
    JSON.parse(JSON.stringify(section.content || {})),
  );
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await upsertPageSection({
        ...section,
        content,
      } as CMSSection);
      onSaved();
    } catch (err) {
      console.error("Error saving section:", err);
      alert("Failed to save section content.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateContent = (path: string, value: unknown) => {
    setContent((prev) => {
      const newContent = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      const lastKey = keys.pop()!;
      let current = newContent as any;
      
      for (const key of keys) {
        if (!current[key]) current[key] = {};
        current = current[key];
      }
      
      current[lastKey] = value;
      return newContent as CMSSectionContent;
    });
  };

  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((prev, curr) => prev?.[curr], obj);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(fieldName);
    try {
      const folder = section.page_id === "home" ? "home" : "about";
      const result = await uploadCMSMedia(
        file,
        file.name,
        `${folder}/${section.type}`,
      );
      if (result?.publicUrl) {
        updateContent(fieldName, result.publicUrl);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload media. Check Supabase Storage configuration.");
    } finally {
      setUploadingField(null);
    }
  };

  // Generic Media Input (Upload or URL)
  const MediaInput = ({
    label,
    fieldName,
  }: {
    label: string;
    fieldName: string;
  }) => {
    const contentRecord = content as Record<string, unknown>;
    const fieldValue = (contentRecord[fieldName] as string) || "";

    return (
      <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
          {label}
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <LinkIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              value={fieldValue}
              onChange={(e) => updateContent(fieldName, e.target.value)}
              placeholder="https://..."
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          </div>
          <div className="relative">
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, fieldName)}
              className="hidden"
              id={`upload-${fieldName}`}
            />
            <label
              htmlFor={`upload-${fieldName}`}
              className="bg-emerald-50 text-emerald-600 px-4 py-3.5 rounded-2xl font-bold hover:bg-emerald-100 transition-all cursor-pointer flex items-center gap-2"
            >
              {uploadingField === fieldName ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Upload size={20} />
              )}
              Upload
            </label>
          </div>
        </div>
        {fieldValue && typeof fieldValue === "string" && (
          <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-100">
            {fieldValue.match(/\.(mp4|webm|ogg)$/) ? (
              <video
                src={fieldValue}
                className="h-20 w-auto rounded-lg"
                controls
                muted
              />
            ) : (
              <img
                src={fieldValue}
                alt="Preview"
                className="h-20 w-auto rounded-lg object-cover"
              />
            )}
          </div>
        )}
      </div>
    );
  };

  const BilingualInput = ({
    label,
    fieldBase,
    type = "text",
  }: {
    label: string;
    fieldBase: string;
    type?: "text" | "textarea";
  }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            {label} (EN)
          </label>
          {type === "textarea" ? (
            <textarea
              value={getNestedValue(content, `${fieldBase}_en`) || ""}
              onChange={(e) => updateContent(`${fieldBase}_en`, e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          ) : (
            <input
              type="text"
              value={getNestedValue(content, `${fieldBase}_en`) || ""}
              onChange={(e) => updateContent(`${fieldBase}_en`, e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          )}
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
            {label} (ES)
          </label>
          {type === "textarea" ? (
            <textarea
              value={getNestedValue(content, `${fieldBase}_es`) || ""}
              onChange={(e) => updateContent(`${fieldBase}_es`, e.target.value)}
              rows={3}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          ) : (
            <input
              type="text"
              value={getNestedValue(content, `${fieldBase}_es`) || ""}
              onChange={(e) => updateContent(`${fieldBase}_es`, e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
            />
          )}
        </div>
      </div>
    );
  };

  const renderEditorFields = () => {
    switch (section.type) {
      case "hero": {
        const heroContent = content as HeroContent;
        return (
          <>
            <BilingualInput label="Badge" fieldBase="badge" />
            <BilingualInput label="Title" fieldBase="title" />
            <BilingualInput
              label="Subtitle"
              fieldBase="subtitle"
              type="textarea"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput label="CTA Text" fieldBase="cta" />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  CTA Link
                </label>
                <input
                  type="text"
                  value={heroContent.cta_to || ""}
                  onChange={(e) => updateContent("cta_to", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="/contact"
                />
              </div>
            </div>
            <MediaInput label="Background Video" fieldName="video_url" />
            <MediaInput label="Poster/Fallback Image" fieldName="poster_url" />
          </>
        );
      }

      case "why-us": {
        const whyUsContent = content as WhyUsContent;
        return (
          <>
            <BilingualInput label="Badge" fieldBase="badge" />
            <BilingualInput label="Title" fieldBase="title" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  Stats Count
                </label>
                <input
                  type="text"
                  value={whyUsContent.stats_count || ""}
                  onChange={(e) => updateContent("stats_count", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 outline-none placeholder:text-slate-300"
                  placeholder="e.g. 1k+"
                />
              </div>
              <BilingualInput label="Stats Label" fieldBase="stats_label" />
            </div>
            <MediaInput label="Side Image" fieldName="image_url" />

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h6 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                  Points List
                </h6>
                <button
                  onClick={() => {
                    const points = [
                      ...((content as WhyUsContent).points || []),
                    ];
                    points.push({
                      title_en: "",
                      title_es: "",
                      desc_en: "",
                      desc_es: "",
                    });
                    updateContent("points", points);
                  }}
                  className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Add Point
                </button>
              </div>
              {((content as WhyUsContent).points || []).map(
                (p, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group"
                  >
                    <button
                      onClick={() => {
                        const points = (content as WhyUsContent).points.filter(
                          (_, i: number) => i !== idx,
                        );
                        updateContent("points", points);
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 border border-slate-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Title (EN)"
                        value={p.title_en}
                        onChange={(e) => {
                          const points = [...(content as WhyUsContent).points];
                          points[idx].title_en = e.target.value;
                          updateContent("points", points);
                        }}
                        className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="text"
                        placeholder="Title (ES)"
                        value={p.title_es}
                        onChange={(e) => {
                          const points = [...(content as WhyUsContent).points];
                          points[idx].title_es = e.target.value;
                          updateContent("points", points);
                        }}
                        className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </>
        );
      }
      case "values": {
        const values = content as ValuesContent;
        return (
          <div className="space-y-12">
            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
              <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Mission Section
              </h5>
              <BilingualInput label="Mission Title" fieldBase="mission.title" />
              <BilingualInput
                label="Mission Content"
                fieldBase="mission.content"
                type="textarea"
              />
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
              <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Promise Section
              </h5>
              <BilingualInput label="Promise Title" fieldBase="promise.title" />
              <BilingualInput
                label="Promise Content"
                fieldBase="promise.content"
                type="textarea"
              />
            </div>

            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
              <h5 className="font-black text-slate-900 uppercase tracking-widest text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                Team Value Section
              </h5>
              <BilingualInput label="Team Title" fieldBase="team.title" />
              <BilingualInput
                label="Team Content"
                fieldBase="team.content"
                type="textarea"
              />
            </div>
          </div>
        );
      }

      case "cta": {
        const cta = content as CTAContent;
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                Style Variant
              </label>
              <select
                value={cta.variant || "light"}
                onChange={(e) => updateContent("variant", e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none appearance-none"
              >
                <option value="light">Light (White Background)</option>
                <option value="dark">Dark (Slate Background)</option>
                <option value="emerald">Emerald (Green Background)</option>
              </select>
            </div>
            <BilingualInput label="Title" fieldBase="title" />
            <BilingualInput
              label="Subtitle"
              fieldBase="subtitle"
              type="textarea"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BilingualInput label="Button Text" fieldBase="button" />
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                  Button Link
                </label>
                <input
                  type="text"
                  value={cta.button_to || ""}
                  onChange={(e) => updateContent("button_to", e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                  placeholder="/contact or /services"
                />
              </div>
            </div>
          </div>
        );
      }

      case "testimonial": {
        const testimonial = content as TestimonialContent;
        return (
          <div className="space-y-6">
            <BilingualInput
              label="Quote"
              fieldBase="quote"
              type="textarea"
            />
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                Author Name
              </label>
              <input
                type="text"
                value={testimonial.author || ""}
                onChange={(e) => updateContent("author", e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5 font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
            <BilingualInput label="Location / Subtitle" fieldBase="location" />
          </div>
        );
      }

      case "trust-badges": {
        const trust = content as TrustBadgesContent;
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h6 className="font-black text-slate-950 text-xs uppercase tracking-widest">
                Credibility Badges
              </h6>
              <button
                onClick={() => {
                  const badges = [...(trust.badges || [])];
                  badges.push({ text_en: "", text_es: "", icon: "check" });
                  updateContent("badges", badges);
                }}
                className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:underline"
              >
                <Plus size={14} /> Add Badge
              </button>
            </div>
            <div className="space-y-4">
              {(trust.badges || []).map((badge, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-4 relative group"
                >
                  <button
                    onClick={() => {
                      const badges = trust.badges.filter((_, i) => i !== idx);
                      updateContent("badges", badges);
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 border border-slate-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">
                        Icon
                      </label>
                      <select
                        value={badge.icon}
                        onChange={(e) => {
                          const badges = [...trust.badges];
                          badges[idx].icon = e.target.value as any;
                          updateContent("badges", badges);
                        }}
                        className="w-full bg-white border border-slate-100 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                      >
                        <option value="check">Check Circle</option>
                        <option value="star">Star</option>
                      </select>
                    </div>
                    <BilingualInput
                      label="Badge Text"
                      fieldBase={`badges[${idx}].text`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }

      case "featured-services": {
        const featured = content as FeaturedServicesContent;
        return (
          <div className="space-y-6">
            <BilingualInput label="Badge" fieldBase="badge" />
            <BilingualInput label="Title" fieldBase="title" />
            <BilingualInput label="View All Link Text" fieldBase="viewAll" />
          </div>
        );
      }

      case "story":
        return (
          <>
            <BilingualInput label="Badge" fieldBase="badge" />
            <BilingualInput label="Title" fieldBase="title" />
            <BilingualInput
              label="Main Content"
              fieldBase="content"
              type="textarea"
            />
            <BilingualInput
              label="Featured Quote"
              fieldBase="quote"
              type="textarea"
            />
            <MediaInput label="Story Image" fieldName="image_url" />
          </>
        );

      case "team":
        return (
          <>
            <BilingualInput label="Badge" fieldBase="badge" />
            <BilingualInput label="Title" fieldBase="title" />
            <BilingualInput
              label="Intro Description"
              fieldBase="description"
              type="textarea"
            />

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h6 className="font-black text-slate-900 text-sm uppercase tracking-widest">
                  Team Members
                </h6>
                <button
                  onClick={() => {
                    const members = [
                      ...((content as TeamContent).members || []),
                    ];
                    members.push({
                      name: "",
                      role_en: "",
                      role_es: "",
                      img: "",
                    });
                    updateContent("members", members);
                  }}
                  className="text-emerald-600 font-bold text-xs flex items-center gap-1 hover:underline"
                >
                  <Plus size={14} /> Add Member
                </button>
              </div>
              {((content as TeamContent).members || []).map(
                (m, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-slate-50 rounded-2xl space-y-3 relative group border border-slate-100"
                  >
                    <button
                      onClick={() => {
                        const members = (content as TeamContent).members.filter(
                          (_, i: number) => i !== idx,
                        );
                        updateContent("members", members);
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-white text-red-500 border border-slate-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Name"
                        value={m.name}
                        onChange={(e) => {
                          const members = [...(content as TeamContent).members];
                          members[idx].name = e.target.value;
                          updateContent("members", members);
                        }}
                        className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Role (EN)"
                        value={m.role_en}
                        onChange={(e) => {
                          const members = [...(content as TeamContent).members];
                          members[idx].role_en = e.target.value;
                          updateContent("members", members);
                        }}
                        className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Role (ES)"
                        value={m.role_es}
                        onChange={(e) => {
                          const members = [...(content as TeamContent).members];
                          members[idx].role_es = e.target.value;
                          updateContent("members", members);
                        }}
                        className="bg-white border border-slate-100 rounded-xl px-3 py-2 text-sm font-bold outline-none"
                      />
                    </div>
                    <MediaInput
                      label="Member Photo"
                      fieldName={`member_img_${idx}`}
                    />
                  </div>
                ),
              )}
            </div>
          </>
        );

      default:
        return (
          <div className="p-12 text-center text-slate-400">
            Editor for "{section.type}" coming soon. You can still save order
            and status.
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100">
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-2 inline-block">
              {section.type} Editor
            </span>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              Edit Section Content
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-600 rounded-2xl transition-all shadow-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form area */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          {renderEditorFields()}
        </div>

        {/* Footer */}
        <div className="px-10 py-6 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3.5 text-slate-500 font-bold hover:text-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Save size={20} />
            )}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default CMSSectionEditor;
