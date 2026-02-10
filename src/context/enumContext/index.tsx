import { createContext } from "react";
import { IAllEnumsResponse } from "@services/enumerators/types";

export interface EnumContextType {
  lang: "es" | "en";
  enums: IAllEnumsResponse | null;
}

export const EnumContext = createContext<EnumContextType | undefined>(
  undefined,
);
