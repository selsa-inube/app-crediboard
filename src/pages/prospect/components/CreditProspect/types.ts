export interface IIncomeSources {
  Dividends: number;
  FinancialIncome: number;
  identificationNumber: string;
  identificationType: string;
  Leases: number;
  name: string;
  OtherNonSalaryEmoluments: number;
  PensionAllowances: number;
  PeriodicSalary: number;
  PersonalBusinessUtilities: number;
  ProfessionalFees: number;
  surname: string;
  edited?: boolean;
}
export interface IValidateRequirement {
  descriptionEvaluationRequirement: string;
  requirementName: string;
  requirementStatus: string;
}

export interface IIncomeDetails {
  incomeType: string;
  incomeValue: number;
}
export interface IIncomeSourceBorrowers {
  borrowerType: string;
  borrowerIdentificationNumber: string;
  totalIncome: number;
  primaryIncomeType: string;
  income: IIncomeDetails[];
}
