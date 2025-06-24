import { ICreditRequests } from "@services/types";
import { patchChangeUsersByCreditRequest } from "@services/credit-request/command/patchChangeUsersByCreditRequest";

export const changeUsersByCreditRequest = async (
  businessUnitPublicCode: string,
  creditRequests: ICreditRequests,
  userAccount: string
) => {
  let confirmationType = true;
  try {
    await patchChangeUsersByCreditRequest(
      creditRequests,
      businessUnitPublicCode,
      userAccount
    );
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
