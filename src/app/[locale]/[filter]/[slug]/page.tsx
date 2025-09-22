import FilterProduct from '@/components/shared/filterProduct'
import Banner from '@/components/shared/banner'
import Footer from '@/components/shared/footer'
import ProductControl from '@/components/shared/productControl'
import { Locale, localeConfig } from '@/localization/config'
import { FC, Suspense, use } from 'react'
import { RugProduct } from '@/types/product'
import { filterProducts } from "@/lib/filterProduct";
import { generateFilterData } from "@/lib/generateFilterData";
import { getDictionary } from "@/localization/dictionary"
import { SideBarItem } from '@/types/sidebar'


type FilteredRugsProps = {
  params: Promise<{ locale: Locale, filter: "color" | "style" | "collection", slug: string }>
  searchParams: Promise<Record<string, string>>
}

const FilteredRugs: FC<FilteredRugsProps> = ({ params, searchParams }) => {

  const urlSearchParams = use(searchParams);
  const pathParams = use(params)
  const dict = use(getDictionary())
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const data = use(fetch(`${baseUrl}/api/products`, { cache: "no-store", headers: { "accept-language": pathParams.locale } }).then((res) => res.json())
  ) as { products: RugProduct[] };

  const filteredRugs = filterProducts(data.products, urlSearchParams, pathParams.filter, pathParams.slug);


  const pageRaw = urlSearchParams.page;
  const perPageRaw = urlSearchParams.perPage;

  const perPage = Math.max(1, Math.min(parseInt(perPageRaw as string) || 12, 200));
  const currentPage = Math.max(1, parseInt(pageRaw as string) || 1);

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const displayedRugs = filteredRugs.slice(start, end);

  const filterData = generateFilterData(data.products, pathParams.locale, dict)

  const filterType = findItem(dict.shared.sideBarLinks, pathParams.filter);
  const value = findItem(filterType?.children as SideBarItem[], pathParams.slug);
  return (
    <div>
      <Banner filter={value?.title || ""} image={"/static/image1.png"} />
      <Suspense fallback={null}>
        <ProductControl />
      </Suspense>

      <FilterProduct
        searchParams={urlSearchParams}
        rugs={displayedRugs}
        rugsCount={filteredRugs.length}
        filterData={filterData}

      />
      <Footer />
    </div>
  )
}

export default FilteredRugs


export const generateStaticParams = async () => {

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const data = use(fetch(`${baseUrl}/api/products`, { cache: "no-store" }).then((res) => res.json())
  ) as { products: RugProduct[] };

  const paramsSet = new Set<string>();
  const params: { filter: string; slug: string }[] = [];

  localeConfig.locales.map((locale) => {
    data.products.forEach((rug) => {
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


function findItem(items: SideBarItem[], param: string): SideBarItem | null {
  for (const item of items) {
    if (item.path === "/" + param.toLowerCase()) {
      return item;
    }
    if (item.value?.toLowerCase() === param.toLowerCase()) {
      return item;
    }
    if (item.children) {
      const found = findItem(item.children, param);
      if (found) return found;
    }
  }
  return null;
}