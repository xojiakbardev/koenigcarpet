"use client";

import ProductCard from "@/components/shared/productCard";
import ProductWrapper from "@/components/shared/productWrapper";
import { useFilterStore } from "@/hooks/useFilterDataStore";
import { useQueryState } from "@/hooks/useQueryState";
import { filterProducts } from "@/lib/filterProduct";
import { generateFilterData } from "@/lib/generateFilterData";
import { RugProduct } from "@/types/product";
import { FC, useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { useDictionary } from "@/hooks/useDictionary";
import nProgress from "nprogress";

type Props = {
  allProducts: RugProduct[];
  limit: number;
  filter?: "color" | "style" | "collection" | "size";
  slug?: string;
};

const FilterProduct: FC<Props> = ({ allProducts, limit, filter, slug }) => {
  const [inStock] = useQueryState("inStock", false);
  const [colors] = useQueryState("colors", true);
  const [styles] = useQueryState("styles", true);
  const [collections] = useQueryState("collections", true);
  const [sizes] = useQueryState("sizes", true);
  const [sortBy] = useQueryState("sortBy", false);
  const {dictionary} = useDictionary()

  const { setFilters } = useFilterStore();
  const [locale] = useLocale();

  // page state
  const [currentPage, setCurrentPage] = useState(1);
  const [displayed, setDisplayed] = useState<RugProduct[]>(() =>
    allProducts.slice(0, limit)
  );

  // filterlar
  const filters = useMemo(() => {
    const baseFilters: Record<string, string | string[]> = {
      inStock: inStock === "true" ? ["IN_STOCK"] : [],
      colors: colors.length > 0 ? colors : [],
      style: styles.length > 0 ? styles : [],
      collection: collections.length > 0 ? collections : [],
      sizes: sizes.length > 0 ? sizes : [],
    };

    if (filter && slug) {
      const nestedKey =
        filter === "color"
          ? "color.key"
          : filter === "size"
          ? "sizes"
          : filter;
      baseFilters[nestedKey] = slug;
    }

    return baseFilters;
  }, [inStock, colors, styles, collections, sizes, filter, slug]);


  const filteredProducts = useMemo(() => {
    let result = filterProducts(displayed, filters);
    const getPrice = (p: RugProduct) => parseFloat(p.price) || 0;

    switch (sortBy) {
      case "name_asc":
        result = [...result].sort((a, b) =>
          a.product_name[locale]?.localeCompare(b.product_name[locale])
        );
        break;
      case "name_desc":
        result = [...result].sort((a, b) =>
          b.product_name[locale]?.localeCompare(a.product_name[locale])
        );
        break;
      case "price_asc":
        result = [...result].sort((a, b) => getPrice(a) - getPrice(b));
        break;
      case "price_desc":
        result = [...result].sort((a, b) => getPrice(b) - getPrice(a));
        break;
      case "stock_code":
        result = [...result].sort((a, b) =>
          (a.product_code || "").localeCompare(b.product_code || "")
        );
        break;
      case "newest":
        result = [...result].sort(
          (a, b) =>
            new Date(b.features?.[locale]?.technical_info?.[0] ?? 0).getTime() -
            new Date(a.features?.[locale]?.technical_info?.[0] ?? 0).getTime()
        );
        break;
      case "oldest":
        result = [...result].sort(
          (a, b) =>
            new Date(a.features?.[locale]?.technical_info?.[0] ?? 0).getTime() -
            new Date(b.features?.[locale]?.technical_info?.[0] ?? 0).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [displayed, filters, sortBy, locale]);

  const filterData = useMemo(
    () => generateFilterData(allProducts, locale, dictionary),
    [allProducts, locale, dictionary]
  );

  useEffect(() => {
    if (filterData) setFilters(filterData);
  }, [filterData, setFilters]);

  const loadMore = () => {
    nProgress.start()
    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * limit;
    const end = start + limit;
    const nextProducts = allProducts.slice(start, end);

    setDisplayed((prev) => [...prev, ...nextProducts]);
    setCurrentPage(nextPage);
    nProgress.done()
  };

  const hasMore = currentPage * limit < allProducts.length;

  return (
    <ProductWrapper>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((product, i) => (
          <ProductCard key={i} product={product} />
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">
          {dictionary?.shared.notFound}
        </p>
      )}

      {hasMore && (
        <div className="col-span-full flex">
          <button
            className="m-auto border p-2 cursor-pointer"
            onClick={loadMore}
          >
            {dictionary?.shared.loadMore}
          </button>
        </div>
      )}
    </ProductWrapper>
  );
};

export default FilterProduct;
