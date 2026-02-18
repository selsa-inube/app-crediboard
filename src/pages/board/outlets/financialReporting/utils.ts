import { deleteCreditRequests } from "@services/creditRequest/command/deleteCreditRequets";
import { IDeleteCreditRequest } from "@services/creditRequest/command/types";

export const deleteCreditRequest = async (
  businessUnitPublicCode: string,
  businessManagerCode: string,
  payload: IDeleteCreditRequest,
  token: string,
  userName: string,
) => {
  let confirmationType = true;
  try {
    await deleteCreditRequests(
      businessUnitPublicCode,
      businessManagerCode,
      payload,
      token,
      userName,
    );
  } catch (error) {
    confirmationType = false;
    throw error;
  }

  return confirmationType;
};
