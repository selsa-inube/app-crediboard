import { ICreditRequests } from "@services/creditRequest/command/types";
import { patchChangeUsersByCreditRequest } from "@services/creditRequest/command/patchChangeUsersByCreditRequest";

export const changeUsersByCreditRequest = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequests: ICreditRequests,
  userAccount: string,
  token: string,
) => {
  let confirmationType = true;
  try {
    await patchChangeUsersByCreditRequest(
      creditRequests,
      businessUnitPublicCode,
      businessManagerCode,
      userAccount,
      token,
    );
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
