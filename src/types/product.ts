export interface RugColor {
  name: string;
  images: string[];
}

export interface RugSize {
  size: string;         // masalan "160x230 cm"
  price: number;        // umumiy narx
  price_per_m2: number; // per kvadrat metr narx
}

export interface RugTechnicalInfo {
  manufactured_in: string;
  type: string;           // masalan "flat woven"
  craft: string;          // masalan "handcrafted"
  washed_and_dyed: string;
  weight_per_sqm: number; // gramm
  thickness: number;      // mm
  materials: string[];
  fringed: boolean;
  may_slip: boolean;
  vacuum_safe: boolean;
  usable_areas: string[];
  year_round_use: boolean;
  measurement_tolerance: string; // "+/- 3%"
}

export interface RugProduct {
  name: string;
  collection: string;
  style: string;
  colors: RugColor[];
  sizes: RugSize[];
  stock_code: string;
  description: string;
  features: string[];
  care_and_warranty: string[];
  technical_info: RugTechnicalInfo;
}
