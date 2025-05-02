import { IDeleteCreditRequest } from "@pages/SubmitCreditApplication/types";

const mapRolesDeleteCreditRequestToApi = (
  deleteCreditRequest: IDeleteCreditRequest
): Record<string, string | number | object> => {
  return {
    removeCreditRequest: [
      {
        creditRequestId: String(deleteCreditRequest.creditRequestId),
        removalJustification: String(deleteCreditRequest.removalJustification),
      },
    ],
  };
};

export { mapRolesDeleteCreditRequestToApi };
