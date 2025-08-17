import { RugProduct } from "@/types/product";
import { FilterData } from "@/types/filter";


export const generateFilterData = (products: RugProduct[]): FilterData[] => {
  const colorMap = new Map<string, number>();
  const styleMap = new Map<string, number>();
  const collectionMap = new Map<string, number>();
  const sizeMap = new Map<string, number>();

  products.forEach(product => {
    // Colors
    product.colors.forEach(c => {
      const key = c.name;
      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    });

    // Styles
    styleMap.set(product.style, (styleMap.get(product.style) || 0) + 1);

    // Collections
    collectionMap.set(product.collection, (collectionMap.get(product.collection) || 0) + 1);

    // Sizes
    product.sizes.forEach(s => {
      const key = s.size;
      sizeMap.set(key, (sizeMap.get(key) || 0) + 1);
    });
  });

  const mapToOptions = (map: Map<string, number>) =>
    Array.from(map.entries()).map(([value, count]) => ({
      value,
      label: value,
      count,
    }));

  return [
    { key: "color", title: "Rang", options: mapToOptions(colorMap) },
    { key: "style", title: "Uslub", options: mapToOptions(styleMap) },
    { key: "collection", title: "Kolleksiya", options: mapToOptions(collectionMap) },
    { key: "size", title: "O‘lcham", options: mapToOptions(sizeMap) },
  ];
};
