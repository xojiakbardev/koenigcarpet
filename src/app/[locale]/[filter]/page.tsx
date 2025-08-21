import FilterProduct from "@/components/shared/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, use } from "react";
import { RugProduct } from "@/types/product";

type RugsPageProps = {
  params: Promise<{ filter: string }>
  searchParams: Promise<Record<string, string>>
};

const VALID_FILTERS = ["all-rugs", "rugs-in-stock", "new-rugs", "runners"] as const;
type FilterType = typeof VALID_FILTERS[number];

const RugsPage: FC<RugsPageProps> = ({ params, searchParams }) => {
  const filter = use(params).filter;
  const urlSearchParams = use(searchParams);

  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/image1.png",
    "rugs-in-stock": "/static/image2.png",
    "new-rugs": "/static/image3.png",
    "runners": "/static/image4.png",
  };

  const limit = 12;
  const data = use(import("@/context/data.json").then((module) => module.default)) as RugProduct[];


  return (
    <div className="flex flex-col">
      <Banner filter={filter} image={images[filter]} />
      <ProductControl searchParams={urlSearchParams}/>
      <FilterProduct
        searchParams={urlSearchParams}
        allProducts={data}
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
