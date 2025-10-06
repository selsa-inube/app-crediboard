import { IExtraordinaryInstallment } from "@services/prospect/types";

const mapExtraordinaryInstallmentsEntity = (
  data: IExtraordinaryInstallment
): IExtraordinaryInstallment => {
  const creditRequest: IExtraordinaryInstallment = {
    creditProductCode: String(data.creditProductCode || ""),
    extraordinaryInstallments: Object(data.extraordinaryInstallments || ""),
    prospectId: String(data.prospectId || ""),
  };
  return creditRequest;
};

export { mapExtraordinaryInstallmentsEntity };
