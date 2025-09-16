import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getDictionary } from "@/localization/dictionary";
import { Locale } from "@/localization/config";

type RequestBody = {
  to: string;    // 
  email: string;
};

export async function POST(req: Request) {
  try {
    const { to, email }: RequestBody = await req.json();

    if (!to || !email) {
      return NextResponse.json(
        { success: false, error: "invalid request" },
        { status: 400 }
      );
    }

    const locale = (req.headers.get("x-locale") as Locale) || "en";
    const dict = await getDictionary(locale);

   
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "process.env.EMAIL_USER",
        pass: "process.env.EMAIL_PASS",
      },
    });

   
    const info = await transporter.sendMail({
      from: `"koenigcarpet" <>`,
      to,
      subject: dict.footer.newsletter.title,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 16px; border: 1px solid #eee;">
          <h2>📩 ${dict.footer.newsletter.title}</h2>
          <p>${dict.footer.newsletter.message} <b>${email}</b></p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error("❌", error);
    return NextResponse.json(
      { success: false, error: "❌" },
      { status: 500 }
    );
  }
}
