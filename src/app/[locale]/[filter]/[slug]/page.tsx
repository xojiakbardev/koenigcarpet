import FilterProduct from '@/components/shared/filterProduct'
import Banner from '@/components/shared/banner'
import Footer from '@/components/shared/footer'
import ProductControl from '@/components/shared/productControl'
import { Locale } from '@/localization/config'
import { FC, use } from 'react'
import { RugProduct } from '@/types/product'

type FilteredRugsProps = {
  params: Promise<{ locale: Locale, filter:"color" | "style" | "collection", slug: string }>
  searchParams: Promise<Record<string, string>>
}

const FilteredRugs: FC<FilteredRugsProps> = ({ params }) => {

  const queryParams = use(params)
  const filter = queryParams.filter
  const slug = queryParams.slug


  const data = use(import("@/context/data.json").then((module) => module.default)) as RugProduct[]

  return (
    <div>
      <Banner filter={decodeURIComponent(filter)} image={"/static/image1.png"} />
      <ProductControl />
      <FilterProduct allProducts={data} filter={filter} slug={slug} limit={12}/>
      <Footer />
    </div>
  )
}

export default FilteredRugs
