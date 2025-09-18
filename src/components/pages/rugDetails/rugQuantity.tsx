"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { RugProduct } from "@/types/product";
import { useCartStore } from "@/hooks/useCartStore";
import { useSearchParams } from "next/navigation";
import { calculateRugPrice } from "@/lib/calculatePrice";
import { useCurrency } from "@/hooks/useCurrency";
import { useDictionary } from "@/hooks/useDictionary";

type Props = {
  rug: RugProduct;
};

const RugQuantityAddToCart: React.FC<Props> = ({ rug }) => {
  const { cart, addToCart } = useCartStore();
  const searchParams = useSearchParams();
  const { convert } = useCurrency();
  const { dictionary } = useDictionary();
  const [selectedSize, setSelectedSize] = useState(
    rug.sizes?.[0] ?? ""
  );

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const sizeParam = searchParams.get("size");
    const widthParam = searchParams.get("width");
    const heightParam = searchParams.get("height");

    if (sizeParam) setSelectedSize(sizeParam);
    else if (widthParam && heightParam)
      setSelectedSize(`${widthParam}x${heightParam} cm`);
    else setSelectedSize(rug.sizes?.[0] ?? "");
  }, [searchParams, rug.sizes]);

  const price = useMemo(() => {
    const basePrice = Number(rug.price ?? 0);
    const sizes = rug.sizes ?? [];
    const usdPrice = calculateRugPrice(basePrice, sizes, selectedSize);
    return convert ? convert(usdPrice) : usdPrice;
  }, [rug.price, rug.sizes, selectedSize, convert]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart({ ...rug, sizes: [selectedSize], price: String(price) ?? "" }, quantity, selectedSize);
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      <div className="flex items-center border overflow-hidden">
        <button onClick={handleDecrease} className="px-3 py-2 cursor-pointer">
          <Minus size={14} />
        </button>
        <span className="px-4 py-2">{quantity}</span>
        <button onClick={handleIncrease} className="px-3 py-2 cursor-pointer">
          <Plus size={14} />
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="flex items-center px-4 py-2 border cursor-pointer"
      >
        <ShoppingCart size={16} className="mr-2" />
        {dictionary?.shared.addToCart} — {price ? (price * quantity).toLocaleString("ru-RU") : "-"} €
      </button>
    </div>
  );
};

export default RugQuantityAddToCart;
