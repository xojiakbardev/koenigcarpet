"use client";

import { RugProduct } from "@/types/product";
import { FC, useState, useMemo } from "react";
import { ChevronDown, Heart } from "lucide-react";
import { Locale } from "@/localization/config";
import { useDictionary } from "@/hooks/useDictionary";
import { useSearchParams } from "next/navigation";
import { calculateRugPrice } from "@/lib/calculatePrice";
import { useCurrency } from "@/hooks/useCurrency";

type Props = {
  rug: RugProduct;
  locale: Locale;
};

export const RugDetails: FC<Props> = ({ rug, locale }) => {
  const searchParams = useSearchParams();
  const stockCode = rug.product_code;
  const description = rug.description?.[locale] ?? "";
  const name = rug.product_name?.[locale] ?? "";
  const features = rug.features?.[locale];
  const { dictionary } = useDictionary();
  const { convert } = useCurrency();

  const [open, setOpen] = useState(false);

  const currentPriceRub = useMemo(() => {
    const basePrice = Number(rug.price ?? 0);
    if (!basePrice || !rug.sizes?.length) return null;

    const sizeParam = searchParams.get("size");
    const widthParam = searchParams.get("width");
    const heightParam = searchParams.get("height");

    let selectedSize = rug.sizes[0]; 

    if (sizeParam) {
      selectedSize = sizeParam;
    } else if (widthParam && heightParam) {
      selectedSize = `${widthParam}x${heightParam} cm`;
    }

    const usdPrice = calculateRugPrice(basePrice, rug.sizes, selectedSize);
    const rubPrice = convert ? convert(usdPrice) : usdPrice;
    return rubPrice;
  }, [rug.price, rug.sizes, searchParams, convert]);

  const formattedRub = useMemo(() => {
    if (!currentPriceRub && currentPriceRub !== 0) return null;
    const rounded = Math.round(currentPriceRub as number);
    return new Intl.NumberFormat("ru-RU").format(rounded);
  }, [currentPriceRub]);

  return (
    <div className="flex flex-col gap-4 pb-4 mb-4 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl uppercase">{name}</h1>
        <button className="cursor-pointer">
          <Heart className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-600">{stockCode}</p>
      <p className="text-sm text-gray-700">{dictionary?.shared.produced}</p>

      <p className="text-base text-gray-800 leading-relaxed">
        {formattedRub ? `${formattedRub} ₽` : "—"} - 
         {rug.price}$
      </p>

      <p className="text-base text-gray-800 leading-relaxed">{description}</p>

      {features && (
        <div
          data-open={open}
          className="group grid grid-rows-[auto_0] data-[open=true]:grid-rows-[auto_1fr] overflow-hidden transition-all duration-300"
        >
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <h2 className="text-lg font-semibold mb-2">{dictionary?.shared.features}</h2>
            <button>
              <ChevronDown className="size-6 group-data-[open=true]:rotate-180 transition-all duration-300" />
            </button>
          </div>

          <div className="text-sm">
            <p>{features.head}</p>

            <h3 className="my-2 uppercase font-semibold">{dictionary?.shared.careAndWarranty}</h3>
            <ul className="list-none list-inside ml-5">
              {features.care_and_warranty?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <h3 className="my-2 uppercase font-semibold">{dictionary?.shared.technicalInfo}</h3>
            <ul className="list-none list-inside ml-5">
              {features.technical_info?.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default RugDetails;
