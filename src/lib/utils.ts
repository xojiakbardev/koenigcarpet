import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export function getBaseUrl(headers: Headers) {
    const host = headers.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

    return `${protocol}://${host}`;
}