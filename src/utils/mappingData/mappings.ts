import { IProperty } from "@pages/prospect/components/TableObligationsFinancial/types";

export const getPropertyValue = (
  properties: IProperty[],
  propertyName: string,
) => {
  return (
    properties.find((prop) => prop.propertyName === propertyName)
      ?.propertyValue || ""
  );
};
