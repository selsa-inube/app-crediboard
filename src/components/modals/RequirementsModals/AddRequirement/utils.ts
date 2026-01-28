import { patchOfRequirements } from "@services/requirementsPackages/patchOfRequirements";
import { IPatchOfRequirements } from "@services/requirementsPackages/types";

export const saveRequirements = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequests: IPatchOfRequirements,
  token: string,
) => {
  let confirmationType = true;
  try {
    await patchOfRequirements(
      creditRequests,
      businessUnitPublicCode,
      businessManagerCode,
      token,
    );
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
