import { NextResponse } from "next/server";
import { Locale, localeConfig } from "@/localization/config";
import { RugProduct } from "@/types/product";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const locale =
      (searchParams.get("locale") as Locale) || localeConfig.defaultLocale;

    const products = await import("@/context/data.json").then((m) => m.default) as RugProduct[];

    let filteredProducts = products;

    if (query) {
      filteredProducts = products.filter((product) => {
        const name =
          product.product_name?.[locale] ||
          product.product_name?.en ||
          "";
        const description =
          product.description?.[locale] ||
          product.description?.en ||
          "";
        const searchText = `${name} ${description}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
    }

    return NextResponse.json({
      success: true,
      products: filteredProducts,
      total: filteredProducts.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
