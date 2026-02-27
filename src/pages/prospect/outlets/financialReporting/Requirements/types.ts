export interface DocumentItem {
  creditRequestId: string;
  documentId: string;
  documentManagmentReference: string;
  abbreviatedName: string;
  fileName: string;
}

type RequirementStatus = string;

export type RequirementType =
  | "SYSTEM_VALIDATION"
  | "DOCUMENT"
  | "HUMAN_VALIDATION";

export type MappedRequirements = {
  credit_request_id: string;
  SYSTEM_VALIDATION: Record<string, RequirementStatus>;
  DOCUMENT: Record<string, RequirementStatus>;
  HUMAN_VALIDATION: Record<string, RequirementStatus>;
};
export enum EUpdateMethod {
  Manual = "Manual",
  Automatic = "Automatic",
}

export interface ICreditRiskBureauUpdateMethod {
  bureauName: string;
  updateCreditScoreMethod: EUpdateMethod;
}
