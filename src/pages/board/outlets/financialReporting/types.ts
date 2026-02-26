export interface IErrorsUnread {
  errorIssuedId: string;
  errorDescription: string;
}

export interface IErrorService {
  id: string;
  message: string | Error;
}

export interface IErrorService {
  id: string;
  message: string | Error;
}

export interface IDocumentData {
  documentId: string;
  fileName: string;
}
export interface IUpdateCreditProductPayload {
  creditRequestCode: string | undefined;
  creditProductCode: string;
  interestRate?: number;
  loanTerm?: number;
  loanAmount?: number;
  paymentChannelAbbreviatedName?: string;
  installmentAmount?: number;
  firstPaymentDate?: string;
  interestRateDueType?: string;
  interestRateType?: string;
  paymentChannelCyleName?: string;
  repaymentStructure?: string;
}
