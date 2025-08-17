"use client";

import { Heart } from "lucide-react";
import { FC, useState, useRef, useEffect } from "react";
import LazyImage from "./lazyImage";
import { RugProduct } from "@/types/product";

type Props = {
  product: RugProduct;
};

const ProductCard: FC<Props> = ({ product }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [currentColorIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<number>>(new Set([0]));
  const preloadTriggered = useRef(false);

  const currentColor = product.colors[currentColorIndex];
  const defaultSize = product.sizes[0];

  useEffect(() => {
    if (hoveredIndex !== null && !preloadTriggered.current) {
      preloadTriggered.current = true;
      currentColor.images.forEach((_, idx) => {
        if (idx > 0) {
          setTimeout(() => {
            setPreloadedImages(prev => new Set(prev).add(idx));
          }, idx * 100); 
        }
      });
    }
  }, [hoveredIndex, currentColor.images]);

  useEffect(() => {
    setPreloadedImages(new Set([0]));
    preloadTriggered.current = false;
    setHoveredIndex(null);
  }, [currentColorIndex]);

  const handleMouseEnterArea = (idx: number) => {
    setHoveredIndex(idx);
    if (!preloadedImages.has(idx)) {
      setPreloadedImages(prev => new Set(prev).add(idx));
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const getActiveImageIndex = () => {
    return hoveredIndex !== null ? hoveredIndex : 0;
  };

  return (
    <div className="group flex w-full flex-col">
      <div
        className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100"
        onMouseLeave={handleMouseLeave}
      >
        {currentColor.images.map((src, idx) => {
          const shouldRender = preloadedImages.has(idx);
          const isActive = getActiveImageIndex() === idx;
          
          return (
            <div
              key={`${currentColorIndex}-${idx}`}
              className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {shouldRender && (
                <LazyImage
                  fill
                  src={src}
                  showPlaceholder={false}
                  alt={`${product.name} - rasm ${idx + 1}`}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              )}
            </div>
          );
        })}

        <div className="absolute inset-0 flex z-20">
          {currentColor.images.map((_, idx) => (
            <div
              key={`segment-${idx}`}
              onMouseEnter={() => handleMouseEnterArea(idx)}
              className="flex-1 cursor-pointer"
              style={{ width: `${100 / currentColor.images.length}%` }}
            />
          ))}
        </div>

        {currentColor.images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-20">
            {currentColor.images.map((_, idx) => (
              <div
                key={`indicator-${idx}`}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  getActiveImageIndex() === idx
                    ? 'bg-white shadow-lg'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 flex items-start justify-between px-1">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-center text-sm text-gray-700 mt-1">
            ${defaultSize.price}
          </p>
        </div>
        
        <button 
          className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200 group/heart"
          aria-label="Add to wishlist"
        >
          <Heart className="h-4 w-4 text-gray-400 group-hover/heart:text-red-500 transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;