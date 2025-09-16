"use client";

import { CurrencyContext } from "@/context/currencyContext";
import { useEffect, useState, ReactNode } from "react";

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [usdToRub, setUsdToRub] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        // 1 USD necha RUB ekanligini olamiz
        setUsdToRub(data.Valute.USD.Value);
      } catch (err) {
        console.error("❌ Kursni olishda xatolik:", err);
      }
    };
    fetchRate();
  }, []);

  // USD -> RUB
  const convert = (usd: number): number | null => {
    if (usdToRub === null) return null;
    return +(usd * usdToRub).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ usdToRub, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};
