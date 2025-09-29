/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

import { EnumContextType } from "./types";

interface EnumProviderProps {
  children: React.ReactNode;
}

export const EnumContext = createContext<EnumContextType | undefined>(
  undefined
);

export function EnumProvider(props: EnumProviderProps) {
  const { children } = props;
  const [lang, setLang] = useState<"es" | "en">("es");

  useEffect(() => {
    const browserLang = navigator.language.startsWith("es") ? "es" : "en";
    setLang(browserLang as "es" | "en");
  }, []);

  return (
    <EnumContext.Provider value={{ lang }}>{children}</EnumContext.Provider>
  );
}
