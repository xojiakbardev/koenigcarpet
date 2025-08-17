"use client";

import { Heart } from "lucide-react";
import { FC, useState } from "react";
import LazyImage from "./lazyImage";
import { RugProduct } from "@/types/product";

type Props = {
  product: RugProduct;
}

const ProductCard: FC<Props> = ({ product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentColorIndex, ] = useState(0);

  const currentColor = product.colors[currentColorIndex];
  const defaultSize = product.sizes[0]; 

  const handleMouseEnter = (idx: number) => {
    setCurrentImageIndex(idx);
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(0);
  };

  return (
    <div className="w-full flex flex-col group">
      <div 
        className="relative w-full overflow-hidden aspect-[3/4]"
        onMouseLeave={handleMouseLeave}
      >
        <LazyImage
          fill
          src={currentColor.images[currentImageIndex]}
          alt={product.name}
          className="object-cover transition-opacity duration-500"
        />

        <div className="absolute top-0 left-0 w-full h-full flex">
          {currentColor.images.map((_, idx) => (
            <div
              key={idx}
              onMouseEnter={() => handleMouseEnter(idx)}
              className="flex-1 cursor-pointer"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 p-2">
        <h2 className="mx-auto text-sm font-medium text-gray-800 truncate">{product.name}</h2>
        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer" />
      </div>

      <p className="text-sm text-center text-gray-900">
        ${defaultSize.price} 
      </p>
    </div>
  )
}

export default ProductCard;
