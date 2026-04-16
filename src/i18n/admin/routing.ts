import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ko", "en"],
  defaultLocale: "ko",
  // URL은 항상 /ko, /en 으로 시작
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
