import RugColors from "@/components/pages/rugDetails/rugColors";
import RugDetails from "@/components/pages/rugDetails/rugDetails";
import RugImages from "@/components/pages/rugDetails/rugImages";
import RugSize from "@/components/pages/rugDetails/rugSizes";
import Banner from "@/components/shared/banner";
import data from "@/context/data.json";
import { FC, use } from "react";

type ProductDetailsProps = {
  params: Promise<{ rugName: string }>
};

const ProductDetails: FC<ProductDetailsProps> = ({ params }) => {
  const rugName = decodeURIComponent(use(params).rugName)
  const currentRug = data.find(rug => rug.name === rugName)


  return (
    <>
      <Banner filter={currentRug ? currentRug.name : "Product not found"} image="/static/image1.png" />
      {currentRug ?
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-2/5">
            <RugImages rug={currentRug} />
          </div>
          <div className="flex-1 p-10">
            <div className="sticky top-16">
              <RugDetails rug={currentRug}/>
              <RugColors rug={currentRug} />
              <RugSize rug={currentRug} />
            </div>
          </div>
        </div> : null}
    </>
  )
}

export default ProductDetails
