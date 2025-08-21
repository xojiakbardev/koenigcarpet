"use client";

import ProductCard from "@/components/shared/productCard";
import ProductWrapper from "@/components/shared/productWrapper";
import { useFilterStore } from "@/hooks/useFilterDataStore";
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
  searchParams: Record<string, string | string[]>;
};

const toList = (v: any): string[] => (Array.isArray(v) ? v : v ? [v] : []);

const FilterProduct: FC<Props> = ({ allProducts, limit, filter, slug, searchParams }) => {
  const { dictionary } = useDictionary();
  const { setFilters } = useFilterStore();
  const [locale] = useLocale();


  const [currentPage, setCurrentPage] = useState(1);
  const [displayed, setDisplayed] = useState<RugProduct[]>(() =>
    allProducts.slice(0, limit)
  );


  const inStock = searchParams.inStock === "true";
  const colors = toList(searchParams.color);
  const styles = toList(searchParams.style);
  const collections = toList(searchParams.collection);
  const sizes = toList(searchParams.sizes);
  const sortBy = searchParams.sortBy as string | undefined;

  const filters = useMemo(() => {
    const baseFilters: Record<string, string | string[]> = {
      inStock: inStock ? ["IN_STOCK"] : [],
      colors: colors.length > 0 ? colors : [],
      style: styles.length > 0 ? styles : [],
      collection: collections.length > 0 ? collections : [],
      sizes: sizes.length > 0 ? sizes : [],
    };

  if (filter && slug) {
    switch (filter) {
      case "color":
        baseFilters.colors =  [slug];
        break;
      case "style":
        baseFilters.style = Array.isArray(slug) ? slug : [slug];
        break;
      case "collection":
        baseFilters.collection = Array.isArray(slug) ? slug : [slug];
        break;
      case "size":
        baseFilters.sizes = Array.isArray(slug) ? slug : [slug];
        break;
      default:
        baseFilters[filter] = Array.isArray(slug) ? slug : [slug];
    }
  }


    return baseFilters;
  }, [inStock, colors, styles, collections, sizes, filter, slug]);

  const filteredProducts = useMemo(() => {
    let result = filterProducts(allProducts, filters);

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
  }, [allProducts, filters, sortBy, locale]);

  const filterData = useMemo(
    () => generateFilterData(allProducts, locale, dictionary),
    [allProducts, locale, dictionary]
  );

  useEffect(() => {
    if (filterData) setFilters(filterData);
  }, [filterData, setFilters]);

  const loadMore = () => {
    nProgress.start();
    const nextPage = currentPage + 1;
    const start = (nextPage - 1) * limit;
    const end = start + limit;
    const nextProducts = allProducts.slice(start, end);

    setDisplayed((prev) => [...prev, ...nextProducts]);
    setCurrentPage(nextPage);
    nProgress.done();
  };

  const hasMore = currentPage * limit < allProducts.length && filteredProducts.length > 0;

  return (
    <ProductWrapper searchParams={searchParams}>
      {displayed.length > 0 ? (
        displayed.map((product, i) => <ProductCard key={i} product={product} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">
          {dictionary?.shared.notFound}
        </p>
      )}

      {hasMore && (
        <div className="col-span-full flex">
          <button className="m-auto border p-2 cursor-pointer" onClick={loadMore}>
            {dictionary?.shared.loadMore}
          </button>
        </div>
      )}
    </ProductWrapper>
  );
};

export default FilterProduct;