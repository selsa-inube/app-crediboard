import { IMakeDecisionsCreditRequest } from "@services/types";

interface IMakeDecisionsCreditRequestWithXAction {
  businessUnit: string;
  user: string;
  makeDecision: IMakeDecisionsCreditRequest;
  humanDecisionDescription: string;
  xAction: string;
}

export type { IMakeDecisionsCreditRequestWithXAction };
