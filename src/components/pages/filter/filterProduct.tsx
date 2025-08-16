"use client";

import ProductCard from "@/components/shared/productCard";
import ProductWrapper from "@/components/shared/productWrapper";
import { useQueryState } from "@/hooks/useQueryState";
import { FC, useMemo } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  images: string[];
  color: string;
  style: string;
  collection: string;
};

type Props = {
  products: Product[];
  filter?: "color" | "style" | "collection"; 
  slug?: string;
};

const FilterProduct: FC<Props> = ({ products, filter, slug }) => {
  const [inStock] = useQueryState("inStock", false);
  const [colors] = useQueryState("colors", true);
  const [styles] = useQueryState("styles", true);
  const [collections] = useQueryState("collections", true);

  

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filter && slug) {
        const productValue = product[filter].toLowerCase();
        if (productValue !== slug.toLowerCase()) {
          return false;
        }
      }

      if (inStock === "true" && product.collection !== "IN_STOCK") {
        return false;
      }

      if (colors.length > 0 && !colors.includes(product.color.toLowerCase())) {
        return false;
      }

      if (styles.length > 0 && !styles.includes(product.style.toLowerCase())) {
        return false;
      }

      if (collections.length > 0 && !collections.includes(product.collection.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [products, inStock, colors, styles, collections, filter, slug]);

  return (
    <ProductWrapper>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          Hech qanday mahsulot topilmadi
        </p>
      )}
    </ProductWrapper>
  );
};

export default FilterProduct;
