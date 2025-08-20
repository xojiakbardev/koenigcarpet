import RugColors from "@/components/pages/rugDetails/rugColors";
import RugDetails from "@/components/pages/rugDetails/rugDetails";
import RugImages from "@/components/pages/rugDetails/rugImages";
import RugSize from "@/components/pages/rugDetails/rugSizes";
import Banner from "@/components/shared/banner";
import { FC, use } from "react";

type ProductDetailsProps = {
  params: Promise<{ locale: Locale, rugId: string }>
};

const ProductDetails: FC<ProductDetailsProps> = ({ params }) => {
  const pathParams = use(params)
  const locale = pathParams.locale
  const rugId = pathParams.rugId
  const dictionary = use(getDictionary(locale))
  const data = use(import("@/context/data.json").then((module) => module.default)) as RugProduct[]
  const currentRug = data.find(rug => rug.id === Number(rugId))

  const relatedProducts = data.filter(rug => rug.product_name[locale].split(" ")[0] == currentRug?.product_name[locale].split(" ")[0])

  return (
    <>
      <Banner filter={currentRug ? dictionary.shared.rugDetail : dictionary.shared.notFound} image="/static/image1.png" />
      {currentRug ?
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 p-2">
            <RugImages rug={currentRug} locale={locale} relatedProducts={relatedProducts} />
          </div>
          <div className="flex-1 p-10">
            <div className="sticky top-16">
              <RugDetails rug={currentRug} locale={locale}/>
              <RugColors rugs={relatedProducts} locale={locale}/>
              <RugSize rug={currentRug} />
            </div>
          </div>
        </div> : null}
        <Footer/>
    </>
  )
}

export default ProductDetails



import type { Metadata } from "next";
import { RugProduct } from "@/types/product";
import { Locale } from "@/localization/config";
import { getDictionary } from "@/localization/dictionary";
import Footer from "@/components/shared/footer";

export async function generateMetadata({ params }: ProductDetailsProps): Promise<Metadata> {
  const pathParams = await params
  const locale = pathParams.locale
  const rugId = pathParams.rugId;
  const data = await import("@/context/data.json").then((module) => module.default) as RugProduct[]
  const rug = data.find(item => item.id === Number(rugId));

  if (!rug) {
    return {
      title: "Product Not Found | Carpet Store",
      description: "The requested rug could not be found.",
      keywords: "rug, carpet, product not found"
    };
  }

  const keywords = [
    rug.product_name,
    rug.collection,
    rug.style,
    rug.description,
    ...rug.features[locale].technical_info,
    ...rug.features[locale].care_and_warranty,
    ...rug.sizes
  ].join(", ");

  const ogImage = rug.images[0];

  const productName = rug.product_name[locale];
  const description = rug.description[locale];

  return {
    title: `${productName} | Carpet Store`,
    description: description,
    keywords: keywords,
    openGraph: {
      title: `${productName} | Carpet Store`,
      description: description,
      url: `https://carpet-store-lake.vercel.app/rugs/${rugId}`,
      siteName: "Carpet Store",
      images: [
        {
          url: `https://carpet-store-lake.vercel.app${ogImage}`,
          width: 1200,
          height: 630,
          alt: productName,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Carpet Store`,
      description: description,
      images: [`https://carpet-store-lake.vercel.app${ogImage}`],
    },
    alternates: {
      canonical: `https://carpet-store-lake.vercel.app/rugs/${rugId}`,
    },
  };
}


// export const generateStaticParams = async () => {
//   const data = await import("@/context/data.json").then((module) => module.default) as RugProduct[]
//   return data.map((rug) => ({ rugId: rug.id.toString() }))
// }

export const dynamic = "force-dynamic";