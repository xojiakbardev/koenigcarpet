"use client";

import { createContext } from "react";

type CurrencyContextType = {
  eurToRub: number | null;
  convert: (usd: number) => number | null;
};

export const CurrencyContext = createContext<CurrencyContextType>({
  eurToRub: null,
  convert: () => null,
});


