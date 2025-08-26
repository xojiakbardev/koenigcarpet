export const NODE_ENV = process.env.NODE_ENV;
export const BASE_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
export const REDIS_HOST = process.env.NEXT_PUBLIC_REDIS_HOST;
export const REDIS_PORT = process.env.NEXT_PUBLIC_REDIS_PORT;
export const INTERNAL_API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
export const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;


type HomeCategory = {
  title: string;
  description: string;
  image: string;
  path: string;
};

export const HOME_CATEGORIES: Record<string, HomeCategory[]> = {
  en: [
    { title: "NEW RUGS", description: "LATEST RUG MODELS", image: "/static/image1.png", path: "/new-rugs" },
    { title: "ALL RUGS", description: "MADE TO ORDER RUG MODELS", image: "/static/image2.png", path: "/all-rugs" },
    { title: "MARQUISE", description: "INTENSE TEXTURED, VIBRANT COLORED RUGS", image: "/static/image3.png",  path: "/marquise" },
    { title: "ORIENTAL", description: "CLASSIC RUGS WITH MODERN TEXTURE", image: "/static/image4.png",  path: "/oriential" },
    { title: "AMORPH", description: "ORGANIC SHAPE RUGS INSPIRED BY NATURE", image: "/static/image5.png",  path: "/amorph" },
    { title: "ETHNIQUE", description: "MODERN RUGS WITH TRADITIONAL MOTIF", image: "/static/image6.png",  path: "/ethnique" },
    { title: "SHELL", description: "NATURAL COLORED MINIMAL RUGS", image: "/static/image7.png",  path: "/shell" },
  ],
  tr: [
    { title: "YENİ HALILAR", description: "EN SON HALI MODELLERİ", image: "/static/image1.png", path: "/new-rugs" },
    { title: "TÜM HALILAR", description: "SİPARİŞE GÖRE ÜRETİLEN HALI MODELLERİ", image: "/static/image2.png", path: "/all-rugs" },
    { title: "MARQUISE", description: "YOĞUN DOKULU, CANLI RENKLİ HALILAR", image: "/static/image3.png",  path: "/marquise" },
    { title: "ORIENTAL", description: "KLASİK HALILAR MODERN DOKU İLE", image: "/static/image4.png",  path: "/oriential" },
    { title: "AMORPH", description: "DOĞADAN İLHAM ALINMIŞ ORGANİK ŞEKİLLİ HALILAR", image: "/static/image5.png",  path: "/amorph" },
    { title: "ETHNIQUE", description: "GELENEKSEL MOTİF İLE MODERN HALILAR", image: "/static/image6.png",  path: "/ethnique" },
    { title: "SHELL", description: "DOĞAL RENKLİ MİNİMAL HALILAR", image: "/static/image7.png",  path: "/shell" },
  ],
  ru: [
    { title: "НОВЫЕ КОВРЫ", description: "ПОСЛЕДНИЕ МОДЕЛИ КОВРОВ", image: "/static/image1.png", path: "/new-rugs" },
    { title: "ВСЕ КОВРЫ", description: "ИЗГОТОВЛЕНЫ ПО ЗАКАЗУ", image: "/static/image2.png", path: "/all-rugs" },
    { title: "MARQUISE", description: "ИНТЕНСИВНАЯ ФАКТУРА, ЯРКИЕ ЦВЕТА", image: "/static/image3.png",  path: "/marquise" },
    { title: "ОРИЕНТАЛЬ", description: "КЛАССИЧЕСКИЕ КОВРЫ С СОВРЕМЕННОЙ ФАКТУРОЙ", image: "/static/image4.png",  path: "/oriential" },
    { title: "AMORPH", description: "ОРГАНИЧЕСКАЯ ФОРМА, ВДОХНОВЛЕННАЯ ПРИРОДОЙ", image: "/static/image5.png",  path: "/amorph" },
    { title: "ETHNIQUE", description: "МОДЕРН КОВРЫ С ТРАДИЦИОННЫМ МОТИВОМ", image: "/static/image6.png",  path: "/ethnique" },
    { title: "SHELL", description: "МИНИМАЛИСТИЧЕСКИЕ КОВРЫ НАТУРАЛЬНОГО ЦВЕТА", image: "/static/image7.png",  path: "/shell" },
  ],
};
