import { removeExtraordinaryInstallments } from "@services/creditLimit/removeExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/creditRequest/query/ProspectByCode/types";

const removeExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
  authorizationToken: string,
) => {
  return removeExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    authorizationToken,
  );
};

export { removeExtraordinaryInstallment };
