import "server-only";

import { Locale, localeConfig } from "./config";
import { cookies } from "next/headers";

export const dictionaries = {
  en: async () => {
    const dictModule = await import("./dictionary/en.json");
    return dictModule.default;
  },
  uz: async () => {
    const dictModule = await import("./dictionary/uz.json");
    return dictModule.default;
  },
  ru: async () => {
    const dictModule = await import("./dictionary/ru.json");
    return dictModule.default;
  },
};

export const getDictionary = async (locale?: Locale) => {
  let localeIn = locale;
  if (localeIn) return dictionaries[localeIn]?.();
  const cookieStore = await cookies();
  const cookieName = localeConfig.cookieName;
  const defaultLocale = localeConfig.defaultLocale;
  localeIn = cookieStore.get(cookieName)?.value as Locale;
  return (await dictionaries[localeIn]?.()) ?? dictionaries[defaultLocale]();
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;
