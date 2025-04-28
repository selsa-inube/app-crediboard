import { ICreditRequests } from "@pages/SubmitCreditApplication/types";

const mapCreditRequestsEntity = (data: ICreditRequests): ICreditRequests => {
  const creditRequest: ICreditRequests = {
    creditRequestCode: String(data.creditRequestCode || ""),
    creditRequestId: String(data.creditRequestId || ""),
    executed_task: String(data.executed_task || ""),
    execution_date: String(data.execution_date || ""),
    identificationNumber: String(data.identificationNumber || ""),
    identificationType: String(data.identificationType || ""),
    justification: String(data.justification || ""),
    position: String(data.position || ""),
    transactionOperation: String(data.transactionOperation || ""),
    userId: String(data.userId || ""),
    userName: String(data.userName || ""),
  };
  return creditRequest;
};

export { mapCreditRequestsEntity };
