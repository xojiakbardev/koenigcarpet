"use client";

import { RugProduct } from "@/types/product";
import { FC, useState, useEffect, useMemo } from "react";
import { useDictionary } from "@/hooks/useDictionary";
import { useRouter, useSearchParams } from "next/navigation";

const parseSize = (sizeStr?: string | null): { w: number; h: number } | null => {
  if (!sizeStr) return null;
  const s = sizeStr.replace(/cm/gi, "").trim();
  const m = s.match(/(\d+(?:\.\d+)?)\s*[x×]\s*(\d+(?:\.\d+)?)/i);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0) return null;
  return { w, h };
};

const RugSize: FC<{ rug: RugProduct }> = ({ rug }) => {
  const [customWidth, setCustomWidth] = useState<number | "">("");
  const [customHeight, setCustomHeight] = useState<number | "">("");
  const [selectSizeType, setSelectSizeType] = useState<"standard" | "custom">("standard");
  const [selectSize, setSelectSize] = useState<string | null>(null);
  const { dictionary } = useDictionary();


  const sizes = useMemo(() => {
    if (!rug.sizes) return [];
    return [...new Set(rug.sizes)];
  }, [rug.sizes]);

  
  const router = useRouter();
  const searchParams = useSearchParams();


  useEffect(() => {
    const urlSize = searchParams.get("size");
    const urlW = searchParams.get("width");
    const urlH = searchParams.get("height");


    if (urlW && urlH) {
      setSelectSizeType("custom");
      setCustomWidth(Number(urlW) || "");
      setCustomHeight(Number(urlH) || "");
      setSelectSize(null);
      return;
    }


    if (urlSize) {
      const match = sizes.find((s) => {
        const a = parseSize(s);
        const b = parseSize(urlSize);
        if (!a || !b) return false;
        return a.w === b.w && a.h === b.h;
      });

      if (match) {
        setSelectSize(match);
        setSelectSizeType("standard");
        return;
      }
    }


    if (sizes.length > 0) {
      const first = sizes[0];
      setSelectSize(first);
      setSelectSizeType("standard");

      const params = new URLSearchParams(searchParams.toString());
      params.set("size", first);

      router.replace(`?${params.toString()}`);
    }
  }, [sizes, searchParams, router]);

  const updateUrl = (params: URLSearchParams, replace = false) => {
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    if (replace) {
      window.history.replaceState(null, "", newUrl);
    } else {
      window.history.pushState(null, "", newUrl);
    }
  };

  const handleSelectSize = (size: string) => {
    setSelectSize(size);
    setSelectSizeType("standard");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("width");
    params.delete("height");
    params.set("size", size);
    updateUrl(params); 
    
  };

  const handleCustomCalculate = () => {
    if (customWidth && customHeight && Number(customWidth) > 0 && Number(customHeight) > 0) {
      setSelectSizeType("custom");
      setSelectSize(null);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("size");
      params.set("width", String(customWidth));
      params.set("height", String(customHeight));
      updateUrl(params); 
      
    }
  };


  return (
    <div className="mt-4">
      <h2 className="mb-2 capitalize">{dictionary?.shared.sizes}</h2>
      <div className="flex gap-4">
        <button
          data-selected={selectSizeType === "standard"}
          onClick={() => setSelectSizeType("standard")}
          className="border px-4 py-2 cursor-pointer transition capitalize data-[selected=true]:bg-black data-[selected=true]:text-white"
        >
          {dictionary?.shared.standartSize}
        </button>
        <button
          data-selected={selectSizeType === "custom"}
          onClick={() => setSelectSizeType("custom")}
          className="border px-4 py-2 cursor-pointer transition capitalize data-[selected=true]:bg-black data-[selected=true]:text-white"
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
                onClick={() => handleSelectSize(size)}
                className="text-sm border px-4 py-2 whitespace-nowrap cursor-pointer transition hover:bg-gray-100 data-[selected=true]:bg-black data-[selected=true]:text-white"
              >
                {size}
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
              onChange={(e) => setCustomWidth(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 border"
            />
            <input
              type="number"
              placeholder="Height (cm)"
              value={customHeight}
              onChange={(e) => setCustomHeight(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full p-2 border"
            />
            <button
              onClick={handleCustomCalculate}
              className="border border-black text-black w-full capitalize px-4 py-2 cursor-pointer hover:text-white hover:bg-black transition"
            >
              {dictionary?.shared.calculatePrice}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RugSize;
