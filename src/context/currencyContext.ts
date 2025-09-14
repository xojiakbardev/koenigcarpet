"use client";

import { createContext } from "react";

type CurrencyContextType = {
  usdToRub: number | null;
  convert: (usd: number) => number | null;
};

export const CurrencyContext = createContext<CurrencyContextType>({
  usdToRub: null,
  convert: () => null,
});


