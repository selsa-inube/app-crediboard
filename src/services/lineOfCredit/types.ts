export interface ISearchAllModesOfDisbursementTypes {
  modesOfDisbursementTypes: string[];
}

export interface CreditLineGeneralTerms {
  abbreviateName: string;
  description: string;
  minTerm: number;
  maxTerm: number;
  minAmount: number;
  maxAmount: number;
  minEffectiveInterestRate: number;
  maxEffectiveInterestRate: number;
  amortizationType: string[];
}
