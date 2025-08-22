export interface RugProduct {
  product_name: {
    en: string;
    ru: string;
    tr: string;
  };
  description: {
    en: string;
    ru: string;
    tr: string;
  };
  features: {
    en: {
      head: string;
      care_and_warranty: string[];
      technical_info: string[];
    };
    ru: {
      head: string;
      care_and_warranty: string[];
      technical_info: string[];
    };
    tr: {
      head: string;
      care_and_warranty: string[];
      technical_info: string[];
    };
  };
  color: {
    en: string;
    ru: string;
    tr: string;
    value: string;
  };
  collection: {
    en: string;
    ru: string;
    tr: string;
    value: string;
  };
  style:{
    en: string;
    ru: string;
    tr: string;
    value: string;
  }
  sizes: string[];
  url: string;
  product_code: string;
  price: string;
  images: string[];
  id: number;
}
