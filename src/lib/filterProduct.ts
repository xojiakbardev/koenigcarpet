import { RugProduct } from "@/types/product";

type FilterValue = string | string[];
type Filters = Record<string, FilterValue>;

// Helper: nested yoki array ichidagi object qiymatni olish
const getPropertyValues = (obj: any, key: string): string[] => {
  const value = obj[key];

  if (value === undefined || value === null) return [];

  if (Array.isArray(value)) {
    if (value.length === 0) return [];

    // Array ichidagi object
    if (typeof value[0] === "object" && value[0] !== null) {
      // subfield nomini topamiz: masalan 'colors' -> 'name', 'sizes' -> 'size'
      const subKey = key === "colors" ? "name" : key === "sizes" ? "size" : null;
      if (!subKey) return [];
      return value.map(v => v[subKey]).filter(Boolean).map(v => String(v).toLowerCase());
    } else {
      // primitive array
      return value.map(v => String(v).toLowerCase());
    }
  }

  // Primitive qiymat
  return [String(value).toLowerCase()];
};

export const filterProducts = (products: RugProduct[], filters: Filters): RugProduct[] => {
  return products.filter(product => {
    for (const key in filters) {
      const filterValue = filters[key];
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) continue;

      const propValues = getPropertyValues(product, key);

      const filterValuesStr = (Array.isArray(filterValue) ? filterValue : [filterValue]).map(v =>
        String(v).toLowerCase()
      );

      if (!filterValuesStr.some(v => propValues.includes(v))) return false;
    }
    return true;
  });
};
