export const NODE_ENV = process.env.NODE_ENV;
export const BASE_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
export const REDIS_HOST = process.env.NEXT_PUBLIC_REDIS_HOST;
export const REDIS_PORT = process.env.NEXT_PUBLIC_REDIS_PORT;
export const INTERNAL_API_URL = process.env.NEXT_PUBLIC_INTERNAL_API_URL;
export const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_EXTERNAL_API_URL;
export const SIDEBAR_LINKS = [
  {
    "title": "all rugs",
    "path": "/all-rugs"
  },
  {
    "title": "rugs in stock",
    "path": "/rugs-in-stock"
  },
  {
    "title": "new rugs",
    "path": "/new-rugs"
  },
  {
    "title": "collection",
    "children": [
      { "title": "amorph" },
      { "title": "coral" },
      { "title": "crystal" },
      { "title": "ethnique" },
      { "title": "istanbul" },
      { "title": "marquise" },
      { "title": "marrakesh" },
      { "title": "monochrome" },
      { "title": "naturale" },
      { "title": "oriental" },
      { "title": "patch" },
      { "title": "pearl" },
      { "title": "plain" },
      { "title": "sapphire" },
      { "title": "shell" },
      { "title": "trinity" },
      { "title": "vintage" }
    ]
  },
  {
    "title": "colors",
    "children": [
      { "title": "beige" },
      { "title": "white" },
      { "title": "multi-color" },
      { "title": "ecru" },
      { "title": "grey" },
      { "title": "brown" },
      { "title": "red" },
      { "title": "blue" },
      { "title": "purple" },
      { "title": "pink" },
      { "title": "yellow" },
      { "title": "black" },
      { "title": "orange" },
      { "title": "green" }
    ]
  },
  {
    "title": "style",
    "children": [
      { "title": "abstract" },
      { "title": "amorphous" },
      { "title": "art" },
      { "title": "art deco" },
      { "title": "bordered" },
      { "title": "floral" },
      { "title": "solid" },
      { "title": "ethnic" },
      { "title": "geometric" },
      { "title": "classic" },
      { "title": "modern" },
      { "title": "patchwork" }
    ]
  },
  {
    "title": "runners",
    "path": "/runners"
  },
  {
    "title": "our projects",
    "path": "/our-projects"
  },
  {
    "title": "contact",
    "path": "/contact"
  },
  {
    "title": "faq",
    "path": "/faq"
  }
]

export   const HOME_CATEGORIES = [
    { title: "NEW RUGS", description: "LATEST RUG MODELS", image: "/static/image1.png", type: `` },
    { title: "ALL RUGS", description: "MADE TO ORDER RUG MODELS", image: "/static/image2.png", type: `` },
    { title: "MARQUISE", description: "INTENSE TEXTURED, VIBRANT COLORED RUGS", image: "/static/image3.png", type: `collection}` },
    { title: "ORIENTAL", description: "CLASSIC RUGS WITH MODERN TEXTURE", image: "/static/image4.png", type: `collection` },
    { title: "AMORPH", description: "ORGANIC SHAPE RUGS INSPIRED BY NATURE", image: "/static/image5.png", type: `collection` },
    { title: "ETHNIQUE", description: "MODERN RUGS WITH TRADITIONAL MOTIF", image: "/static/image6.png", type: `collection` },
    { title: "SHELL", description: "NATURAL COLORED MINIMAL RUGS", image: "/static/image7.png", type: `collection` },
  ];