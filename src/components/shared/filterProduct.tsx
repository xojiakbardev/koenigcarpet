"use client";

import ProductCard from "@/components/shared/productCard";
import ProductWrapper from "@/components/shared/productWrapper";
import PaginationNumbers from "@/components/shared/paginationNumbers";
import { RugProduct } from "@/types/product";
import { FC, Suspense, useEffect } from "react";
import { useDictionary } from "@/hooks/useDictionary";
import {useFilterStore} from "@/hooks/useFilterDataStore"

type Props = {
  rugs: RugProduct[];
  searchParams: Record<string, string | string[]>;
  rugsCount: number; 
  perPage: number;  
  filterData:any[]
};

const FilterProduct: FC<Props> = ({ rugs = [], searchParams, rugsCount, perPage, filterData }) => {
  const { dictionary } = useDictionary();
  const {setFilters} = useFilterStore()

  useEffect(()=>{setFilters(filterData)},[filterData, setFilters])

  return (
    <ProductWrapper searchParams={searchParams}>
      {rugs.length > 0 ? (
        rugs.map((product, i) => <ProductCard key={i} product={product} />)
      ) : (
        <p className="col-span-full text-center text-gray-500">
          {dictionary?.shared.notFound}
        </p>
      )}
      <Suspense fallback={null}>
              <PaginationNumbers
        totalItemsCount={rugsCount}
        defaultPerPage={perPage}
        maxPerPage={200}
      />
      </Suspense>
    </ProductWrapper>
  );
};

export default FilterProduct;
