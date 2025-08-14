export const localeConfig = {
  defaultLocale: "uz",
  locales: ["en", "uz", "ru"],
  cookieName: "NEXT_LANG",
  cookieMaxAge: 60 * 60 * 24 * 365,
  ignoredPaths: ["image.png"],
} as const;

export type Locale = (typeof localeConfig)["locales"][number];
