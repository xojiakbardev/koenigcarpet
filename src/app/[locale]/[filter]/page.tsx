import FilterProduct from "@/components/shared/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, Suspense, use } from "react";
import { RugProduct } from "@/types/product";
import { filterProducts } from "@/lib/filterProduct";

type RugsPageProps = {
  params: Promise<{ filter: string }>;
  searchParams: Promise<Record<string, string>>;
};

const VALID_FILTERS = [
  "all-rugs",
  "rugs-in-stock",
  "new-rugs",
  "runners",
  "marquise",
  "oriental",
  "amorph",
  "ethnique",
  "shell",
] as const;

type FilterType = (typeof VALID_FILTERS)[number];

const RugsPage: FC<RugsPageProps> = ({ params, searchParams }) => {
  const filter = use(params).filter;
  const urlSearchParams = use(searchParams);

  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/banner/all-rugs.png",
    "rugs-in-stock": "/static/banner/rugs-in-stock.png",
    "new-rugs": "/static/banner/new-rugs.jpg",
    runners: "/static/banner/runners.png",
    marquise: "/static/banner/marquise.png",
    oriental: "/static/banner/oriental.jpg",
    amorph: "/static/banner/amorph.png",
    ethnique: "/static/banner/ethnique.png",
    shell: "/static/banner/shell.png",
  };

  const limit = 12;
  const data = use(
    import("@/context/data.json").then((module) => module.default)
  ) as RugProduct[];

  // filterga qarab kerakli filter object yasaymiz
  let filters: Record<string, string | string[]> = {};

  switch (filter) {
    case "all-rugs":
      filters = {};
      break;
    case "rugs-in-stock":
      filters = { inStock: ["IN_STOCK"] };
      break;
    case "new-rugs":
      filters = { tag: ["new"] }; 
      break;
    case "runners":
      filters = { category: ["runner"] };
      break;
    case "marquise":
    case "oriental":
    case "amorph":
    case "ethnique":
    case "shell":
      filters = { collection: [filter] };
      break;
    default:
      filters = {};
  }

  const filteredRugs = filterProducts(data, filters);
  const rugs = filteredRugs.slice(0, 20)

  return (
    <div className="flex flex-col">
      <Banner filter={filter} image={images[filter]} />
      <Suspense fallback={null}>
        <ProductControl />
      </Suspense>
      <FilterProduct
        searchParams={urlSearchParams}
        allProducts={rugs}
        limit={limit}
      />
      <Footer />
    </div>
  );
};

export default RugsPage;

export const generateStaticParams = async () => {
  return VALID_FILTERS.map((filter) => ({ filter }));
};
