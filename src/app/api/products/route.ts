import { NextResponse } from "next/server";
import { RugProduct } from "@/types/product";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageParam = url.searchParams.get("page");
    const limitParam = url.searchParams.get("limit");

    const page = pageParam ? Number(pageParam) : null;
    const limit = limitParam ? Number(limitParam) : null;


    const products = (await import("@/context/data.json").then((m) => m.default)) as RugProduct[];


    const res = await fetch("https://www.cbr.ru/scripts/XML_daily.asp");
    const xmlText = await res.text();


    const usdMatch = xmlText.match(/<CharCode>USD<\/CharCode>[\s\S]*?<Value>([\d,]+)<\/Value>/);
    if (!usdMatch) {
      throw new Error("USD kursini topib bo‘lmadi");
    }
    const usdRate = parseFloat(usdMatch[1].replace(",", "."));

    let paginated = products;
    let hasMore = false;

    if (page && limit) {
      const start = (page - 1) * limit;
      const end = start + limit;
      paginated = products.slice(start, end);
      hasMore = end < products.length;
    }

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
      total: products.length,
      page: page ?? 1,
      limit: limit ?? products.length,
      hasMore,
      usdRate,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
