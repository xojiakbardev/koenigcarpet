import FilterProduct from "@/components/shared/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, Suspense } from "react";
import { filterProducts } from "@/lib/filterProduct";
import { generateFilterData } from "@/lib/generateFilterData";
import { Locale } from "@/localization/config";
import { getDictionary } from "@/localization/dictionary";
import { RugProduct } from "@/types/product";

type RugsPageProps = {
  params: Promise<{ filter: string; locale: Locale }>;
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

const RugsPage: FC<RugsPageProps> = async ({ params, searchParams }) => {
  const pathParams = await params;
  const filter = pathParams.filter;
  const urlSearchParams = await searchParams;
  const dict = await getDictionary()

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const sortBy = urlSearchParams.sortBy;

  const data = await fetch(`${baseUrl}/api/products?sortBy=${sortBy}`, { cache: "no-store", headers: { "accept-language": pathParams.locale } }).then((res) => res.json()) as { products: RugProduct[] };

  let filteredRugs = filterProducts(data.products, mergedSearchParams);

  if (filter === "new-rugs") {
    filteredRugs = filteredRugs.filter((r) => r.isNew === true);
  }

  if (filter === "runners") {
    filteredRugs = filteredRugs.filter((r) => r.isRunners === true);
  }

  if (filter === "rugs-in-stock") {
    filteredRugs = filteredRugs.filter((r) => r.inStock === true);
  }

  const pageRaw = urlSearchParams.page;
  const perPageRaw = urlSearchParams.perPage;

  const perPage = Math.max(1, Math.min(parseInt(perPageRaw as string) || 24, 200));
  const currentPage = Math.max(1, parseInt(pageRaw as string) || 1);

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const displayedRugs = filteredRugs.slice(start, end);

  const filterData = generateFilterData(data.products, pathParams.locale, dict);
  const category = dict.home.categories.find((item) => "/" + filter === item.path);

  if (!category) {
    return notFound();
  }

  if (displayedRugs.length === 0) {
    return notFound();
  }

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
