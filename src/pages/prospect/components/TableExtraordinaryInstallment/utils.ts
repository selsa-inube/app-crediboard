import { removeExtraordinaryInstallments } from "@services/prospect/removeExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const removeExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
  token: string
) => {
  return removeExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    token
  );
};

export { removeExtraordinaryInstallment };
