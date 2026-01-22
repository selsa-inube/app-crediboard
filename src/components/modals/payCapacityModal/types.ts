import { headers } from "./config";

type HeaderKey = (typeof headers)[number]["key"];

export type CurrentDataRow = Record<HeaderKey, string>;

export interface ISourcesOfIncomeState {
  Dividends: number;
  FinancialIncome: number;
  Leases: number;
  OtherNonSalaryEmoluments: number;
  PensionAllowances: number;
  PeriodicSalary: number;
  PersonalBusinessUtilities: number;
  ProfessionalFees: number;
  identificationNumber: string;
  identificationType: string;
  name: string;
  surname: string;
}
