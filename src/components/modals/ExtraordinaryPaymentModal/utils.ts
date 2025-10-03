import { updateExtraordinaryInstallments } from "@services/prospect/saveExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const updateExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments
) => {
  return updateExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    businessManagerCode,
  );
};

export { updateExtraordinaryInstallment };
