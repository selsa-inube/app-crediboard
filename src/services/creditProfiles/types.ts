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

export interface IPaymentCapacityById {
  totalMonthlyIncome: number;
  availableMonthlyPayment: number;
  availablePaymentPercentageRate: number;
}

export interface IUncoveredPortfolio {
  uncoveredPortfolio: number;
  permanentDeposits: number;
  exposureToIncomeRatio: number;
  reciprocityRatio: number;
}
export interface ICreditRepayamentBehavior {
  bureauCreditRiskScoreDate: string;
  bureauCreditRiskScoreValue: number;
  internalDelinquenciesAmount: number;
  maxOverdueInstallments: number;
}
