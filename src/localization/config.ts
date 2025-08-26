export const localeConfig = {
  defaultLocale: "en",
  locales: ["en", "ru","tr"],
  cookieName: "NEXT_LANG",
  cookieMaxAge: 60 * 60 * 24 * 365,
  ignoredPaths: ["/image1.png", "/static", "api"],
} as const;

export type Locale = (typeof localeConfig)["locales"][number];
