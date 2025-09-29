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
