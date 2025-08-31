import FilterProduct from "@/components/shared/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, Suspense, use } from "react";
import { filterProducts } from "@/lib/filterProduct";
import { generateFilterData } from "@/lib/generateFilterData";
import { Locale } from "@/localization/config"
import { getDictionary } from "@/localization/dictionary"
import { RugProduct } from "@/types/product";


type RugsPageProps = {
  params: Promise<{ filter: string, locale: Locale }>;
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
    oriential: "/static/banner/oriential.jpg",
    amorph: "/static/banner/amorph.png",
    ethnique: "/static/banner/ethnique.png",
    shell: "/static/banner/shell.png",
  };


  const mergedSearchParams = {
    ...urlSearchParams,
    ...(filter !== "all-rugs" &&
      ["marquise", "oriential", "amorph", "ethnique", "shell"].includes(filter)
      ? { collection: filter }
      : {}),
  };

  const data = use(import("@/context/data.json").then((m) => m.default)) as RugProduct[];

  let filteredRugs = filterProducts(data, mergedSearchParams);

  if (filter === "new-rugs") {
    filteredRugs = filteredRugs.filter((r) => r.isNew === true);
  }

  if (filter === "runners") {
    filteredRugs = filteredRugs.filter((r) => r.isRunners === true);
  }
  console.log(filteredRugs)

  if (filter === "rugs-in-stock") {
    filteredRugs = filteredRugs.filter((r) => r.inStock === true);
  }


  const pageRaw = urlSearchParams.page;
  const perPageRaw = urlSearchParams.perPage;

  const perPage = Math.max(1, Math.min(parseInt(perPageRaw as string) || 12, 200));
  const currentPage = Math.max(1, parseInt(pageRaw as string) || 1);

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const displayedRugs = filteredRugs.slice(start, end);

  const filterData = generateFilterData(data, pathParams.locale, dict)
  const category = dict.home.categories.find((item) => "/" + filter === item.path)

  return (
    <div className="flex flex-col">
      <Banner filter={category?.title ? category.title : ""} image={images[filter]} />
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
  );
};

export default RugsPage;

export const generateStaticParams = async () => {
  return VALID_FILTERS.map((filter) => ({ filter }));
};
