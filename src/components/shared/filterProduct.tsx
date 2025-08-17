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
  const [sortBy] = useQueryState("sortBy", false);
  const { setFilters } = useFilterStore()


  const filters = useMemo(() => {
    const baseFilters: Record<string, string | string[]> = {
      inStock: inStock === "true" ? ["IN_STOCK"] : [],
      colors: colors.length > 0 ? colors : [],
      style: styles.length > 0 ? styles : [],
      collection: collections.length > 0 ? collections : [],
      sizes: sizes.length > 0 ? sizes : []
    };

    if (filter && slug) {
      const nestedKey =
        filter === "color" ? "colors.name" :
          filter === "size" ? "sizes.size" :
            filter;
      baseFilters[nestedKey] = slug;
    }

    return baseFilters;
  }, [inStock, colors, styles, collections, sizes, filter, slug]);

const filteredProducts = useMemo(() => {
  let result = filterProducts(products, filters);

  const getMinPrice = (p: RugProduct) =>
    Math.min(...p.sizes.map(s => s.price));
  const getMaxPrice = (p: RugProduct) =>
    Math.max(...p.sizes.map(s => s.price));

  switch (sortBy) {
    case "name_asc":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name_desc":
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price_asc":
      result = [...result].sort((a, b) => getMinPrice(a) - getMinPrice(b));
      break;
    case "price_desc":
      result = [...result].sort((a, b) => getMaxPrice(b) - getMaxPrice(a));
      break;
    case "stock_code":
      result = [...result].sort((a, b) =>
        (a.stock_code || "").localeCompare(b.stock_code || "")
      );
      break;
    case "newest":
      result = [...result].sort(
        (a, b) =>
          new Date(b.technical_info?.manufactured_in ?? 0).getTime() -
          new Date(a.technical_info?.manufactured_in ?? 0).getTime()
      );
      break;
    case "oldest":
      result = [...result].sort(
        (a, b) =>
          new Date(a.technical_info?.manufactured_in ?? 0).getTime() -
          new Date(b.technical_info?.manufactured_in ?? 0).getTime()
      );
      break;
    default:
      break;
  }

  return result;
}, [products, filters, sortBy]);

  const filterData = useMemo(() => generateFilterData(products), [products]);

  useEffect(() => {
    if (filterData) {
      setFilters(filterData);
    }
  }, [filterData, setFilters]);

  return (
    <ProductWrapper>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, i) => (
          <ProductCard key={i} product={product} />
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
