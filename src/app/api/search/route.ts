import { NextResponse } from "next/server";
import { Locale, localeConfig } from "@/localization/config";
import { RugProduct } from "@/types/product";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const acceptLanguage = (request.headers.get("accept-language") as Locale) ?? "";
    const locale = acceptLanguage || localeConfig.defaultLocale;

    const query = url.searchParams.get("query")?.toLowerCase().trim() ?? "";
    const page = Number(url.searchParams.get("page") || 1);
    const limit = Number(url.searchParams.get("limit") || 10);

    const products = (await import("@/context/data.json").then((m) => m.default)) as RugProduct[];

    let filteredProducts: RugProduct[] = products;

    if (query) {
      // Avval product_code bo‘yicha qidiruv
      const codeMatches = products.filter((item) => {
        if (!item.product_code) return false;
        const normalizedCode = item.product_code.toLowerCase().replace(/-/g, "");
        const normalizedQuery = query.replace(/-/g, "");
        return normalizedCode.includes(normalizedQuery);
      });

      if (codeMatches.length > 0) {
        filteredProducts = codeMatches;
      } else {
        // Agar code bo‘yicha topilmasa → faqat product_name bo‘yicha qidiruv
        filteredProducts = products.filter((item) => {
          const name = item.product_name?.[locale] || "";
          return name.toLowerCase().includes(query);
        });
      }
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filteredProducts.slice(start, end);

    return NextResponse.json({
      products: paginated,
      total: filteredProducts.length,
      page,
      limit,
      hasMore: end < filteredProducts.length,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
