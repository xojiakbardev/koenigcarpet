"use client";

import { FC, useState } from "react";
import { RugProduct } from "@/types/product";
import { useDictionary } from "@/hooks/useDictionary";

const RugSize: FC<{ rug: RugProduct }> = ({ rug }) => {
  const [customWidth, setCustomWidth] = useState<number | "">("");
  const [customHeight, setCustomHeight] = useState<number | "">("");
  const [selectSizeType, setSelectSizeType] = useState<"standard" | "custom">("standard");
  const [selectSize, setSelectSize] = useState<string>();
  const {dictionary} = useDictionary()
  const sizes = rug.sizes || [];


  return (
    <div className="mt-6">
      <h2 className="mb-2 capitalize">{dictionary?.shared.sizes}</h2>
      <div className="flex gap-4">
        <button
          data-selected={selectSizeType === "standard"}
          onClick={() => setSelectSizeType("standard")}
          className="border px-4 py-2 cursor-pointer transition capitalize
          data-[selected=true]:bg-black data-[selected=true]:text-white"
        >
          {dictionary?.shared.standartSize}
        </button>
        <button
          data-selected={selectSizeType === "custom"}
          onClick={() => setSelectSizeType("custom")}
          className="border px-4 py-2 cursor-pointer transition capitalize
          data-[selected=true]:bg-black data-[selected=true]:text-white"
        >
          {dictionary?.shared.customSize}
        </button>
      </div>

      <div className="mt-4">
        {selectSizeType === "standard" && (
          <div className="w-full grid gap-2 grid-cols-[repeat(auto-fill,minmax(120px,1fr))]">
            {sizes.map((size, i) => (
              <button
                key={i}
                data-selected={size === selectSize}
                onClick={() => setSelectSize( size)}
                className="text-sm border px-4 py-2 cursor-pointer transition hover:bg-gray-100
                data-[selected=true]:bg-black data-[selected=true]:text-white"
              >
                {size} <br />
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
              className="border border-black text-black w-full capitalize px-4 py-2 cursor-pointer hover:text-white hover:bg-black transition"
            >
              {dictionary?.shared.calculatePrice}
            </button>
          </div>
        )}
      </div>

      {selectSize && (
        <div className="flex items-center justify-between flex-wrap mt-4 p-2 border bg-gray-50">
          <p className="font-medium text-gray-800">{dictionary?.shared.selectedPrice}: {selectSize}</p>
        </div>
      )}
    </div>
  );
};

export default RugSize;
