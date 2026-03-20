import * as Yup from "yup";

import { ICrediboardData } from "@context/AppContext/types";
import { EnumType } from "@hooks/useEnum";
import { IProspect } from "@services/creditRequest/query/ProspectByCode/types";
import { ICustomerData as ICustomerDataConfig } from "./config";

import { IPaymentConfiguration } from "./steps/config";

export interface ICustomerData {
  customerId: string;
  publicCode: string;
  fullName: string;
  natureClient: string;
  generalAttributeClientNaturalPersons: {
    employmentType: string;
    associateType: string;
    typeIdentification: string;
    firstNames: string;
    lastNames: string;
    emailContact: string;
    cellPhoneContact: string;
    gender: string;
    dateBirth: string;
    zone: string;
  }[];
  generalAssociateAttributes: {
    affiliateSeniorityDate: string;
    partnerStatus: string;
  }[];
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

export interface IAddProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: IFormValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: Partial<IFormValues>;
  moneyDestination: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataProspect: IProspect;
  isLoading: boolean;
  lang: EnumType;
  eventData: ICrediboardData;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  customerData?: ICustomerDataConfig;
}

export interface IAddProductModalUIProps {
  title: string;
  setCurrentStep: (step: number) => void;
  confirmButtonText: string;
  initialValues: Partial<IFormValues>;
  validationSchema: Yup.AnyObjectSchema;
  onConfirm: (values: IFormValues) => void;
  onCloseModal: () => void;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  creditLineTerms: TCreditLineTerms;
  isMobile: boolean;
  steps: IStep[];
  currentStep: number;
  currentStepsNumber: IStep;
  isCurrentFormValid: boolean;
  formData: IFormValues;
  setIsCurrentFormValid: React.Dispatch<React.SetStateAction<boolean>>;
  handleFormChange: (updatedValues: Partial<IFormValues>) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  handleSubmitClick: () => void;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  prospectData: {
    lineOfCredit: string;
    moneyDestination: string;
  };
  eventData: ICrediboardData;
  loading: boolean;
  isLoading: boolean;
  lang: EnumType;
  dataProspect: IProspect;
}

export interface IStep {
  id: number;
  number: number;
  name: string;
  description: string;
}

export interface IFirstPaymentDate {
  id: string;
  value: string;
  label: string;
}

export interface IFormValues {
  creditLine: string;
  creditAmount: number;
  paymentConfiguration: IPaymentConfiguration;
  quotaCapValue: number;
  maximumTermValue: number;
  quotaCapEnabled: boolean;
  maximumTermEnabled: boolean;
  selectedProducts: string[];
}

export interface IBorrowerIncomeData {
  Dividends: number;
  FinancialIncome: number;
  Leases: number;
  OtherNonSalaryEmoluments: number;
  PensionAllowances: number;
  PeriodicSalary: number;
  PersonalBusinessUtilities: number;
  ProfessionalFees: number;
}

export type TRuleEvaluationResult = {
  value: number | string;
  [key: string]: string | number;
};

export type TCreditLineTerms = Record<
  string,
  {
    LoanAmountLimit: number;
    LoanTermLimit: number;
    RiskFreeInterestRate: number;
    amortizationType?: string[];
    description?: string;
  }
>;
export type TRulePrimitiveValue = number | string;

export type TRuleArrayValue = (
  | TRuleEvaluationResult
  | TRulePrimitiveValue
  | undefined
)[];

export type TRuleInput =
  | TRulePrimitiveValue
  | TRuleEvaluationResult
  | TRuleArrayValue
  | null
  | undefined;
