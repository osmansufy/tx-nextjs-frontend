import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en"],
  defaultLocale: "en",
  // Don't prefix URLs with /en/ — keeps URLs clean while structure supports future locales
  localePrefix: "as-needed",
});
