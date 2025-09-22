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
      const codeMatches = products.filter((item) => {
        if (!item.product_code) return false;
        const normalizedCode = item.product_code.toLowerCase().replace(/-/g, "");
        const normalizedQuery = query.replace(/-/g, "");
        return normalizedCode.includes(normalizedQuery);
      });

      if (codeMatches.length > 0) {
        filteredProducts = codeMatches;
      } else {
        filteredProducts = products.filter((item) => {
          const name = item.product_name?.[locale] || "";
          return name.toLowerCase().includes(query);
        });
      }
    }

    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filteredProducts.slice(start, end);


    const res = await fetch("https://www.cbr.ru/scripts/XML_daily.asp");
    const xmlText = await res.text();

    const usdMatch = xmlText.match(/<CharCode>USD<\/CharCode>[\s\S]*?<Value>([\d,]+)<\/Value>/);
    if (!usdMatch) {
      throw new Error("USD kursini topib bo‘lmadi");
    }
    const usdRate = parseFloat(usdMatch[1].replace(",", "."));

    const updatedProducts = paginated.map((p) => {
      let priceNum = typeof p.price === "string" ? parseFloat(p.price) : Number(p.price);
      if (isNaN(priceNum)) priceNum = 0;


      const priceWithPercent = priceNum * 1.02;


      const priceInRub = Number((priceWithPercent * usdRate).toFixed(2));

      return {
        ...p,
        price: priceInRub,
        currency: "RUB",
      };
    });

    return NextResponse.json({
      products: updatedProducts,
      total: filteredProducts.length,
      page,
      limit,
      hasMore: end < filteredProducts.length,
      usdRate,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
