import { patchOfRequirements } from "@services/patchOfRequirements";
import { IPatchOfRequirements } from "@services/types";

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
