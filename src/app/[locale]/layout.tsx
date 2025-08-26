import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { FC, Suspense, use } from "react";
import { Locale, localeConfig } from "@/localization/config";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { getDictionary } from "@/localization/dictionary";
import Sidebar from "@/components/shared/sidebar";
import FilterDrawer from "@/components/shared/filterDrawer";
import NextTopLoader from "nextjs-toploader";
import { notFound } from "next/navigation";
import LocaleSwitch from "@/components/shared/localeSwitch";
import { Analytics } from "@vercel/analytics/next";
import SearchComponent from "@/components/shared/searchComponent";

const inter = Inter({ subsets: ["latin"] });

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>;

const RootLayout: FC<RootLayoutProps> = ({ children, params }) => {
  const locale = use(params).locale;
  const dictionary = use(getDictionary(locale));

  if (!localeConfig.locales.includes(locale)) {
    return notFound();
  }

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <LocaleProvider dictionary={dictionary}>
          {children}
          <Sidebar locale={locale} />
          <Suspense fallback={null}>
            <FilterDrawer />
          </Suspense>
        </LocaleProvider>
        <LocaleSwitch locale={locale} />
        <SearchComponent locale={locale}/>
        <Analytics />
        <NextTopLoader color="#3563E9" height={4} showSpinner={false} />
      </body>
    </html>
  );
};

export default RootLayout;

export const generateStaticParams = async () => {
  const locales = localeConfig.locales;
  return locales.map((locale) => ({ locale }));
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const locale = (await params).locale;
  const dictionary = await getDictionary(locale);

  return {
    title: {
      default: dictionary.meta.title,
      template: `%s | Koenig Carpet`,
    },
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    icons: {
      icon: "/favicon.ico",
    },
    openGraph: {
      title: dictionary.meta.openGraph.title,
      description: dictionary.meta.openGraph.description,
      url: `https://www.koenigcarpet.ru/${locale}`,
      siteName: "Koenig Carpet",
      images: [
        {
          url: dictionary.meta.openGraph.image,
          width: 1200,
          height: 630,
          alt: "Koenig Carpet",
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: dictionary.meta.twitter.title,
      description: dictionary.meta.twitter.description,
      images: [dictionary.meta.twitter.image],
    },
    alternates: {
      canonical: `https://www.koenigcarpet.ru/${locale}`,
      languages: {
        en: "https://www.koenigcarpet.ru/en",
        ru: "https://www.koenigcarpet.ru/ru",
        uz: "https://www.koenigcarpet.ru/uz",
      },
    },
  };
}
