export interface DocumentItem {
  creditRequestId: string;
  documentId: string;
  documentManagmentReference: string;
  abbreviatedName: string;
  fileName: string;
}

type ItemValidation = {
  [key: string]: "Y" | "N" | "";
};

export interface CreditRequest {
  credit_request_id: string;
  SYSTEM_VALIDATION: ItemValidation;
  DOCUMENT: ItemValidation;
  HUMAN_VALIDATION: ItemValidation;
}

export interface IRequirement {
  packageId: string;
  packageDate: string;
  uniqueReferenceNumber: string;
}
