import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { FC, use } from "react";
import { Locale, localeConfig } from "@/localization/config";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { getDictionary } from "@/localization/dictionary";
import Sidebar from "@/components/shared/sidebar";
import FilterDrawer from "@/components/shared/filterDrawer";
import NextTopLoader from "nextjs-toploader";
import { notFound } from "next/navigation";

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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="keywords" content={dictionary.meta.keywords.join(", ")} />
      </head>
      <body className={inter.className}>
        <LocaleProvider dictionary={dictionary}>
          {children}
          <Sidebar locale={locale} />
          <FilterDrawer />
        </LocaleProvider>
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
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale);

return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    openGraph: {
      title: dictionary.meta.openGraph.title ,
      description: dictionary.meta.openGraph.description ,
      url: `https://carpet-store-lake.vercel.app/${locale}`,
      siteName: "Carpet Store",
      images: [
        {
          url: dictionary.meta.openGraph.image,
          width: 1200,
          height: 630,
          alt: "Carpet Store",
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
      canonical: `https://carpet-store-lake.vercel.app/${locale}`,
      languages: {
        en: "https://carpet-store-lake.vercel.app/en",
        ru: "https://carpet-store-lake.vercel.app/ru",
        uz: "https://carpet-store-lake.vercel.app/uz",
      },
    },
  };
}