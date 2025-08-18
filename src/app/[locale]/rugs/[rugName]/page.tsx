import RugColors from "@/components/pages/rugDetails/rugColors";
import RugDetails from "@/components/pages/rugDetails/rugDetails";
import RugImages from "@/components/pages/rugDetails/rugImages";
import RugSize from "@/components/pages/rugDetails/rugSizes";
import Banner from "@/components/shared/banner";
import data from "@/context/data.json";
import { FC, use } from "react";

type ProductDetailsProps = {
  params: Promise<{ rugName: string }>
};

const ProductDetails: FC<ProductDetailsProps> = ({ params }) => {
  const rugName = decodeURIComponent(use(params).rugName)
  const currentRug = data.find(rug => rug.name === rugName)


  return (
    <>
      <Banner filter={currentRug ? currentRug.name : "Product not found"} image="/static/image1.png" />
      {currentRug ?
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/5">
            <RugImages rug={currentRug} />
          </div>
          <div className="flex-1 p-10">
            <div className="sticky top-16">
              <RugDetails rug={currentRug} />
              <RugColors rug={currentRug} />
              <RugSize rug={currentRug} />
            </div>
          </div>
        </div> : null}
    </>
  )
}

export default ProductDetails



import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ rugName: string }> }): Promise<Metadata> {
  const rugName = decodeURIComponent((await params).rugName);
  const rug = data.find(item => item.name === rugName);

  if (!rug) {
    return {
      title: "Product Not Found | Carpet Store",
      description: "The requested rug could not be found.",
      keywords: "rug, carpet, product not found"
    };
  }

  const keywords = [
    rug.name,
    rug.collection,
    rug.style,
    rug.description,
    ...rug.features,
    ...rug.technical_info.materials,
    ...rug.sizes.map(s => s.size)
  ].join(", ");

  const ogImage = rug.colors[0].images[0]

  return {
    title: `${rug.name} | Carpet Store`,
    description: rug.description,
    keywords: keywords,
    openGraph: {
      title: `${rug.name} | Carpet Store`,
      description: rug.description,
      url: `https://carpet-store.com/rugs/${rugName}`,
      siteName: "Carpet Store",
      images: [
        {
          url: `https://carpet-store.com${ogImage}`,
          width: 1200,
          height: 630,
          alt: rug.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${rug.name} | Carpet Store`,
      description: rug.description,
      images: [`https://carpet-store.com${ogImage}`],
    },
    alternates: {
      canonical: `https://carpet-store.com/rugs/${rugName}`,
    },
  };
}
