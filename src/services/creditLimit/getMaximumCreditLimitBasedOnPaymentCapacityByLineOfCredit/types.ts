export interface IExtraordinaryInstallments {
  humanChannelPaymentDay: number;
  installmentAmount: number;
  installmentDate: string;
  paymentChannelAbbreviatedName: string;
}

export interface IMaximumCreditLimit {
  customerCode: string;
  dividends: number;
  financialIncome: number;
  leases: number;
  lineOfCreditAbbreviatedName: string;
  moneyDestination: string;
  otherNonSalaryEmoluments: number;
  pensionAllowances: number;
  periodicSalary: number;
  personalBusinessUtilities: number;
  professionalFees: number;
  basicLivingExpenseReserve?: number;
  extraordinaryInstallments?: IExtraordinaryInstallments[];
  maxAmount?: number;
  maxTerm?: number;
  maximumCreditLimitValue?: number;
  paymentCapacity?: number;
  totalIncomeReportedSources?: number;
}