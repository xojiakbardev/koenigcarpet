"use client";

import ProductCard from "@/components/shared/productCard";
import ProductWrapper from "@/components/shared/productWrapper";
import { useFilterStore } from "@/hooks/useFilterDataStore";
import { useQueryState } from "@/hooks/useQueryState";
import { filterProducts } from "@/lib/filterProduct";
import { generateFilterData } from "@/lib/generateFilterData";
import { RugProduct } from "@/types/product";
import { FC, useEffect, useMemo } from "react";

type Props = {
  products: RugProduct[];
  filter?: "color" | "style" | "collection" | "size";
  slug?: string;
};

const FilterProduct: FC<Props> = ({ products, filter, slug }) => {
  const [inStock] = useQueryState("inStock", false);
  const [colors] = useQueryState("colors", true);
  const [styles] = useQueryState("styles", true);
  const [collections] = useQueryState("collections", true);
  const [sizes] = useQueryState("sizes", true);
  const { setFilters } = useFilterStore()


  const filters = useMemo(() => {
    const baseFilters: Record<string, string | string[]> = {
      inStock: inStock === "true" ? ["IN_STOCK"] : [],
      colors: colors.length > 0 ? colors : [],
      styles: styles.length > 0 ? styles : [],
      collections: collections.length > 0 ? collections : [],
      sizes: sizes.length > 0 ? sizes : []
    };

    if (filter && slug) {
      // Nested propertylarni aniqlash
      const nestedKey =
        filter === "color" ? "colors.name" :
          filter === "size" ? "sizes.size" :
            filter;
      baseFilters[nestedKey] = slug;
    }

    return baseFilters;
  }, [inStock, colors, styles, collections, sizes, filter, slug]);

  const filteredProducts = useMemo(() => filterProducts(products, filters), [products, filters]);


  const filterData = useMemo(() => generateFilterData(products), [products]);

  useEffect(() => {
    if (filterData) {
      setFilters(filterData);
    }
  }, [filterData, setFilters]);

  return (
    <ProductWrapper>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product) => (
          <ProductCard key={product.name} product={product} />
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
