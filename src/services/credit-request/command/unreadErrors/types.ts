export interface IUnreadErrors {
  creditRequestId: string;
}

export interface IUnreadErrorsResponse {
  actionId: string;
  creditRequestId: string;
  errorDate: string;
  errorDescription: string;
  errorIssuedId: string;
  errorRead: string;
  transactionOperation: "Insert";
  userId: string;
}
