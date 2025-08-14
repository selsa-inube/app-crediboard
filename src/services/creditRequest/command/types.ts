export interface IDeleteCreditRequest {
  creditRequestId: string;
  removalJustification: string;
}

export interface IMakeDecisionsCreditRequest {
  creditRequestId: string;
  humanDecision: string;
  justification: string;
}

export interface INotificationOnApprovals {
  approvalId: string;
  creditRequestId: string;
}
export interface INotificationOnApprovalsResponse {
  codeNotification: string;
}

export interface ICreditRequests {
  creditRequestId: string;
  creditRequestCode?: string;
  executed_task?: string;
  execution_date?: string;
  identificationNumber?: string;
  identificationType?: string;
  justification?: string;
  role?: string;
  transactionOperation?: string;
  userId?: string;
  userName?: string;
  staffName?: string;
}

export interface IPatchChangeTracesToReadById {
  creditRequestId: string;
  traceId?: string;
  traceValue?: string;
  userId?: string;
  userName?: string;
  executionDate?: string;
  traceType?: string;
}

export interface ITraceType {
  traceValue: string;
  executionDate: string;
  traceType: string;
  creditRequestId?: string;
  userName?: string;
  userId?: string;
  traceId?: string;
  useCase?: string;
  justification?: string;
  decisionTakenByUser?: string;
  decision_of_concept?: string;
  readNovelty?: string;
}

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

export interface IPaymentChannel {
  id: string;
  label: string;
  value: string;
}
