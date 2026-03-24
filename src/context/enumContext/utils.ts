import { IAllEnumsResponse } from "@services/enumerators/types";

export const filterEnums = (
  enums: IAllEnumsResponse,
  enumKey: string,
  enumName: string,
) => {
  return enums?.[enumName]?.find((enumItem) => enumItem.code === enumKey);
};
