"use client";

import { CurrencyContext } from "@/context/currencyContext";
import {
  useEffect,
  useState,
  ReactNode,
} from "react";


export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [usdToRub, setUsdToRub] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
        const data = await res.json();
        setUsdToRub(data.Valute.USD.Value as number);
      } catch (err) {
        console.error("❌ Kursni olishda xatolik:", err);
      }
    };

    fetchRate();
  }, []);

  const convert = (usd: number): number | null => {
    if (!usdToRub) return null;
    return +(usd * usdToRub).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ usdToRub, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};
