import { NextRequest, NextResponse } from 'next/server';
import { RugProduct } from "@/types/product";
import { Locale } from "@/localization/config";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; 

  try {
    if (!id) {
      return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
    }

    const locale = request.headers.get("accept-language") as Locale;

    const products = (await import("@/context/data.json").then((m) => m.default)) as RugProduct[];

    const res = await fetch("https://www.cbr.ru/scripts/XML_daily.asp");
    const xmlText = await res.text();
    const eurMatch = xmlText.match(/<CharCode>EUR<\/CharCode>[\s\S]*?<Value>([\d,]+)<\/Value>/);
    const eurRate = eurMatch ? parseFloat(eurMatch[1].replace(",", ".")) : 1;

    const currentProduct = products.find((p) => p.id === Number(id));
    if (!currentProduct) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    let priceNum = typeof currentProduct.price === "string" ? parseFloat(currentProduct.price) : Number(currentProduct.price);
    if (isNaN(priceNum)) priceNum = 0;
    const priceWithPercent = priceNum * 1.02;
    const priceInRub = Number((priceWithPercent * eurRate).toFixed(2));

    const productWithPrice = { ...currentProduct, price: priceInRub, currency: "RUB" };

    // Related products
    const relatedProducts = products.filter((rug) => {
      if (!rug.product_name?.[locale] || !currentProduct.product_name?.[locale]) return false;
      const firstWordRug = rug.product_name[locale].split(" ")[0];
      const firstWordCurrent = currentProduct.product_name[locale].split(" ")[0];
      return rug.id !== currentProduct.id && firstWordRug === firstWordCurrent;
    }).map((p) => {
      let pPriceNum = typeof p.price === "string" ? parseFloat(p.price) : Number(p.price);
      if (isNaN(pPriceNum)) pPriceNum = 0;
      const priceWithPercent = pPriceNum * 1.02;
      const priceInRub = Number((priceWithPercent * eurRate).toFixed(2));
      return { ...p, price: priceInRub, currency: "RUB" };
    });

    return NextResponse.json({
      success: true,
      product: productWithPrice,
      relatedProducts,
      eurRate,
      lang: locale,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}