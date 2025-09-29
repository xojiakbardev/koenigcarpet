"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Plus, Minus, ShoppingCart, ArrowBigRightDash } from "lucide-react";
import { RugProduct } from "@/types/product";
import { useCartStore } from "@/hooks/useCartStore";
import { useSearchParams } from "next/navigation";
import { calculateRugPrice } from "@/lib/calculatePrice";
import { useDictionary } from "@/hooks/useDictionary";
import { useLocale } from "@/hooks/useLocale";

type Props = {
  rug: RugProduct;
};

const RugQuantityAddToCart: React.FC<Props> = ({ rug }) => {
  const { addToCart } = useCartStore();
  const searchParams = useSearchParams();
  const { dictionary } = useDictionary();
  const [selectedSize, setSelectedSize] = useState(rug.sizes?.[0] ?? "");
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [locale] = useLocale()


  useEffect(() => {
    const sizeParam = searchParams.get("size");
    const widthParam = searchParams.get("width");
    const heightParam = searchParams.get("height");

    if (sizeParam) {
      setSelectedSize(sizeParam);
    } else if (widthParam && heightParam) {
      setSelectedSize(`${widthParam}x${heightParam} cm`);
    } else {
      setSelectedSize(rug.sizes?.[0] ?? "");
    }
  }, [searchParams, rug.sizes]);


  const basePrice = rug.price ?? 0;

  const price = useMemo(() => {
    const sizes = rug.sizes ?? [];
    return calculateRugPrice(basePrice, sizes, selectedSize);
  }, [rug.sizes, selectedSize, basePrice]);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    addToCart(
      { ...rug, sizes: [selectedSize], price: price ?? "" },
      quantity,
      selectedSize
    );
  };



  const sendOrder = async () => {
    setLoading(true);

    if (!name || !phone) {
      setMessage(dictionary?.cart.order.fillAllFields || "⚠️");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/api/send-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          stock: `${rug.product_name[locale]} - ${selectedSize}\n
🔢 ${dictionary?.cart.quantity}: ${quantity}\n
💵 ${price}₽\n 
${dictionary?.cart.order.subtotal}: ${price * quantity}₽\n
<b>${dictionary?.cart.order.stock}:</b> ${rug.product_code}`,
        }),
      });

      if (!res.ok) {
        throw new Error("Server xatosi");
      }

      setMessage(dictionary?.cart.order.success || "✅ Buyurtma yuborildi!");
      setShowModal(false);
      setPhone("");
      setName("");
    } catch {
      setMessage(dictionary?.cart.order.error || "❌ Xatolik yuz berdi!");
    } finally {
      setLoading(false);
    }
  };





  return (
    <>    <div className="flex items-center space-x-4 mt-4">
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
        {dictionary?.shared.addToCart} —{" "}
        {price ? (price * quantity).toLocaleString("ru-RU") : "-"} ₽
      </button>
    </div>

      <button className="mt-4 border px-4 py-2 cursor-pointer flex gap-2"
        onClick={() => setShowModal(true)}> {dictionary?.cart.order.orderNow} <ArrowBigRightDash /></button>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/30 bg-opacity-50 transition-opacity z-50"
          onClick={() => !loading && setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-96 transform transition-all scale-95 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-medium mb-4">
              {dictionary?.cart.order.enterDetails}
            </h2>
            <input
              type="text"
              placeholder={dictionary?.cart.order.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="tel"
              placeholder={dictionary?.cart.order.phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border p-2 mb-3 rounded"
            />
            {message && <p className="text-sm text-red-500 mb-2">{message}</p>}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
                disabled={loading}
              >
                {dictionary?.cart.order.cancel}
              </button>
              <button
                onClick={() => sendOrder()}
                disabled={loading}
                className="cursor-pointer px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading
                  ? dictionary?.cart.order.sending
                  : dictionary?.footer.send}
              </button>
            </div>
          </div>
        </div>
      )}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style></>
  );
};

export default RugQuantityAddToCart;
