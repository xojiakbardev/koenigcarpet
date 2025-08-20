"use client";

import { RugProduct } from "@/types/product";
import { FC, useState } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { Locale } from "@/localization/config";
import { useDictionary } from "@/hooks/useDictionary";

type Props = {
  rug: RugProduct;
  locale: Locale
};


const RugDetails: FC<Props> = ({ rug, locale }) => {
  const stockCode = rug.product_code;
  const description = rug.description[locale];
  const name = rug.product_name[locale];
  const features = rug.features[locale];
  const {dictionary} = useDictionary()

  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 pb-5 mb-5 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl uppercase">{name}</h1>
        <button className="cursor-pointer">
          <Heart className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      <p className="text-sm text-gray-600">{stockCode}</p>
      <p className="text-sm text-gray-700">{dictionary?.shared.produced}</p>
      <p className="text-base text-gray-800 leading-relaxed">{rug.price}</p>
      <p className="text-base text-gray-800 leading-relaxed">{description}</p>

      <div data-open={open} className="group grid grid-rows-[auto_0] data-[open=true]:grid-rows-[auto_1fr] overflow-hidden transition-all duration-300">
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)} >
          <h2 className="text-lg font-semibold mb-2">{dictionary?.shared.features}</h2>
          <button >
            <ChevronDown className="size-6 group-data-[open=true]:rotate-180 transition-all duration-300" />
          </button>
        </div>

        <div>
          <p>{features.head}</p>
          <ul className="list-disc list-inside">
            {features.care_and_warranty.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          <ul className="list-disc list-inside">
            {features.technical_info.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RugDetails;