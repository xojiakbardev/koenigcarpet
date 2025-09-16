"use client";

import React, { useState } from "react";
import { Trash, ShoppingCart, } from "lucide-react";
import Image from "next/image";
import { useDictionary } from "@/hooks/useDictionary";
import { useCartStore } from "@/hooks/useCartStore";
import Link from "next/link";
import { useLocale } from "@/hooks/useLocale";

const CartPage = () => {
  const [locale] = useLocale();
  const { dictionary } = useDictionary();
  const { cart, removeFromCart, clearCart } = useCartStore();


  const subtotal = cart.reduce((sum, ci) => sum + ci.totalPrice, 0);
  let discount = 0;
  if (cart.length > 1) {
    const minPrice = Math.min(...cart.map((ci) => ci.totalPrice));
    discount = minPrice * 0.1;
  }
  const total = subtotal - discount;


  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOrder = async () => {
    if (!name || !phone || !address) {
      setMessage(dictionary?.cart.order.fillAllFields || "⚠️");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/send-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({
          name,
          phone,
          address,
          cart,
          subtotal,
          discount,
          total,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(dictionary?.cart.order.success || "✅");
        clearCart();
        setShowModal(false);
      } else {
        setMessage(dictionary?.cart.order.error || "❌");
      }
    } catch {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/${locale}/`}>
            <Image src="/logo-dark.png" width={100} height={50} alt="logo" />
          </Link>
          <div className="size-12 bg-gray-300 rounded-full" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* cart */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-medium">
                {dictionary?.cart.basket} ({cart.length})
              </h1>
              <button
                onClick={clearCart}
                className="text-red-500 text-sm hover:opacity-70"
              >
                {dictionary?.cart.clearCart}
              </button>
            </div>

            {cart.length === 0 && (
              <div className="p-6 bg-white rounded-lg shadow text-center text-gray-500">
                {dictionary?.cart.emptyCart}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center">
                  <ShoppingCart className="text-green-600 mr-3" size={20} />
                  <span className="text-green-700 text-sm">
                    {dictionary?.cart.freeShipping}
                  </span>
                </div>

                <div className="space-y-6">
                  {cart.map((ci) => (
                    <div
                      key={ci.item.id + ci.size}
                      className="bg-white rounded-lg p-6 shadow-sm flex items-start space-x-4"
                    >
                      <Image
                        width={80}
                        height={80}
                        src={ci.item.images[0]}
                        alt={ci.item.product_name[locale]}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {ci.item.product_name[locale]}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {ci.item.sizes[0]} cm
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                          {dictionary?.cart.yourCustomizations} ({ci.quantity}{" "}
                          {dictionary?.cart.quantity})
                        </p>
                        <button
                          onClick={() => removeFromCart(ci.item.id, ci.size)}
                          className="text-red-500 hover:text-red-700 p-2 border rounded-full"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                      <div className="text-green-600 font-bold">
                        {ci.totalPrice.toLocaleString("ru-RU")} ₽
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="font-medium text-lg mb-6">
                {dictionary?.cart.orderSummary}
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>{dictionary?.cart.basketAmount}</span>
                  <span>{subtotal.toLocaleString("ru-RU")} ₽</span>
                </div>
                <div className="flex justify-between">
                  <span>{dictionary?.cart.shippingCost}</span>
                  <span className="text-green-600">{dictionary?.cart.free}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>{dictionary?.cart.secondProductDiscount}</span>
                    <span>-{discount.toLocaleString("ru-RU")} ₽</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>{dictionary?.cart.totalAmount}</span>
                  <span>{total.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              <button
                onClick={() => cart.length > 0 && setShowModal(true)}
                disabled={cart.length === 0}
                className={`w-full py-3 rounded-lg font-medium mb-4 ${
                  cart.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {dictionary?.cart.completeShopping}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
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
            <textarea
              placeholder={dictionary?.cart.order.address}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
                onClick={handleOrder}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-2 disabled:opacity-50"
              >
                {loading && (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading
                  ? dictionary?.cart.order.sending
                  : dictionary?.cart.order.confirm}
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
      `}</style>
    </div>
  );
};

export default CartPage;
