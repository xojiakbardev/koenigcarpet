"use client";

import React, { useState } from "react";
import { Trash, ShoppingCart, Gift, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Locale } from "@/localization/config";
import { useDictionary } from "@/hooks/useDictionary";
import { useCartStore } from "@/hooks/useCartStore";
import Link from "next/link";

const CartPage = () => {
  const [locale] = useState<Locale>("en");
  const { dictionary } = useDictionary();

  const { cart, removeFromCart, clearCart } = useCartStore();

  const subtotal = cart.reduce((sum, ci) => sum + ci.totalPrice, 0);

  let discount = 0;
  if (cart.length > 1) {
    const minPrice = Math.min(...cart.map((ci) => ci.totalPrice));
    discount = minPrice * 0.1;
  }

  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-center justify-between mb-8">
          <div className="w-full flex justify-between items-center space-x-4">
            <Link href={`/${locale}/`} className="cursor-pointer">
              <Image src="/logo-dark.png" width={100} height={50} alt="logo" />
            </Link>
            <div className="size-12 bg-gray-300 rounded-full cursor-pointer"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-medium">
                {dictionary?.cart.basket} ({cart.length})
              </h1>
              <button
                onClick={clearCart}
                className="text-red-500 text-sm cursor-pointer hover:opacity-70"
              >
                {dictionary?.cart.clearCart}
              </button>
            </div>


            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center cursor-pointer">
              <ShoppingCart className="text-green-600 mr-3" size={20} />
              <span className="text-green-700 text-sm">
                {dictionary?.cart.freeShipping}
              </span>
            </div>


            <div className="space-y-6">
              {cart.map((ci) => (
                <div
                  key={ci.item.id+ci.size}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <Image
                      width={600}
                      height={400}
                      src={ci.item.images[0]}
                      alt={ci.item.product_name[locale]}
                      className="w-20 h-full object-cover rounded cursor-pointer"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1 cursor-pointer">
                        {ci.item.product_name[locale]}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {ci.item.sizes[0]} cm
                      </p>
                      <p className="text-gray-500 text-sm mb-3">
                        {dictionary?.cart.yourCustomizations} ({ci.quantity}{" "}
                        {dictionary?.cart.quantity})
                      </p>

                      <button
                        onClick={() => removeFromCart(ci.item.id, ci.size)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full border cursor-pointer hover:opacity-50"
                      >
                        <Trash size={18} />
                      </button>

                      {cart.length > 1 && (
                        <div className="mt-3 text-purple-600 text-sm cursor-pointer">
                          {dictionary?.cart.secondProductDiscount}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">
                        {ci.totalPrice.toLocaleString("ru-RU")} ₽
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href={`/${locale}/`}>
              <button className="w-full mt-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                {dictionary?.cart.continueShopping}
              </button>
              </Link>


            <div className="mt-8">
              <h3 className="font-medium mb-4">{dictionary?.cart.campaigns}</h3>
              <div className="space-y-2 text-sm text-purple-600 cursor-pointer">
                <p>{dictionary?.cart.secondProductDiscount} (-10%)</p>
                <p>{dictionary?.cart.allBankTransferDiscount}</p>
              </div>
            </div>
          </div>


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
                  <span className="text-green-600 cursor-pointer">
                    {dictionary?.cart.free}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>{dictionary?.cart.secondProductDiscount} (-10%)</span>
                    <span>- {discount.toLocaleString("ru-RU")} ₽</span>
                  </div>
                )}
                <hr className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>{dictionary?.cart.totalAmount}</span>
                  <span>{total.toLocaleString("ru-RU")} ₽</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 mb-4 cursor-pointer">
                {dictionary?.cart.completeShopping}
              </button>

              <button className="w-full flex items-center justify-between text-purple-600 border border-purple-200 py-3 px-4 rounded-lg hover:bg-purple-50 cursor-pointer">
                <div className="flex items-center whitespace-nowrap text-sm">
                  <Gift className="mr-2" size={20} />
                  <span>{dictionary?.cart.redeemGiftVoucher}</span>
                </div>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;




