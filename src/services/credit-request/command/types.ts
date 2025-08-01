export interface IMakeDecisionsCreditRequestResponse {
  creditRequestId: string;
  status: string;
  humanDecision: string;
  executionDate: string;
  justification: string;
  statusServices?: number;
}
