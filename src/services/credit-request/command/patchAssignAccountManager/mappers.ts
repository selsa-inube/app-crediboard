import { ICreditRequests } from "@services/types";

const mapCreditRequestsEntity = (data: string): ICreditRequests => {
  const creditRequest: ICreditRequests = {
    creditRequestId: String(data),
  };
  return creditRequest;
};

export { mapCreditRequestsEntity };
