import { IExtraordinaryInstallment } from "@services/prospect/types";

const mapExtraordinaryInstallmentsEntity = (
  data: IExtraordinaryInstallment
): IExtraordinaryInstallment => {
  const creditRequest: IExtraordinaryInstallment = {
    creditProductCode: String(data.creditProductCode || ""),
    extraordinaryInstallments: Object(data.extraordinaryInstallments || ""),
    creditRequestCode: String(data.creditRequestCode || ""),
  };
  return creditRequest;
};

export { mapExtraordinaryInstallmentsEntity };
