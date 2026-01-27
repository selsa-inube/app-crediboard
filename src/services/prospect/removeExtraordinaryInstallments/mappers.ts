import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallmentsAddSeries,
} from "@services/prospect/types";

const mapExtraordinaryInstallmentsEntity = (
  data: IExtraordinaryInstallment | IExtraordinaryInstallmentsAddSeries,
): IExtraordinaryInstallment => {
  const creditRequest: IExtraordinaryInstallment = {
    creditProductCode: String(data.creditProductCode || ""),
    extraordinaryInstallments: Object(data.extraordinaryInstallments || ""),
    creditRequestCode: String(data.creditRequestCode || ""),
  };
  return creditRequest;
};

export { mapExtraordinaryInstallmentsEntity };
