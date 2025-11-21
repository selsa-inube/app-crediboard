import { ICreditRequests } from "../types";

const mapCreditRequestsEntity = (data: ICreditRequests): ICreditRequests => {
  const creditRequest: ICreditRequests = {
    creditRequestCode: String(data.creditRequestCode || ""),
    creditRequestId: String(data.creditRequestId || ""),
    executedTask: String(data.executedTask|| ""),
    executionDate: String(data.executionDate|| ""),
    identificationNumber: String(data.identificationNumber || ""),
    identificationType: String(data.identificationType || ""),
    justification: String(data.justification || ""),
    role: String(data.role || ""),
    transactionOperation: String(data.transactionOperation || ""),
    userId: String(data.userId || ""),
    userName: String(data.userName || ""),
  };
  return creditRequest;
};

export { mapCreditRequestsEntity };
