import FilterProduct from '@/components/shared/filterProduct'
import Banner from '@/components/shared/banner'
import Footer from '@/components/shared/footer'
import ProductControl from '@/components/shared/productControl'
import { Locale, localeConfig } from '@/localization/config'
import { FC, Suspense, use } from 'react'
import { RugProduct } from '@/types/product'

type FilteredRugsProps = {
  params: Promise<{ locale: Locale, filter:"color" | "style" | "collection", slug: string }>
  searchParams: Promise<Record<string, string>>
}

const FilteredRugs: FC<FilteredRugsProps> = ({ params, searchParams }) => {

  const queryParams = use(params)
  const urlSearchParams = use(searchParams)
  const filter = queryParams.filter
  const slug = queryParams.slug


  const data = use(import("@/context/data.json").then((module) => module.default)) as RugProduct[]

  return (
    <div>
      <Banner filter={decodeURIComponent(filter)} image={"/static/image1.png"} />
            <Suspense fallback={null}>
              <ProductControl />
            </Suspense>
      <FilterProduct searchParams={urlSearchParams} allProducts={data} filter={filter} slug={slug} limit={12}/>
      <Footer />
    </div>
  )
}

export default FilteredRugs


export const generateStaticParams = async () => {
  const data = (await import("@/context/data.json")).default as RugProduct[];

  const paramsSet = new Set<string>();
  const params: { filter: string; slug: string }[] = [];

  localeConfig.locales.map((locale) => {
      data.forEach((rug) => {
    const entries: [string, string | string[]][] = [
      ["color", rug.color[locale]],
      ["style", rug.style[locale]],
      ["collection", rug.collection[locale]],
    ];

    entries.forEach(([filter, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          const key = `${filter}-${v}`;
          if (!paramsSet.has(key)) {
            paramsSet.add(key);
            params.push({ filter, slug: v });
          }
        });
      } else if (value) {
        const key = `${filter}-${value}`;
        if (!paramsSet.has(key)) {
          paramsSet.add(key);
          params.push({ filter, slug: value });
        }
      }
    });
  });
  })

  return params;
};
