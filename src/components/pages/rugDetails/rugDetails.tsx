import { RugProduct } from "@/types/product";
import { FC } from "react";
import { Heart } from "lucide-react";

type Props = {
  rug: RugProduct;
};

const RugDetails: FC<Props> = ({ rug }) => {
  const title = `${rug.collection.toUpperCase()} ${rug.colors[0]?.name.toUpperCase()} - ${rug.name.toUpperCase()}`;
  const stockCode = `(${rug.stock_code})`;
  const pricePerM2 = `$${rug.sizes[0]?.price_per_m2.toFixed(2)}/m²`; 
  const description = rug.description;

  return (
    <div className="flex flex-col gap-4 pb-5 mb-5 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl uppercase">{title}</h1>
        <button className="cursor-pointer">
            <Heart className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      <p className="text-sm text-gray-600">{stockCode}</p>
      <p className="text-sm text-gray-700">Produced within 14 business days upon order.</p>
      <p className="text-2xl">{pricePerM2}</p>
      <p className="text-base text-gray-800 leading-relaxed">{description}</p>
    </div>
  );
};

export default RugDetails;