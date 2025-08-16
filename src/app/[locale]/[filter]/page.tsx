import FilterProduct from "@/components/pages/filter/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, use } from "react";

type RugsPageProps = {
  params: Promise<{ filter: string }>
  searchParams: Promise<Record<string, string>>
};

const VALID_FILTERS = ["all-rugs", "rugs-in-stock", "new-rugs"] as const;
type FilterType = typeof VALID_FILTERS[number];

const RugsPage: FC<RugsPageProps> = ({ params }) => {
  const filter = use(params).filter;

  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/image1.png",
    "rugs-in-stock": "/static/image2.png",
    "new-rugs": "/static/image3.png",
  };

  const title = filter.toLocaleUpperCase().replace("-", " ");

  const sampleProducts = [
    { id: 1, name: "ASTRA WHITE - STONE - NOUGAT", price: 1390, images: ["/static/product/image.png"], color: "BEYAZ", style: "ABSTRACT", collection: "AMORPH" },
    { id: 2, name: "BARON BEIGE - NOUGAT - GOLD", price: 890, images: ["/static/product/image.png"], color: "BEIGE", style: "CLASSIC", collection: "CORAL" },
    { id: 3, name: "BARON ICE BLUE - MINT", price: 1250, images: ["/static/product/image.png"], color: "BLUE", style: "ETHNIC", collection: "ETHNIQUE" },
    { id: 4, name: "BLAST DARK BEIGE", price: 815, images: ["/static/product/image.png"], color: "BEIGE", style: "AMORPHOUS", collection: "MARQUISE" },
    { id: 5, name: "NOVA MULTICOLOR DREAM", price: 1090, images: ["/static/product/image.png"], color: "ÇOK RENKLİ", style: "ART", collection: "MONOCHROME" },
    { id: 6, name: "BLAST WHITE - GOLD", price: 740, images: ["/static/product/image.png"], color: "BEYAZ", style: "ABSTRACT", collection: "AMORPH" },
    { id: 7, name: "EMERALD GREEN LUXE", price: 1650, images: ["/static/product/image.png"], color: "GREEN", style: "CLASSIC", collection: "CORAL" },
    { id: 8, name: "ONYX BLACK MODERN", price: 980, images: ["/static/product/image.png"], color: "BLACK", style: "MODERN", collection: "MONOCHROME" },
    { id: 9, name: "SUNSET ORANGE WAVE", price: 1320, images: ["/static/product/image.png"], color: "ORANGE", style: "ABSTRACT", collection: "MARQUISE" },
    { id: 10, name: "SKY BLUE HARMONY", price: 920, images: ["/static/product/image.png"], color: "BLUE", style: "MODERN", collection: "ETHNIQUE" },
  ];

  return (
    <div className="flex flex-col">
      <Banner title={title} image={images[filter]} />
      <ProductControl />
      <FilterProduct products={sampleProducts} />
      <Footer />
    </div>
  );

};

export default RugsPage;

// export async function generateStaticParams() {
//   return VALID_FILTERS.map((filter) => ({ filter }));
// }