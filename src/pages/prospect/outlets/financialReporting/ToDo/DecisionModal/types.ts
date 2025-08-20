import { IMakeDecisionsCreditRequest } from "@services/creditRequest/command/types";

interface IMakeDecisionsCreditRequestWithXAction {
  businessUnit: string;
  user: string;
  makeDecision: IMakeDecisionsCreditRequest;
  humanDecisionDescription: string;
  xAction: string;
}

export type { IMakeDecisionsCreditRequestWithXAction };
