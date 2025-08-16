import Banner from '@/components/shared/banner'
import Footer from '@/components/shared/footer'
import ProductCard from '@/components/shared/productCard'
import ProductControl from '@/components/shared/productControl'
import ProductWrapper from '@/components/shared/productWrapper'
import { Locale } from '@/localization/config'
import { FC, use } from 'react'

type FilteredRugsProps = {
  params: Promise<{ locale: Locale, filter: string, slug: string }>
  searchParams: Promise<Record<string, string>>
}

const FilteredRugs: FC<FilteredRugsProps> = ({ params, searchParams }) => {

  const queryParams = use(params)
  const grid = use(searchParams).grid

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
    <div>
      <Banner title={queryParams.slug.toLocaleUpperCase().replace("-", " ")} image={"/static/image1.png"} />
      <ProductControl />
      <ProductWrapper grid={grid}>
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ProductWrapper>
      <Footer />
    </div>
  )
}

export default FilteredRugs
