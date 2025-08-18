"use client";

import { RugProduct } from "@/types/product";
import { FC, useState } from "react";

type Props = {
  rug: RugProduct;
};

const RugSize: FC<Props> = ({ rug }) => {
  const [customWidth, setCustomWidth] = useState<number | "">("");
  const [customHeight, setCustomHeight] = useState<number | "">("");
  const [selectSizeType, setSelectSizeType] = useState<"standard" | "custom">("standard");
  const [selectSize, setSelectSize] = useState<RugProduct["sizes"][0]>();

  const sizes = rug.sizes || [];

  const avgPricePerM2 =
    sizes.length > 0
      ? sizes.reduce((acc, size) => acc + size.price_per_m2, 0) / sizes.length
      : 0;

  const calculateCustomPrice = () => {
    if (customWidth && customHeight) {
      const area = (customWidth / 100) * (customHeight / 100);
      const price = area * avgPricePerM2;
      setSelectSize({
        size: `${customWidth} x ${customHeight}`,
        price,
        price_per_m2: avgPricePerM2,
      });
    } else {
      setSelectSize(undefined);
    }
  };

  return (
    <div className="mt-6">
      <h2 className="mb-2">Sizes</h2>
      <div className="flex gap-4">
        <button
          data-selected={selectSizeType === "standard"}
          onClick={() => setSelectSizeType("standard")}
          className="border px-4 py-2 cursor-pointer transition
          data-[selected=true]:bg-black data-[selected=true]:text-white"
        >
          Standard Size
        </button>
        <button
          data-selected={selectSizeType === "custom"}
          onClick={() => setSelectSizeType("custom")}
          className="border px-4 py-2 cursor-pointer transition
          data-[selected=true]:bg-black data-[selected=true]:text-white"
        >
          Custom Size
        </button>
      </div>

      <div className="mt-4">
        {selectSizeType === "standard" && (
          <div className="w-full grid gap-2 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
            {sizes.map((size, i) => (
              <button
                key={i}
                data-selected={size.size === selectSize?.size}
                onClick={() => setSelectSize(size)}
                className="text-sm border px-4 py-2 cursor-pointer transition hover:bg-gray-100
                data-[selected=true]:bg-black data-[selected=true]:text-white"
              >
                {size.size} <br />
                <span className="text-sm text-gray-600">${size.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        )}

        {selectSizeType === "custom" && (
          <div className="mt-4 space-y-2">
            <input
              type="number"
              placeholder="Width (cm)"
              value={customWidth}
              onChange={(e) =>
                setCustomWidth(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-2 border"
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={customHeight}
              onChange={(e) =>
                setCustomHeight(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full p-2 border"
            />
            <button
              onClick={calculateCustomPrice}
              className="border border-black text-black w-full px-4 py-2 cursor-pointer hover:text-white hover:bg-black transition"
            >
              Calculate Price
            </button>
          </div>
        )}
      </div>

      {selectSize && (
        <div className="flex items-center justify-between flex-wrap mt-4 p-2 border bg-gray-50">
          <p className="font-medium text-gray-800">Selected Size: {selectSize.size}</p>
          <p className="text-gray-600">Price: ${selectSize.price.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default RugSize;
