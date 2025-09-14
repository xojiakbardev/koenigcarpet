import { CurrencyContext } from "@/context/currencyContext";
import { useContext } from "react";

export const useCurrency = () => useContext(CurrencyContext);
