interface IVariables {
  variableDescription: string;
  variableName: string;
  variableScore: number;
  variableValue: string;
}

export interface ICreditRiskScoreResponse {
  minCreditRiskScore: number;
  totalCreditRiskScore: number;
  variables: IVariables[];
}

export interface ICreditRepayamentBehavior {
  bureauCreditRiskScoreDate: string,
  bureauCreditRiskScoreValue: number,
  internalDelinquenciesAmount: number,
  maxOverdueInstallments: number
}