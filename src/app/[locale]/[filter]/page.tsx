import Banner from "@/components/shared/banner";
import Footer from "@/components/shared/footer";
import { notFound } from "next/navigation";
import { FC, use } from "react"

type RugsPageProps ={
  params:Promise<{filter:string}>
}

const VALID_FILTERS = ["all-rugs", "rugs-in-stock", "new-rugs"] as const;
type FilterType = typeof VALID_FILTERS[number];


const RugsPage:FC<RugsPageProps> = ({params}) => {
  const filter = use(params).filter


  if (!VALID_FILTERS.includes(filter as FilterType)) {
    return notFound();
  }

  const images: Record<string, string> = {
    "all-rugs": "/static/image1.png",
    "rugs-in-stock": "/static/image2.png",
    "new-rugs": "/static/image3.png",
  }

  return (
    <div>
      <Banner title={filter.toLocaleUpperCase().replace("-", " ")} image={images[filter]} />
      <Footer/>
    </div>
  )
}

export default RugsPage


export async function generateStaticParams() {
  return VALID_FILTERS.map((filter) => ({ filter }))
}