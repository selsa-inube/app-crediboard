import { addExtraordinaryInstallments } from "@services/prospect/addExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const updateExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments
) => {
  return addExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
  );
};

export { updateExtraordinaryInstallment };
