import { deleteCreditRequests } from "@services/creditRequest/command/deleteCreditRequets";
import { IDeleteCreditRequest } from "@services/creditRequest/command/types";

export const deleteCreditRequest = async (
  businessUnitPublicCode: string,
  creditRequests: IDeleteCreditRequest
) => {
  let confirmationType = true;
  try {
    await deleteCreditRequests(creditRequests, businessUnitPublicCode);
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
