export interface IExtraordinaryInstallment {
  installmentAmount?: number;
  installmentDate?: string;
  paymentChannelAbbreviatedName?: string;
  humanChannelPaymentDay?: string;
  id?: string;
  creditProductCode?: string;
  extraordinaryInstallments?: IExtraordinaryInstallment[];
  prospectId?: string;
  creditRequestCode?: string;
}
export interface IExtraordinaryInstallments {
  creditProductCode: string;
  extraordinaryInstallments: IExtraordinaryInstallment[];
  creditRequestCode: string;
  prospectId?: string;
}

export interface IExtraordinaryInstallmentAddSeries {
  id?: string;
  installmentDate: Date | string;
  installmentAmount: number;
  paymentChannelAbbreviatedName: string;
  humanChannelPaymentDay?: number;
  creditProductCode?: string;
  creditRequestCode?: string;
  extraordinaryInstallments?: IExtraordinaryInstallmentAddSeries[];
}

export interface IExtraordinaryInstallmentsAddSeries {
  creditProductCode: string;
  extraordinaryInstallments: IExtraordinaryInstallmentAddSeries[];
  prospectId?: string;
  creditRequestCode?: string;
}

export interface IAllDeductibleExpensesById {
  expenseName: string;
  expenseValue: number;
}

export interface IBorrowerProperty {
  propertyName: string;
  propertyValue: string;
  borrowerIdentificationNumber?: string;
}

export interface IBorrower {
  borrowerName: string;
  borrowerType: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
  borrowerProperties: IBorrowerProperty[];
}

export interface IConsolidatedCredit {
  creditProductCode: string;
  consolidatedAmount: number;
  consolidatedAmountType: string;
  estimatedDateOfConsolidation: Date;
  lineOfCreditDescription: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
}

export interface IOrdinaryInstallmentsForPrincipal {
  numberOfInstallments: number;
  installmentAmount: number;
  paymentChannelAbbreviatedName: string;
  schedule?: string;
  installmentAmountForCapital?: number;
  gradientRate?: number;
  gradientValue?: number;
  gradientSchedule?: string;
  firstGradientDate?: Date;
  installmentFrequency?: string;
}

export interface IInstallmentsForInterest {
  schedule: string;
  paymentChannelAbbreviatedName: string;
}

export interface IAcquiredCashFlow {
  amount: string;
  date: Date;
  paymentChannelAbbreviatedName: string;
  flowNumber: number;
}

export interface ICreditProduct {
  creditProductCode: string;
  loanAmount: number;
  lineOfCreditAbbreviatedName: string;
  interestRate: number;
  loanTerm: number;
  schedule: string;
  ordinaryInstallmentsForPrincipal: IOrdinaryInstallmentsForPrincipal[];
  installmentsForInterest?: IInstallmentsForInterest[];
  extraordinaryInstallments?: IExtraordinaryInstallment[];
  acquiredCashFlows?: IAcquiredCashFlow[];
  installmentFrequency?: string;
  referenceIndexForVariableInterestRate?: string;
  fixedPoints?: number;
  modeOfDisbursement?: string[];
}

export interface IOutlay {
  date: Date;
  amount: number;
}
export interface IProspect {
  prospectId: string;
  prospectCode: string;
  state: string;
  requestedAmount: number;
  installmentLimit: number;
  termLimit: number;
  timeOfCreation: Date;
  selectedRegularPaymentSchedule: string;
  selectedRateType: string;
  preferredPaymentChannelAbbreviatedName: string;
  gracePeriod: number;
  clientComments?: string;
  clientManagerObservation?: string;
  gracePeriodType: string;
  moneyDestinationAbbreviatedName: string;
  bondValue: number;
  borrowers: IBorrower[];
  consolidatedCredits: IConsolidatedCredit[];
  creditProducts: ICreditProduct[];
  outlays: IOutlay[];
}

export interface IProspectSummaryById {
  [key: string]: number | string;
  requestedAmount: number;
  deductibleExpenses: number;
  netAmountToDisburse: number;
  totalRegularInstallments: number;
  totalConsolidatedAmount: number;
}

export interface IProspectId {
  prospectId: string;
}

export interface IUpdateCreditProduct {
  creditProductCode: string;
  interestRate: number;
  loanTerm: number;
  creditRequestCode: string;
}
export interface ILinesOfCreditByMoneyDestination {
  abbreviateName: string;
  amortizationType: string[];
  description: string;
  maxAmount: number;
  maxEffectiveInterestRate: number;
  maxTerm: number;
  minAmount: number;
  minEffectiveInterestRate: number;
  minTerm: number;
}

export interface IAdditionalBorrowersAllowedResponse {
  additionalBorrowersAllowed: string;
}

export interface IExtraInstallmentsAllowedResponse {
  extraInstallmentsAllowed: string;
}

export interface IFinancialObligationsUpdateResponse {
  financialObligationsUpdateRequired: string;
}
