import { deleteCreditRequests } from "@services/creditRequest/command/deleteCreditRequets";
import { IDeleteCreditRequest } from "@services/creditRequest/command/types";

export const deleteCreditRequest = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  creditRequests: IDeleteCreditRequest,
  token: string
) => {
  let confirmationType = true;
  try {
    await deleteCreditRequests(creditRequests, businessUnitPublicCode, businessManagerCode, token);
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
