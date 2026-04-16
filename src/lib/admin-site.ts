import type { Locale } from "@/i18n/admin/routing";
import { routing } from "@/i18n/admin/routing";

export const siteConfig = {
  // 실제 배포 도메인으로 교체하세요.
  baseUrl:
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://beauty-admin.example.com",
  defaultLocale: routing.defaultLocale,
  locales: routing.locales,
};

export function absoluteUrl(path = "/") {
  const base = siteConfig.baseUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

/** hreflang용 alternate language 맵 */
export function buildLanguageAlternates(pathWithoutLocale = "") {
  const normalized =
    pathWithoutLocale === "" || pathWithoutLocale === "/"
      ? ""
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;

  const languages: Record<string, string> = {};
  for (const locale of siteConfig.locales) {
    languages[locale] = absoluteUrl(`/${locale}${normalized}`);
  }
  languages["x-default"] = absoluteUrl(
    `/${siteConfig.defaultLocale}${normalized}`,
  );
  return languages;
}

export function localePath(locale: Locale, pathWithoutLocale = "") {
  const normalized =
    pathWithoutLocale === "" || pathWithoutLocale === "/"
      ? ""
      : pathWithoutLocale.startsWith("/")
        ? pathWithoutLocale
        : `/${pathWithoutLocale}`;
  return `/${locale}${normalized}`;
}
