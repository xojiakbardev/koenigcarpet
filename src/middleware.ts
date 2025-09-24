import { type NextRequest, NextResponse } from "next/server";
import { localeMiddleware } from "./lib/middleware/localeMiddleware";

export async function middleware(req: NextRequest) {
  const localeResponse = await localeMiddleware(req);
  if (localeResponse) return localeResponse
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};