import "server-only";

import { Locale, localeConfig } from "./config";
import { cookies } from "next/headers";

export const dictionaries = Object.fromEntries(
  localeConfig.locales.map((lang) => [
    lang,
    async () => {
      const dictModule = await import(`./dictionary/${lang}.json`);
      return dictModule.default;
    },
  ])
);

export const getDictionary = async (locale?: Locale) => {
  let localeIn = locale;
  
  if (localeIn) return dictionaries[localeIn]?.();
  const cookieStore = await cookies();
  const cookieName = localeConfig.cookieName;
  const defaultLocale = localeConfig.defaultLocale;
  localeIn = cookieStore.get(cookieName)?.value as Locale;
  console.log(localeIn)
  return (await dictionaries[localeIn]?.()) ?? dictionaries[defaultLocale]();
};

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;
