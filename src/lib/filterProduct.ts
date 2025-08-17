import { RugProduct } from "@/types/product";

type FilterValue = string | string[];
type Filters = Record<string, FilterValue>;

// Helper: product ichidan kerakli qiymatlarni olish
const getPropertyValues = (obj: any, key: string): string[] => {
  const value = obj[key];
  if (value === undefined || value === null) return [];

  // Agar array bo‘lsa
  if (Array.isArray(value)) {
    if (value.length === 0) return [];

    // Array ichida object bo‘lsa (masalan colors[], sizes[])
    if (typeof value[0] === "object" && value[0] !== null) {
      switch (key) {
        case "colors":
          return value.map(v => v.name).filter(Boolean).map(v => String(v).toLowerCase());
        case "sizes":
          return value.map(v => v.size).filter(Boolean).map(v => String(v).toLowerCase());
        default:
          return []; // boshqa array-objectlarni hozircha qo‘shmadik
      }
    }

    // Array primitive bo‘lsa
    return value.map(v => String(v).toLowerCase());
  }

  // Agar oddiy string yoki son bo‘lsa
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

      // Agar product property qiymatlari orasida hech bo‘lmasa 1 ta mos kelmasa -> filterdan chiqadi
      if (!filterValuesStr.some(v => propValues.includes(v))) return false;
    }
    return true;
  });
};
