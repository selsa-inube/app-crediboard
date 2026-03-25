import { IExtraordinaryInstallments } from "../query/ProspectByCode/types";

const mapExtraordinaryInstallmentsEntity = (
  data: IExtraordinaryInstallments,
): IExtraordinaryInstallments => {
  const creditRequest: IExtraordinaryInstallments = {
    creditRequestCode: String(data.creditRequestCode || ""),
    extraordinaryInstallments: Object(data.extraordinaryInstallments || ""),
  };
  return creditRequest;
};

export { mapExtraordinaryInstallmentsEntity };
