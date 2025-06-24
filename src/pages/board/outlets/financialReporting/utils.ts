import { deleteCreditRequests } from "@services/credit-request/command/deleteCreditRequets";
import { IDeleteCreditRequest } from "@services/types";

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
