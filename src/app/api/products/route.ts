import { NextResponse } from "next/server";
import { RugProduct } from "@/types/product";
import { Locale } from "@/localization/config";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");
    const sortBy = url.searchParams.get("sortBy") ?? "";

    const page = pageParam ? Number(pageParam) : null;
    const limit = limitParam ? Number(limitParam) : null;

    const lang = request.headers.get("accept-language") as Locale;

    const products = (await import("@/context/data.json").then((m) => m.default)) as RugProduct[];

    // CBR dan kurslarni olish
    const res = await fetch("https://www.cbr.ru/scripts/XML_daily.asp");
    const xmlText = await res.text();

    // EUR kursini ajratib olish
    const eurMatch = xmlText.match(/<CharCode>EUR<\/CharCode>[\s\S]*?<Value>([\d,]+)<\/Value>/);
    if (!eurMatch) {
      throw new Error("EUR kursini topib bo‘lmadi");
    }
    const eurRate = parseFloat(eurMatch[1].replace(",", "."));

    let paginated = products;
    let hasMore = false;

    if (page && limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      paginated = products.slice(start, end);
      hasMore = end < products.length;
    }

    let updatedProducts = paginated.map((p) => {
      let priceNum = typeof p.price === "string" ? parseFloat(p.price) : Number(p.price);
      if (isNaN(priceNum)) priceNum = 0;

      const priceWithPercent = priceNum * 1.02;
      const priceInRub = Number((priceWithPercent * eurRate).toFixed(2));

      return {
        ...p,
        price: priceInRub,
        currency: "RUB",
      };
    });

    if (sortBy && sortBy !== "default") {
      updatedProducts = [...updatedProducts].sort((a, b) => {
        switch (sortBy) {
          case "name_asc":
            return a.product_name[lang].localeCompare(b.product_name[lang]);
          case "name_desc":
            return b.product_name[lang].localeCompare(a.product_name[lang]);
          case "price_asc":
            return a.price - b.price;
          case "price_desc":
            return b.price - a.price;
          case "stock_code":
            return a.product_code.localeCompare(b.product_code);
          case "newest":
            return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
          case "oldest":
            return (a.isNew ? 1 : 0) - (b.isNew ? 1 : 0);
          default:
            return 0;
        }
      });
    }

    return NextResponse.json({
      products: updatedProducts,
      total: products.length,
      page: page ?? 1,
      limit: limit ?? products.length,
      hasMore,
      eurRate,
      lang,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
