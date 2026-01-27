export interface IMakeDecisionsCreditRequestResponse {
  creditRequestId: string;
  status: string;
  humanDecision: string;
  executionDate: string;
  justification: string;
  justificacion?: string;
  statusServices?: number;
}
export interface IDeleteCreditRequest {
  creditRequestId: string;
  removalJustification: string;
}

export interface IMakeDecisionsCreditRequest {
  concept: string;
  creditRequestId: string;
  justification?: string;
  justificacion?: string;
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
  executedTask?: string;
  executionDate?: string;
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

export interface IRestoreIncome {
  borrowerIdentificationNumber: string;
  creditRequestCode: string;
  justification: string;
}

interface IIncome {
  dividends: number;
  financialIncome: number;
  leases: number;
  otherNonSalaryEmoluments: number;
  pensionAllowances: number;
  periodicSalary: number;
  personalBusinessUtilities: number;
  professionalFees: number;
}

export interface IRestoreIncomeResponse {
  borrowerIdentificationNumber: string;
  income: IIncome;
  creditRequestCode: string;
}
