"use client";

import { CurrencyContext } from "@/context/currencyContext";
import { useEffect, useState, ReactNode } from "react";

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [eurToRub, setEurToRub] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://www.cbr-xml-daily.ru/daily_json.js");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();

        setEurToRub(data.Valute.EUR.Value);
      } catch (err) {
        console.error("❌ Kursni olishda xatolik:", err);
      }
    };
    fetchRate();
  }, []);

  // EUR -> RUB
  const convert = (eur: number): number | null => {
    if (eurToRub === null) return null;
    return +(eur * eurToRub).toFixed(2);
  };

  return (
    <CurrencyContext.Provider value={{ eurToRub, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
};
