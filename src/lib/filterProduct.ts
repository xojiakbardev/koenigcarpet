import { RugProduct } from "@/types/product";

type FilterValue = string | string[];
type Filters = Record<string, FilterValue>;

const getPropertyValues = (product: RugProduct, key: string): string[] => {
  switch (key) {
    case "color":
      return [product.color.value.toLowerCase()];
    case "collection":
      return [product.collection.value.toLowerCase()];
    case "style":
      return [product.style.value.toLowerCase()];
    case "sizes":
      return product.sizes?.map(s => s.toLowerCase()) ?? [];
    default:
      return [];
  }
};

export const filterProducts = (
  products: RugProduct[],
  filters: Filters
): RugProduct[] => {
  return products.filter(product => {
    return Object.entries(filters).every(([key, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return true;

      const propValues = getPropertyValues(product, key);

      const filterValuesStr = (Array.isArray(filterValue) ? filterValue : [filterValue]).map(v =>
        String(v).toLowerCase()
      );

      // Agar hech qaysi filter value propValues ichida bo'lmasa, product filterdan chiqadi
      return filterValuesStr.some(v => propValues.includes(v));
    });
  });
};
