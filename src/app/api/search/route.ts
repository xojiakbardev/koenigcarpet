import { NextResponse } from "next/server";
import { Locale, localeConfig } from "@/localization/config";
import { RugProduct } from "@/types/product";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const acceptLanguage = request.headers.get("accept-language") as Locale ?? "";
    const locale = acceptLanguage ?? localeConfig.defaultLocale
    const query = url.searchParams.get("query")?.toLowerCase() ?? "";

    const products = await import("@/context/data.json").then((m) => m.default) as RugProduct[];

    let filteredProducts = products;

    if (query) {
      filteredProducts = products.filter((item) => {
        const name = item.product_name[locale]
        const description = item.description[locale]
        const searchText = `${name} ${description}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      });
    }

    return NextResponse.json(
      {
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
