import { NextResponse } from "next/server";
import { getDictionary } from "@/localization/dictionary";
import { Locale } from "@/localization/config";

const BOT_TOKEN = "8385602601:AAF-95bgI4WfLVz4vaGfKC5e9QhP4Kn8J4Q";
const CHAT_IDS = [5738468941, 5050150433, 6977560174];

export async function POST(req: Request) {
  try {
    const { name, phone, cart, subtotal } =
      await req.json();

    if (!name || !phone  || !cart) {
      return NextResponse.json(
        { success: false, error: "❌ Missing params" },
        { status: 400 }
      );
    }

    const locale = req.headers.get("x-locale") as Locale;
    const dict = await getDictionary(locale);

    const orderText = `
<b>${dict.cart.order.newOrder}</b>\n
👤 <b>${dict.cart.order.name}:</b> ${name}
📞 <b>${dict.cart.order.phone}:</b> ${phone}
<b>${dict.cart.order.cart}:</b>
${cart
  .map(
    (ci: any, i: number) =>
      `${i + 1}) <b>${ci.item.product_name[locale]}</b> (${ci.size} cm) 
   🔢 ${dict.cart.quantity}: ${ci.quantity} 
   💵  ${ci.item.price}₽
   ${dict.cart.order.subtotal}:${ci.totalPrice}₽\n
   <b>${dict.cart.order.stock}</b>: ${ci.item.product_code}`
  )
  .join("\n\n")}
━━━━━━━━━━━━━━━
💰 <b>${dict.cart.order.subtotal}:</b> ${subtotal}₽
    `;

    await Promise.all(
      CHAT_IDS.map((chatId) =>
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: orderText,
            parse_mode: "HTML",
          }),
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
