import FilterProduct from "@/components/pages/filter/filterProduct";
import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import ProductControl from "@/components/shared/productControl";
import { notFound } from "next/navigation";
import { FC, use } from "react";
import data from  "@/context/data.json"

type RugsPageProps = {
  params: Promise<{ filter: string }>
  searchParams: Promise<Record<string, string>>
};

const VALID_FILTERS = ["all-rugs", "rugs-in-stock", "new-rugs"] as const;
type FilterType = typeof VALID_FILTERS[number];

const RugsPage: FC<RugsPageProps> = ({ params }) => {
  const filter = use(params).filter;

  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/image1.png",
    "rugs-in-stock": "/static/image2.png",
    "new-rugs": "/static/image3.png",
  };



  return (
    <div className="flex flex-col">
      <Banner filter={filter} image={images[filter]} />
      <ProductControl />
      <FilterProduct products={data} />
      <Footer />
    </div>
  );

};

export default RugsPage;

// export async function generateStaticParams() {
//   return VALID_FILTERS.map((filter) => ({ filter }));
// }