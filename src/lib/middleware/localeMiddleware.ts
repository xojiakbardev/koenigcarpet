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

  // ❌ Ignored path bo‘lsa middleware ishlamasin
  if (ignoredPaths.some((path) => pathname.startsWith(`/${path}`))) {
    return NextResponse.next();
  }

  // ✅ Pathda locale bo‘lsa
  const pathLocale = locales.find((loc) => pathname.startsWith(`/${loc}`));
  if (pathLocale) {
    const res = NextResponse.next();
    res.cookies.set(cookieName, pathLocale, {
      path: "/",
      maxAge: cookieMaxAge,
    });
    return res;
  }

  // ✅ Agar pathda locale bo‘lmasa -> cookie yoki header’dan aniqlash
  const locale = getLocale(req);

  const response = NextResponse.redirect(
    new URL(`/${locale}${pathname}${search}`, req.url)
  );

  response.cookies.set(cookieName, locale, {
    path: "/",
    maxAge: cookieMaxAge,
  });

  return response;
}

function getLocale(request: NextRequest): string {
  const cookieStore = request.cookies;
  const cookieName = localeConfig.cookieName;
  const cookieLang = cookieStore.get(cookieName)?.value as Locale;
  const locales = localeConfig.locales;
  const defaultLocale = localeConfig.defaultLocale;

  // ✅ Avval cookie tekshiramiz
  if (cookieLang && locales.includes(cookieLang)) {
    return cookieLang;
  }

  // ✅ Keyin header accept-language orqali aniqlaymiz
  const headers = {
    "accept-language": request.headers.get("accept-language") ?? "",
  };
  const languages = new Negotiator({ headers }).languages();
  return match(languages, locales, defaultLocale);
}
