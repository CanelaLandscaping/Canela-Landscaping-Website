# Canela Landscaping — Coding Standards & Agent Instructions

This project is a **React + TypeScript + Vite** website for Canela Landscaping & Snow Plow, a family-owned landscaping business in Cleveland, Ohio. It uses **Tailwind CSS**, **Framer Motion**, **Supabase** (auth + database), and **i18next** for bilingual (EN/ES) support.

Read this file before making any code changes.

---

## 🗂 Project Structure

```
/
├── docs/               # Owner and developer documentation
├── public/             # Static assets (images, logo, favicon)
├── src/
│   ├── assets/         # Non-public static files (used in components)
│   ├── components/     # Reusable UI components (Navbar, Footer, ContactForm, etc.)
│   ├── config/         # App-wide constants (phone, email, location)
│   ├── context/        # React context providers (AuthProvider, AuthContext)
│   ├── data/           # Static data (services list, gallery assets)
│   ├── locales/        # i18n translation files (en.json, es.json)
│   ├── pages/          # Full page components (Home, Gallery, Contact, etc.)
│   ├── supabase/       # Supabase client and query functions
│   ├── App.tsx         # Root app with routing
│   └── main.tsx        # Entry point
├── supabase/
│   ├── functions/      # Supabase Edge Functions (Deno runtime)
│   └── migrations/     # Ordered SQL migration files
└── .agents/            # Agent instructions and coding standards (this file)
```

---

## ✅ Core Principles

1. **No magic strings** — use `src/config/constants.ts` for phone, email, and location values. Never hardcode them in components.
2. **All user-facing text goes through i18n** — use `t("key")` from `useTranslation()`. Never write raw English strings in JSX if they should be bilingual.
3. **Supabase queries live in `src/supabase/queries.ts`** — never import `supabase` directly from a component. Go through the query layer.
4. **TypeScript `strict` mode is on** — **DO NOT use the `any` type.** Avoid "Implicit Any" for parameters (e.g., in `filter` or `map` callbacks). Always define proper interfaces or use imported types for complex data.
5. **Always look for errors** — Before submitting, verify that your changes don't introduce new lint warnings or TypeScript errors. Proactively search for and fix type issues.
6. **No Duplicate Imports** — Always verify that refactored imports don't lead to redundant declarations at the top of the file.
7. **Never put secrets in source code** — all sensitive values must be in `.env` (which is gitignored).

---

## 🌐 Internationalization (i18n)

- All translation keys live in `src/locales/en.json` and `src/locales/es.json`.
- The structure must stay **in sync** — if you add a key to `en.json`, add the Spanish translation to `es.json` immediately.
- Use dot notation for nested keys: `contact.form.labels.email`.
- For JSX interpolation, use the `<Trans>` component.

```tsx
// ✅ Correct
const { t } = useTranslation();
<label>{t("contact.form.labels.name")}</label>

// ❌ Wrong — untranslatable or inconsistent terminology
<label>Full Name</label>
<label>Status Insight</label> // Use "Estado" in ES instead of literal "Insight"

- **Terminology Standardization**:
  - Prefer "Contactos" over "Leads" in Spanish.
  - Standard term for snow plowing: "Eliminación de Nieve".
- **Dynamic Content Priority**: When displaying items with bilingual fields (e.g., `name_en`, `name_es`), prioritize the field matching `i18n.language` in the primary UI position.
```

---

## 🎨 Styling (Tailwind CSS)

- **Use Tailwind utility classes** directly in JSX. Do not create custom CSS unless absolutely necessary.
- **Consistent design tokens**:
  - Primary brand color: `emerald-600`
  - Dark text: `slate-900` / `slate-700`
  - Muted text: `slate-500` / `slate-400`
  - Backgrounds: `slate-50`, `white`
  - Border radius: prefer `rounded-2xl` or `rounded-3xl` for cards/inputs
- **Responsive design is mandatory** — always include responsive prefixes (`md:`, `lg:`).
- **Animations** — use `framer-motion` for interactive animations. Do not use raw CSS `@keyframes` for entrance effects.
- **Sticky Offsets**: Standardized desktop sticky panels (sidebars, navs) should use `top-24`. Avoid arbitrary offsets like `top-32` unless required by layout constraints.

```tsx
// ✅ Correct — uses brand colors and responsive sizing
<button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold text-sm md:text-base">

// ❌ Wrong — uses a generic color and no hover state
<button className="bg-green-500 text-white p-2">
```

---

## 🔐 Auth & Protected Routes

- The `AuthProvider` in `src/context/AuthProvider.tsx` manages session state globally.
- Use the `useAuth()` hook to access `{ user, session, loading, signOut }`.
- Protected pages must be wrapped in `<ProtectedRoute>` in `App.tsx`.
- Admin routes live under `/admin/*`. Never show the main `<Navbar>` or `<Footer>` on admin pages (already handled in `App.tsx` via `isAdminPath`).

```tsx
// ✅ Adding a protected route
<Route path="/admin/settings" element={
  <ProtectedRoute>
    <AdminSettings />
  </ProtectedRoute>
} />
```

---

## 🗃 Supabase & Database

- All Supabase client initialization lives in `src/supabase/client.ts`. Do not call `createClient` elsewhere.
- All database interactions must go through functions in `src/supabase/queries.ts`.
- Always check `isSupabaseConfigured` before making a query — the site must work gracefully without Supabase configured (local dev with no `.env`).
- SQL migrations live in `supabase/migrations/` and are numbered sequentially: `001_...`, `002_...`.
- **Row Level Security (RLS) is always ON** — never disable it. Authenticated users can read; anonymous users can only insert contact forms.

```ts
// ✅ Correct — graceful degradation
export const getLeads = async (): Promise<Lead[]> => {
  if (!isSupabaseConfigured) return [];
  const { data, error } = await supabase.from('contact_submissions').select('*');
  if (error) throw error;
  return data ?? [];
};

// ❌ Wrong — will crash with no .env
const { data } = await supabase.from('contact_submissions').select('*');
```

---

## ⚡ Edge Functions

- Edge Functions live in `supabase/functions/<function-name>/index.ts` and run on the **Deno runtime**.
- Use `Deno.env.get()` to access secrets. **Never hardcode API keys**.
- Environment variables for Edge Functions are set in the **Supabase Dashboard** under Settings → API → Edge Function Secrets.
- CORS headers must always be set. Use the `corsHeaders` pattern already established in `send-contact-email/index.ts`.

---

## 📦 Component Guidelines

- **One component per file.** File name matches the component name (PascalCase).
- **Components stay in `src/components/`**, pages in `src/pages/`.
- **Pages should be thin** — move complex logic and UI into components.
- Keep components under ~200 lines. If a component is getting long, split it.
- Prop types must be defined inline using TypeScript interfaces, not `any` or `object`.

```tsx
// ✅ Correct
interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon }) => { ... };
```

---

## 🖼 Images & Assets

- All project photos live in `public/images/` as `.webp` files.
- Image file names must be **descriptive and lowercase with hyphens**: `lawn-mowing-cleveland-1.webp`.
- Always include a descriptive `alt` attribute with the service name and location for **SEO**.
- Use `loading="lazy"` on all images below the fold.
- Do not use placeholder services (e.g., `picsum.photos`) in production code.

```tsx
// ✅ Correct — SEO-friendly alt text
<img src="/images/mulch-installation-1.webp" alt="Mulch installation in Cleveland, Ohio backyard" loading="lazy" />

// ❌ Wrong
<img src="/images/mulch-1.webp" alt="image" />
```

---

## 🚀 Git & Deployment

- **Never commit `.env` files** — it is listed in `.gitignore`.
- The site auto-deploys to Vercel on every push to `main`.
- Environment variables for production are set in the **Vercel Dashboard** under Settings → Environment Variables.
- Run `npm run build` locally before pushing major changes to verify the production build succeeds.

### Branch strategy:
- `main` — production branch, auto-deploys to Vercel
- Feature branches — use descriptive names: `feature/phone-field-contact-form`

---

## 🧰 Available Scripts

```bash
npm run dev       # Start local dev server (http://localhost:5173)
npm run build     # Build production bundle
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

---

## 📝 Code Formatting

- **Use double quotes** for strings in JSX and TypeScript files.
- **Trailing commas** in multi-line objects and arrays.
- **No semicolon omission** — always use semicolons.
- Imports are ordered: React → third-party → local (types last).
- Run Prettier before committing (configuration is in the project root).

---

*Maintained for Canela Landscaping & Snow Plow — Cleveland, Ohio*
