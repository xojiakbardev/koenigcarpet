import { Locale, localeConfig } from "@/localization/config";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";

export async function localeMiddleware(req: NextRequest) {
  const locales = localeConfig.locales;
  const ignoredPaths = localeConfig.ignoredPaths;
  const cookieName = localeConfig.cookieName;
  const cookieMaxAge = localeConfig.cookieMaxAge;
  const pathname = req.nextUrl.pathname;
  const search = req.nextUrl.search;

  if (locales.some((loc) => pathname.startsWith(`/${loc}`))||
      ignoredPaths.some((path) => pathname.startsWith(`/${path}`))) {
    return
  }


  const locale = getLocale(req);
  const response = NextResponse.redirect(
        new URL(`/${locale}${pathname}${search}`, req.url)
  );

  response.cookies.set(cookieName, locale, { path: "/", maxAge: cookieMaxAge });

  return response;
}

function getLocale(request: NextRequest): string {
  const cookiStore = request.cookies;
  const cookiName = localeConfig.cookieName;
  const cookieLang = cookiStore.get(cookiName)?.value as Locale;
  const locales = localeConfig.locales;
  const defaultLocale = localeConfig.defaultLocale;

  if (cookieLang && locales.includes(cookieLang)) {
    return cookieLang;
  }

  const headers = {
    "accept-language": request.headers.get("accept-language") ?? "",
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}
