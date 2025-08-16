import { useCartStore } from '@/hooks/useCartStore'
import { ShoppingCart } from 'lucide-react'
import React from 'react'

const CartButton = () => {
  const { cart } = useCartStore()

  return (
    <button className="cursor-pointer relative p-2 rounded-full transition">
      <ShoppingCart className="w-6 h-6" />
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
        {cart.length}
      </span>
    </button>
  )
}

export default CartButton
