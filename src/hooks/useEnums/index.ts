import { useContext } from "react";

import { EnumContext } from "@context/enumContext";

export const useEnums = () => {
  const context = useContext(EnumContext);
  if (!context) {
    throw new Error("Error EnumProvider");
  }
  return context;
};
