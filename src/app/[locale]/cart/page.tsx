"use client";

import React, { useState } from "react";
import {
  Trash,
  Minus,
  Plus,
  ShoppingCart,
  Gift,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Locale } from "@/localization/config";
import { useDictionary } from "@/hooks/useDictionary";
import { useCartStore } from "@/hooks/useCartStore";
import Link from "next/link";

const CartPage = () => {
  const [locale] = useState<Locale>("en");
  const { dictionary } = useDictionary();

  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCartStore();

  // hisob-kitoblar
  const subtotal = cart.reduce((sum, ci) => sum + ci.totalPrice, 0);
  const discount = cart.length > 1 ? 18.0 : 0.0; // masalan: faqat 2-ta bo‘lsa chegirma
  const total = subtotal - discount;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="w-full flex justify-between items-center space-x-4">
            <Link href={`/${locale}/`}>
              <Image src="/logo-dark.png" width={100} height={50} alt="logo" />
            </Link>
            <div className="size-12 bg-gray-300 rounded-full cursor-pointer"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-medium">
                {dictionary?.cart.basket} ({cart.length})
              </h1>
              <button onClick={clearCart} className="text-red-500 text-sm cursor-pointer">
                {dictionary?.cart.clearCart}
              </button>
            </div>

            {/* Free Shipping Banner */}
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 mb-6 flex items-center">
              <ShoppingCart className="text-green-600 mr-3" size={20} />
              <span className="text-green-700 text-sm">
                {dictionary?.cart.freeShipping}
              </span>
            </div>

            {/* Cart Items */}
            <div className="space-y-6">
              {cart.map((ci) => (
                <div
                  key={ci.item.id}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-start space-x-4">
                    <Image
                      width={600}
                      height={400}
                      src={ci.item.images[0]}
                      alt={ci.item.product_name[locale]}
                      className="w-20 h-full object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">
                        {ci.item.product_name[locale]}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {ci.item.sizes[0]} cm
                      </p>
                      <p className="text-gray-500 text-sm mb-3">
                        1. {dictionary?.cart.yourCustomizations} ({ci.quantity}{" "}
                        {dictionary?.cart.quantity})
                      </p>

                      <div className="flex items-center">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => decreaseQuantity(ci.item.id)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-medium">
                            {ci.quantity} {dictionary?.cart.piece}
                          </span>
                          <button
                            onClick={() => increaseQuantity(ci.item.id)}
                            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(ci.item.id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full border ml-4 cursor-pointer hover:opacity-50"
                        >
                          <Trash size={18} />
                        </button>
                      </div>

                      <div className="mt-3 text-purple-600 text-sm">
                        2. {dictionary?.cart.secondProductDiscount}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-green-600 font-bold text-lg">
                        ${ci.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              {dictionary?.cart.continueShopping}
            </button>

            {/* Campaigns */}
            <div className="mt-8">
              <h3 className="font-medium mb-4">
                {dictionary?.cart.campaigns}
              </h3>
              <div className="space-y-2 text-sm text-purple-600">
                <p>
                  {dictionary?.cart.secondProductDiscount} -{" "}
                  {dictionary?.cart.secondProductDiscount}
                </p>
                <p>
                  {dictionary?.cart.allBankTransferDiscount} -{" "}
                  {dictionary?.cart.allBankTransferDiscount}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
              <h2 className="font-medium text-lg mb-6">
                {dictionary?.cart.orderSummary}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span>{dictionary?.cart.basketAmount}</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{dictionary?.cart.shippingCost}</span>
                  <span className="text-green-600">
                    {dictionary?.cart.free}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-purple-600">
                    <span>{dictionary?.cart.secondProductDiscount}</span>
                    <span>- ${discount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>{dictionary?.cart.totalAmount}</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 mb-4">
                {dictionary?.cart.completeShopping}
              </button>

              <button className="w-full flex items-center justify-between text-purple-600 border border-purple-200 py-3 px-4 rounded-lg hover:bg-purple-50">
                <div className="flex items-center">
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


                    {/* Last Viewed */}
                    {/* <div className="mt-12">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-medium">{dictionary?.cart.lastViewed}</h2>
                            <div className="flex space-x-2">
                                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                                    <ArrowLeft size={16} />
                                </button>
                                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                            {rugs.map((rug) => (
                                <div key={rug.id} className="group">
                                    <div className="aspect-square mb-3 relative overflow-hidden rounded-lg">
                                        <Image
                                            width={600}
                                            height={400}
                                            src={rug.images[0]}
                                            alt={rug.product_name[locale]}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                        />
                                    </div>
                                    <h3 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
                                        {rug.product_name[locale].toUpperCase()}
                                    </h3>
                                    <div className="text-sm font-bold mb-2">${parseFloat(rug.price).toFixed(2)}</div>
                                    <button
                                        onClick={() => toggleCart(rug.id)}
                                        className={`w-full py-2 px-3 text-xs rounded ${cart.includes(rug.id)
                                            ? 'bg-green-600 text-white'
                                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cart.includes(rug.id) ? dictionary?.cart.inBasket : dictionary?.cart.addToBasket}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div> */}