import { patchOfRequirements } from "@services/requirementsPackages/patchOfRequirements";
import { IPatchOfRequirements } from "@services/requirementsPackages/types";

export const saveRequirements = async (
  businessUnitPublicCode: string,
  creditRequests: IPatchOfRequirements
) => {
  let confirmationType = true;
  try {
    await patchOfRequirements(creditRequests, businessUnitPublicCode);
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
