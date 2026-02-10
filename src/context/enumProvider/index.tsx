import { useState, useEffect, useContext } from "react";

import { getAllEnums } from "@services/enumerators/getAllEnums";
import { AppContext } from "../AppContext";
import { EnumContext } from "@context/enumContext";
import { IAllEnumsResponse } from "@services/enumerators/types";

interface EnumProviderProps {
  children: React.ReactNode;
}

export function EnumProvider(props: EnumProviderProps) {
  const { children } = props;
  const [lang, setLang] = useState<"es" | "en">("es");
  const [enums, setEnums] = useState<IAllEnumsResponse | null>(null);

  const { businessUnitSigla, eventData } = useContext(AppContext);

  const businessUnitPublicCode = businessUnitSigla
    ? JSON.parse(businessUnitSigla).businessUnitPublicCode
    : "";

  const businessManagerCode = eventData.businessManager.publicCode;

  useEffect(() => {
    const browserLang = eventData.businessUnit.languageiso;
    setLang(browserLang === "en" ? "en" : "es");
  }, [eventData.businessUnit.languageiso]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllEnums(
          businessUnitPublicCode,
          businessManagerCode,
        );
        setEnums(data);
      } catch (error) {
        console.error("Error cargando enums", error);
      }
    };

    if (businessUnitPublicCode) {
      fetchData();
    }
  }, [businessUnitPublicCode, businessManagerCode]);

  return (
    <EnumContext.Provider value={{ lang, enums }}>
      {children}
    </EnumContext.Provider>
  );
}
