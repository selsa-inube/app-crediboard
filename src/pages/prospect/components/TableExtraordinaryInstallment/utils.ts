import { removeExtraordinaryInstallments } from "@services/prospect/removeExtraordinaryInstallments";
import {
  IExtraordinaryInstallments,
  IExtraordinaryInstallmentsAddSeries,
} from "@services/prospect/types";

const removeExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments:
    | IExtraordinaryInstallments
    | IExtraordinaryInstallmentsAddSeries,
  token: string,
) => {
  return removeExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    token,
  );
};

export { removeExtraordinaryInstallment };
