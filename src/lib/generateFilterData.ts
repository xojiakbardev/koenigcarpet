import { RugProduct } from "@/types/product";
import { FilterData } from "@/types/filter";
import { Locale } from "@/localization/config";
import { Dictionary } from "@/localization/dictionary";

export const generateFilterData = (
  products: RugProduct[],
  locale: Locale,
  dict: Dictionary | undefined
): FilterData[] => {
  const colorMap = new Map<string, { count: number; label: string }>();
  const styleMap = new Map<string, { count: number; label: string }>();
  const collectionMap = new Map<string, { count: number; label: string }>();
  const sizeMap = new Map<string, { count: number; label: string }>();

  products.forEach((product) => {

    if (product.color?.value) {
      const key = product.color.value;
      const label = product.color[locale];
      const prev = colorMap.get(key);
      colorMap.set(key, {
        count: (prev?.count || 0) + 1,
        label,
      });
    }


    if (product.style?.value) {
      const key = product.style.value;
      const label = product.style[locale];
      const prev = styleMap.get(key);
      styleMap.set(key, {
        count: (prev?.count || 0) + 1,
        label,
      });
    }


    if (product.collection?.value) {
      const key = product.collection.value;
      const label = product.collection[locale];
      const prev = collectionMap.get(key);
      collectionMap.set(key, {
        count: (prev?.count || 0) + 1,
        label,
      });
    }


    if (Array.isArray(product.sizes)) {
      product.sizes.forEach((size) => {
        const prev = sizeMap.get(size);
        sizeMap.set(size, {
          count: (prev?.count || 0) + 1,
          label: size,
        });
      });
    }
  });

  const mapToOptions = (
    map: Map<string, { count: number; label: string }>
  ) =>
    Array.from(map.entries()).map(([value, data]) => ({
      value,
      label: data.label,
      count: data.count,
    }));

  return [
    { key: "color", title: dict?.shared.colors || "Colors", options: mapToOptions(colorMap) },
    { key: "style", title: dict?.shared.styles || "Styles", options: mapToOptions(styleMap) },
    { key: "collection", title: dict?.shared.collections || "Collections", options: mapToOptions(collectionMap) },
    { key: "size", title: dict?.shared.sizes || "Sizes", options: mapToOptions(sizeMap) },
  ];
};
