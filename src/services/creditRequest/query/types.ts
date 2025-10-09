import {
  BorrowerProperties,
  GracePeriodType,
  Schedule,
} from "@services/enum/icorebanking-vi-crediboard/schedule";

export interface IAccountingVouchers {
  documentCode: string;
  obligationCode: string;
  accountingReference?: string;
  id: string;
  creditRequestId?: string;
  payrollDiscountAuthorizationCode?: string;
  promissoryNoteCode?: string;
}

export interface IApprovals {
  approverName: string;
  concept: string;
  error: boolean;
  approverIdentificationNumber: string;
  approverIdentificationType: string;
  approvalId: string;
  approverId: string;
}

export type DmEtapasPrs =
  | "CUMPLIMIENTO_REQUISITOS"
  | "FORMALIZACION_GARANTIAS"
  | "GESTION_COMERCIAL"
  | "TRAMITADA"
  | "TRAMITE_DESEMBOLSO"
  | "VERIFICACION_APROBACION";

export interface IUsersByCreditRequests {
  userId: string;
  userName: string;
  identificationType: string;
  identificationNumber: string;
  role: string;
}

export interface ICreditRequest {
  creditRequestId?: string;
  creditRequestCode: string;
  creditRequestDateOfCreation: string;
  loanAmount: number;
  clientId: string;
  moneyDestinationId: string;
  stage: DmEtapasPrs;
  moneyDestinationAbreviatedName: string;
  clientIdentificationNumber: string;
  clientName: string;
  taskToBeDone: string;
  unreadNovelties?: string;
  userWhoPinnnedId?: string;
  usersByCreditRequests?: IUsersByCreditRequests;
}

export interface IModeOfDisbursement {
  accountBankCode: string;
  accountBankName: string;
  accountNumber: string;
  accountType: string;
  creditRequestId: string;
  disbursementAmount: number;
  disbursementDate: string;
  disbursementReference: string;
  isInTheNameOfBorrower: string;
  modeOfDisbursementCode: string;
  modeOfDisbursementId: string;
  modeOfDisbursementType: string;
  observation: string;
  payeeBiologicalSex: string;
  payeeBirthday: string;
  payeeCityOfResidence: string;
  payeeEmail: string;
  payeeIdentificationNumber: string;
  payeeIdentificationType: string;
  payeeName: string;
  payeePersonType: string;
  payeePhoneNumber: string;
  payeeSurname: string;
  paymentOrderReference: string;
}

export interface IStaff {
  userId: string;
  userName: string;
  identificationType: string;
  identificationNumber: string;
  role: string;
}

export interface IToDo {
  creditRequestId: string;
  creditRequestCode: string;
  CreditRequestStateId: string;
  creditRequestStateAbbreviatedName: string;
  stage: string;
  taskToBeDone: string;
  usersByCreditRequestResponse: IStaff[];
  prospectId: string;
}

export interface IMortgages {
  descriptionUse: string;
  guaranteeId: string;
  mortgageId: string;
  propertyAge: string;
  propertyPrice: number;
  propertyType: string;
  propertyState: string;
}

export interface IPledges {
  descriptionUse: string;
  guaranteeId: string;
  pledgeId: string;
  vehiculeAge: string;
  vehiculePrice: number;
  vehiculeState: string;
}

export interface IGuarantees {
  creditRequestId: string;
  guaranteeId: string;
  guaranteeType: string;
  mortgages: IMortgages[];
  pledges: IPledges[];
}

export interface ICreditRequestPinned {
  creditRequestId: string;
  isPinned: string;
}

export interface IPayrollDiscountAuthorization {
  creditRequestId: string;
  payrollDiscountAuthorizationId: string;
  payrollDiscountAuthorizationCode: string;
  descriptionUse: string;
  abbreviatedName: string;
  borrowerId: string;
  borrowerName: string;
  documentState: string;
  obligationCode: string;
  documentCode: string;
  imageCode: string;
  borrowerIdentificationType: string;
  borrowerIdentificationNumber: string;
}

export interface IBorrowerProperty {
  property_name: (typeof BorrowerProperties)[keyof typeof BorrowerProperties];
  property_value: string;
}

export interface IBorrower {
  borrower_name: string;
  borrower_type: string;
  borrower_identification_type: string;
  borrower_identification_number: string;
  borrower_property: IBorrowerProperty[];
}

export interface IPromissoryNotes {
  creditRequestId: string;
  promissory_note_id: string;
  promissory_note_code: string;
  descriptionUse: string;
  abbreviatedName: string;
  CreditProductId: string;
  documentState: string;
  obligationCode: string;
  documentCode: string;
  imageCode: string;
  BorrowersByPromissoryNotes: IBorrower[];
  TransactionOperation: string;
  payrollDiscountAuthorizationId: string;
}

export interface IConsolidatedCredit {
  consolidated_amount: number;
  consolidated_amount_type: string;
  estimated_date_of_consolidation: string;
  credit_id: string;
  line_of_credit_description: string;
  borrower_id: string;
  consolidated_credit_schema: string;
  monthly_salary?: number;
  other_monthly_payments?: number;
  pension_allowances?: number;
  leases?: number;
  dividends_or_shares?: number;
  financial_returns?: number;
  average_monthly_profit?: number;
  monthly_fees?: number;
}

export interface IOrdinaryInstallmentsForPrincipal {
  term: number;
  number_of_installments: number;
  schedule: Schedule;
  installment_amount_for_capital: number;
  installment_amount: number;
  gradient_rate: number;
  gradient_value: number;
  gradient_schedule: string;
  first_gradient_date: string;
  payment_channel_code: string;
}

export interface IInstallmentsForInterest {
  schedule: Schedule;
  payment_channel_code: string;
}

export interface IExtraordinaryInstallment {
  installment_amount: number;
  installment_date: string;
  payment_channel_code: string;
}

export interface IAcquiredCashFlow {
  amount: string;
  date: string;
  payment_channel_unique_code: string;
  flow_number: number;
}

export interface ICreditProductProspect {
  abbreviated_name: string;
  credit_product_code: string;
  loan_amount: number;
  line_of_credit_code: string;
  line_of_credit_abbreviated_name: string;
  interest_rate: number;
  fixed_points: number;
  loan_term: number;
  schedule: Schedule;
  ordinary_installment_for_principal?: IOrdinaryInstallmentsForPrincipal;
  ordinary_installment_for_interest: IInstallmentsForInterest;
  extraordinary_installment: IExtraordinaryInstallment;
  acquired_cash_flow: IAcquiredCashFlow;
}

export interface IOutlay {
  abreviated_name: string;
  date: string;
  amount: number;
}
export interface IRemoveCreditProduct {
  creditProductCode: string;
  prospectId: string;
}
export interface IProspect {
  prospect_id: string;
  public_code: string;
  state: string;
  loan_amount: number;
  installment_limit: number;
  term_limit: number;
  timestamp: string;
  selected_payment_schedule: Schedule;
  selected_rate_type: string;
  payment_method: string;
  grace_period: number;
  grace_period_type: (typeof GracePeriodType)[keyof typeof GracePeriodType];
  borrower: IBorrower[];
  consolidated_credit: IConsolidatedCredit[];
  credit_product: ICreditProductProspect[];
  outlay: IOutlay[];
  borrowers?: unknown;
  requested_amount?: number;
}

export interface IDecisionsToDo {
  id: number | string;
  label: string;
  value: string;
}
