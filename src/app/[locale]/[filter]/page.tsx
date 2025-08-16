import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductCard from "@/components/shared/productCard";
import ProductControl from "@/components/shared/productControl";
import ProductWrapper from "@/components/shared/productWrapper";
import { notFound } from "next/navigation";
import { FC, use } from "react"

type RugsPageProps ={
  params:Promise<{filter:string}>
}

const VALID_FILTERS = ["all-rugs", "rugs-in-stock", "new-rugs"] as const;
type FilterType = typeof VALID_FILTERS[number];


const RugsPage:FC<RugsPageProps> = ({params}) => {
  const filter = use(params).filter


  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/image1.png",
    "rugs-in-stock": "/static/image2.png",
    "new-rugs": "/static/image3.png",
  }

  const title = filter.toLocaleUpperCase().replace("-", " ");

  const sampleProducts = [
  {
    id: 1,
    name: "ASTRA WHITE - STONE - NOUGAT",
    price: 1390.00,
    images: ["/static/product/image.png", "/static/product/image2.png", "/static/product/image3.png"],
    color: "BEYAZ",
    style: "ABSTRACT",
    collection: "AMORPH"
  },
  {
    id: 2,
    name: "BARON BEIGE - NOUGAT - GOLD",
    price: 890.00,
    images: ["/static/product/image.png", "/static/product/image2.png", "/static/product/image3.png"],
    color: "BEIGE",
    style: "CLASSIC",
    collection: "CORAL"
  },
  {
    id: 3,
    name: "BARON ICE BLUE - MINT",
    price: 890.00,
    images: ["/static/product/image.png", "/static/product/image2.png", "/static/product/image3.png"],
    color: "BLUE",
    style: "ETHNIC",
    collection: "ETHNIQUE"
  },
  {
    id: 4,
    name: "BLAST DARK BEIGE",
    price: 815.00,
    images: ["/static/product/image.png", "/static/product/image2.png", "/static/product/image3.png"],
    color: "BEIGE",
    style: "AMORPHOUS",
    collection: "MARQUISE"
  },
  {
    id: 5,
    name: "BLAST LIGHT GREY",
    price: 815.00,
    images: ["/static/product/image.png", "/static/product/image2.png", "/static/product/image3.png"],
    color: "ÇOK RENKLİ",
    style: "ART",
    collection: "MONOCHROME"
  },
  {
    id: 6,
    name: "BLAST WHITE - GOLD",
    price: 815.00,
    images: ["/static/product/image.png", "/static/product/image2.png", "/static/product/image3.png"],
    color: "BEYAZ",
    style: "ABSTRACT",
    collection: "AMORPH"
  }
];

  return (
    <div className="flex flex-col">
      <Banner title={title} image={images[filter]} />
      <ProductControl  />
      <ProductWrapper>
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductWrapper>
      <Footer/>
    </div>
  )
}

export default RugsPage


export async function generateStaticParams() {
  return VALID_FILTERS.map((filter) => ({ filter }))
}