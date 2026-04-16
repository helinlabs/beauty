# Create New Admin Page

Create a new page in the admin dashboard.

Usage: /new-admin-page [page-name]

Example: /new-admin-page analytics

Steps:
1. Create directory: `src/app/[locale]/(admin)/admin/[page-name]/`
2. Create page.tsx with:
   - Async params: `params: Promise<{ locale: string }>`
   - setRequestLocale for static rendering
   - Metadata generation
3. Add translations to `messages/ko.json` and `messages/en.json`
4. Add navigation item in `src/app/[locale]/(admin)/admin/layout.tsx`

Template for page.tsx:
```tsx
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export default async function PageName({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PageNamespace");

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Page content */}
    </div>
  );
}
```
