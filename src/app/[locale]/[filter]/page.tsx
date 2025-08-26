import FilterProduct from "@/components/shared/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, Suspense, use } from "react";
import { filterProducts } from "@/lib/filterProduct";
import { generateFilterData } from "@/lib/generateFilterData";
import data from "@/context/data.json";
import {Locale} from "@/localization/config"
import {getDictionary} from "@/localization/dictionary"
import { HOME_CATEGORIES } from "@/lib/const";
import { CloudCog } from "lucide-react";


type RugsPageProps = {
  params: Promise<{ filter: string, locale:Locale }>;
  searchParams: Promise<Record<string, string>>;
};

const VALID_FILTERS = [
  "all-rugs",
  "rugs-in-stock",
  "new-rugs",
  "runners",
  "marquise",
  "oriential",
  "amorph",
  "ethnique",
  "shell",
] as const;

type FilterType = (typeof VALID_FILTERS)[number];

const RugsPage: FC<RugsPageProps> = ({ params, searchParams }) => {
  const filter = use(params).filter;
  const urlSearchParams = use(searchParams);
  const pathParams = use(params)
  const dict = use(getDictionary())

  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/banner/all-rugs.png",
    "rugs-in-stock": "/static/banner/rugs-in-stock.png",
    "new-rugs": "/static/banner/new-rugs.jpg",
    runners: "/static/banner/runners.png",
    marquise: "/static/banner/marquise.png",
    oriential: "/static/banner/oriental.jpg",
    amorph: "/static/banner/amorph.png",
    ethnique: "/static/banner/ethnique.png",
    shell: "/static/banner/shell.png",
  };

  
const mergedSearchParams = {
  ...urlSearchParams,
  ...(filter !== "all-rugs" &&
    ["marquise", "oriental", "amorph", "ethnique", "shell"].includes(filter)
      ? { collection: filter }
      : {}),
};
  const filteredRugs = filterProducts(data, mergedSearchParams);
  
  
  const pageRaw = urlSearchParams.page;
  const perPageRaw = urlSearchParams.perPage;
  
  const perPage = Math.max(1, Math.min(parseInt(perPageRaw as string) || 12, 200));
  const currentPage = Math.max(1, parseInt(pageRaw as string) || 1);
  
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const displayedRugs = filteredRugs.slice(start, end);
  
  const filterData=generateFilterData(data, pathParams.locale, dict)
  const category = HOME_CATEGORIES[pathParams.locale].find((item)=>"/"+filter===item.path)

  return (
    <div className="flex flex-col">
      <Banner filter={category?.title?category.title:""} image={images[filter]} />
      <Suspense fallback={null}>
        <ProductControl />
      </Suspense>

      <FilterProduct
        searchParams={urlSearchParams}
        rugs={displayedRugs}
        perPage={12}
        rugsCount={filteredRugs.length}
        filterData={filterData}
      />

      <Footer />
    </div>
  );
};

export default RugsPage;

export const generateStaticParams = async () => {
  return VALID_FILTERS.map((filter) => ({ filter }));
};
