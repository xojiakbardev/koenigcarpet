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
  const { dictionary } = useDictionary();
  const { convert } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);

 
  const stockCode = rug.product_code || "N/A";
  const description = rug.description?.[locale] || "";
  const name = rug.product_name?.[locale] || "Unnamed Product";
  const features = rug.features?.[locale];
  const basePrice = useMemo(() => {
  if (!rug.price) return 0;

  if (typeof rug.price === "string") {
    const cleaned = rug.price.replace(/,/g, "").trim();
    return parseFloat(cleaned) || 0;
  }

  return Number(rug.price) || 0;
}, [rug.price]);

 
  const currentPriceRub = useMemo(() => {
    if (!basePrice || !rug.sizes?.length) {
      return null;
    }

    try {
      const sizeParam = searchParams?.get("size");
      const widthParam = searchParams?.get("width");
      const heightParam = searchParams?.get("height");

     
      let selectedSize = rug.sizes[0];

     
      if (sizeParam) {
        selectedSize = sizeParam;
      } else if (widthParam && heightParam) {
        selectedSize = `${widthParam}x${heightParam} cm`;
      }

      const calculatedPrice = calculateRugPrice(basePrice, rug.sizes, selectedSize);
      
     
      if (convert && typeof convert === 'function') {
        return convert(calculatedPrice);
      }
      
      return calculatedPrice;
    } catch (error) {
      console.error("Price calculation error:", error);
      return basePrice;
    }
  }, [basePrice, rug.sizes, searchParams, convert]);

 
  const formatPrice = (price: number | null): string => {
    if (price === null || price === 0) return "—";
    return new Intl.NumberFormat('ru-RU').format(price);
  };

 
  const hasFeatures = features && (
    features.head || 
    (features.care_and_warranty && features.care_and_warranty.length > 0) ||
    (features.technical_info && features.technical_info.length > 0)
  );

  return (
    <div className="flex flex-col gap-4 pb-4 mb-4 border-b">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl uppercase font-semibold">{name}</h1>
        <button 
          className="cursor-pointer hover:text-red-500 transition-colors"
          aria-label="Add to favorites"
        >
          <Heart className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-600">{stockCode}</p>
      
      <p className="text-sm text-gray-700">
        {dictionary?.shared?.produced || "Produced"}
      </p>

      <div className="text-base text-gray-800 leading-relaxed">
        <span className="font-medium">
          {formatPrice(currentPriceRub)}₽ - {basePrice}$
        </span>
      </div>

      {description && (
        <p className="text-base text-gray-800 leading-relaxed">{description}</p>
      )}

      {hasFeatures && (
        <div
          data-open={isOpen}
          className="group grid grid-rows-[auto_0fr] data-[open=true]:grid-rows-[auto_1fr] overflow-hidden transition-all duration-300"
        >
          <button
            className="flex justify-between items-center cursor-pointer w-full text-left py-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="features-content"
          >
            <h2 className="text-lg font-semibold">
              {dictionary?.shared?.features || "Features"}
            </h2>
            <ChevronDown 
              className="size-6 group-data-[open=true]:rotate-180 transition-transform duration-300 flex-shrink-0" 
            />
          </button>

          <div 
            id="features-content"
            className="min-h-0 overflow-hidden"
          >
            <div className="text-sm py-2">
              {features?.head && (
                <p className="mb-4">{features.head}</p>
              )}

              {features?.care_and_warranty && features.care_and_warranty.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 uppercase font-semibold text-sm">
                    {dictionary?.shared?.careAndWarranty || "Care and Warranty"}
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {features.care_and_warranty.map((item, index) => (
                      <li key={index} className="relative">
                        <span className="absolute -left-4 top-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {features?.technical_info && features.technical_info.length > 0 && (
                <div>
                  <h3 className="mb-2 uppercase font-semibold text-sm">
                    {dictionary?.shared?.technicalInfo || "Technical Info"}
                  </h3>
                  <ul className="space-y-1 ml-4">
                    {features.technical_info.map((item, index) => (
                      <li key={index} className="relative">
                        <span className="absolute -left-4 top-0">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RugDetails;