import { IMakeDecisionsCreditRequest } from "@services/creditRequest/command/types";

interface IMakeDecisionsCreditRequestWithXAction {
  businessUnit: string;
  user: string;
  makeDecision: IMakeDecisionsCreditRequest;
  humanDecisionDescription: string;
  xAction: string;
}

interface IMakeDecisionsPayload {
  creditRequestId: string;
  humanDecision: string;
  justification: string;
  nonCompliantDocuments?: string[];
  registerIndividualConcept?: boolean;
}

export type { IMakeDecisionsCreditRequestWithXAction, IMakeDecisionsPayload };
