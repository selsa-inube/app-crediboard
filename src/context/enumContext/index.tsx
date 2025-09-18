/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";

interface EnumContextType {
  lang: "es" | "en";
}

export const EnumContext = createContext<EnumContextType | undefined>(
  undefined
);

export const EnumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lang, setLang] = useState<"es" | "en">("es");

  useEffect(() => {
    const browserLang = navigator.language.startsWith("es") ? "es" : "en";
    setLang(browserLang as "es" | "en");
  }, []);

  return (
    <EnumContext.Provider value={{ lang }}>{children}</EnumContext.Provider>
  );
};
