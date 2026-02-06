import { addExtraordinaryInstallments } from "@services/prospect/addExtraordinaryInstallments";
import { IExtraordinaryInstallments } from "@services/prospect/types";

const updateExtraordinaryInstallment = (
  businessUnitPublicCode: string,
  extraordinaryInstallments: IExtraordinaryInstallments,
  token: string,
  xUserName: string,
) => {
  return addExtraordinaryInstallments(
    extraordinaryInstallments,
    businessUnitPublicCode,
    token,
    xUserName,
  );
};

export { updateExtraordinaryInstallment };
