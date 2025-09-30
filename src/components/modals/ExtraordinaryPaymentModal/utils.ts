import { updateExtraordinaryInstallments } from "@services/prospect/saveExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const updateExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments
) => {
  return updateExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode
  );
};

export { updateExtraordinaryInstallment };
