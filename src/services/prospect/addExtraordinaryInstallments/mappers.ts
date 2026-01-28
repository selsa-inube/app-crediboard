import {
  IExtraordinaryInstallment,
  IExtraordinaryInstallmentsAddSeries,
  IExtraordinaryInstallmentAddSeries,
  IExtraordinaryInstallments,
} from "@services/prospect/types";

const mapExtraordinaryInstallmentsEntity = (
  data:
    | IExtraordinaryInstallmentAddSeries
    | IExtraordinaryInstallmentsAddSeries
    | IExtraordinaryInstallments,
): IExtraordinaryInstallment => {
  const creditRequest: IExtraordinaryInstallment = {
    creditProductCode: String(data.creditProductCode || ""),
    extraordinaryInstallments: Object(data.extraordinaryInstallments || ""),
    creditRequestCode: String(data.creditRequestCode || ""),
  };
  return creditRequest;
};

export { mapExtraordinaryInstallmentsEntity };
