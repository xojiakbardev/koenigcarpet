import { createContext } from "react";
import { Dictionary } from "@/localization/getDictionary";

export type LocaleContextType = {
  dictionary: Dictionary | object
};

export const LocaleContext = createContext<LocaleContextType>({ dictionary: {} });
