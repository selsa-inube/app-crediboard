export interface IBorrowerProperty {
  propertyName: string;
  propertyValue: string;
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
  schedule: string;
  installmentAmount: number;
  paymentChannelAbbreviatedName: string;
  gradientRate?: number;
  gradientValue?: number;
  gradientSchedule?: string;
  firstGradientDate?: Date;
  installmentAmountForCapital?: number;
}

export interface IInstallmentsForInterest {
  schedule: string;
  paymentChannelAbbreviatedName: string;
}

export interface IExtraordinaryInstallment {
  installmentDate: Date;
  installmentAmount: number;
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
  fixedPoints?: number;
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
  gracePeriodType: string;
  moneyDestinationAbbreviatedName: string;
  bondValue: number;
  borrowers: IBorrower[];
  creditProducts: ICreditProduct[];
  outlays: IOutlay[];
  consolidatedCredits?: IConsolidatedCredit[];
}