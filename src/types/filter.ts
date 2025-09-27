export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterData {
  key: "color" | "style" | "collections" | "size";
  title: string;
  options: FilterOption[];
}
