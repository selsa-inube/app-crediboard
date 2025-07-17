import { saveExtraordinaryInstallments } from "@services/prospect/saveExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types/extraordInaryInstallments";

const saveExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments
) => {
  return saveExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode
  );
};

export { saveExtraordinaryInstallment };
