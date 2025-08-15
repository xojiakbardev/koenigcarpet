"use client";

import { FC, ReactNode } from "react";
import { Dictionary } from "@/localization/getDictionary";
import { LocaleContext } from "@/context/localeContext";

type LocaleProviderProps = {
  children: ReactNode;
  dictionary: Dictionary;
};

export const LocaleProvider: FC<LocaleProviderProps> = ({ children, dictionary }) => {
  return (
    <LocaleContext.Provider value={{ dictionary }}>
      {children}
    </LocaleContext.Provider>
  );
};
