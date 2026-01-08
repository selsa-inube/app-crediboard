import * as Yup from "yup";

import {
  CreditLine,
  PaymentMethod,
  AmortizationType,
  RateType,
} from "@services/enum/prospectProduct";
import { Schedule } from "@services/enum/icorebanking-vi-crediboard/schedule";
import { IProspect } from "@services/prospect/types"; 

import { IPaymentConfiguration } from "./steps/config";
import { ICustomerData } from "./types";

const creditLineOptions = [
  {
    id: CreditLine.Home,
    label: "Hogar",
    value: CreditLine.Home,
  },
  {
    id: CreditLine.Construction,
    label: "Construcción en lote",
    value: CreditLine.Construction,
  },
  {
    id: CreditLine.Investment,
    label: "Libre inversión",
    value: CreditLine.Investment,
  },
  {
    id: CreditLine.Dwelling,
    label: "Vivienda VIS",
    value: CreditLine.Dwelling,
  },
];

const paymentMethodOptions = [
  {
    id: PaymentMethod.MonthlyPayroll,
    label: "Nómina Mensual",
    value: PaymentMethod.MonthlyPayroll,
  },
  {
    id: PaymentMethod.BiweeklyPayroll,
    label: "Nómina Quincenal",
    value: PaymentMethod.BiweeklyPayroll,
  },
  {
    id: PaymentMethod.BankTransfer,
    label: "Transferencia Bancaria",
    value: PaymentMethod.BankTransfer,
  },
  {
    id: PaymentMethod.CreditCard,
    label: "Tarjeta de Crédito",
    value: PaymentMethod.CreditCard,
  },
  {
    id: PaymentMethod.DebitCard,
    label: "Tarjeta de Débito",
    value: PaymentMethod.DebitCard,
  },
  { id: PaymentMethod.Cash, label: "Efectivo", value: PaymentMethod.Cash },
  {
    id: PaymentMethod.MobilePayment,
    label: "Pago Móvil",
    value: PaymentMethod.MobilePayment,
  },
  { id: PaymentMethod.Check, label: "Cheque", value: PaymentMethod.Check },
];

const paymentCycleOptions = [
  { id: Schedule.Weekly, label: "Semanal", value: Schedule.Weekly },
  {
    id: Schedule.TenDayIntervals,
    label: "Cada 10 días",
    value: Schedule.TenDayIntervals,
  },
  { id: Schedule.Biweekly, label: "Quincenal", value: Schedule.Biweekly },
  { id: Schedule.Monthly, label: "Mensual", value: Schedule.Monthly },
  { id: Schedule.Bimonthly, label: "Bimestral", value: Schedule.Bimonthly },
  { id: Schedule.Quarterly, label: "Trimestral", value: Schedule.Quarterly },
  {
    id: Schedule.Semiannually,
    label: "Semestral",
    value: Schedule.Semiannually,
  },
  { id: Schedule.Annually, label: "Anual", value: Schedule.Annually },
];

const firstPaymentCycleOptions = [
  { id: "ciclo1", label: "15/09/2024", value: "ciclo1" },
  { id: "ciclo2", label: "15/10/2024", value: "ciclo2" },
];

const termInMonthsOptions = [
  { id: "12Months", label: "12", value: "12" },
  { id: "24Months", label: "24", value: "24" },
  { id: "48Months", label: "48", value: "48" },
];

const amortizationTypeOptions = [
  {
    id: AmortizationType.FixedPayments,
    label: "Abonos Fijos",
    value: AmortizationType.FixedPayments,
  },
  {
    id: AmortizationType.GradualPayments,
    label: "Pagos Graduales",
    value: AmortizationType.GradualPayments,
  },
  {
    id: AmortizationType.BulletPayment,
    label: "Pago Único (Bullet)",
    value: AmortizationType.BulletPayment,
  },
  {
    id: AmortizationType.BalloonPayment,
    label: "Pago Global (Balloon)",
    value: AmortizationType.BalloonPayment,
  },
  {
    id: AmortizationType.FixedPrincipal,
    label: "Capital Fijo",
    value: AmortizationType.FixedPrincipal,
  },
  {
    id: AmortizationType.InterestOnly,
    label: "Solo Intereses",
    value: AmortizationType.InterestOnly,
  },
  {
    id: AmortizationType.FixedIntegralPayments,
    label: "Abonos Fijos Integrales",
    value: AmortizationType.FixedIntegralPayments,
  },
];

const rateTypeOptions = [
  { id: RateType.Fixed, label: "Fija", value: RateType.Fixed },
  { id: RateType.Variable, label: "Variable", value: RateType.Variable },
  { id: RateType.Mixed, label: "Mixta", value: RateType.Mixed },
  { id: RateType.Adjustable, label: "Ajustable", value: RateType.Adjustable },
  { id: RateType.Floating, label: "Flotante", value: RateType.Floating },
];

export const messageNotFound = "No se encontraron resultados";

export interface IAddProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: IFormValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: Partial<IFormValues>;
  moneyDestination: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  identificationDocumentNumber: string;
  identificationDocumentType: string;
  isSendingData: boolean;
  dataProspect: IProspect;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  customerData?: ICustomerData;
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

export const isRuleObject = (
  value: TRuleInput,
): value is TRuleEvaluationResult => {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    "value" in value &&
    (typeof value.value === "string" || typeof value.value === "number")
  );
};

export const isRulePrimitive = (
  value: TRuleInput | TRuleEvaluationResult | TRulePrimitiveValue,
): value is TRulePrimitiveValue => {
  return typeof value === "string" || typeof value === "number";
};

export const isRuleArray = (value: TRuleInput): value is TRuleArrayValue => {
  return Array.isArray(value);
};

export interface IAddProductModalUIProps {
  title: string;
  confirmButtonText: string;
  initialValues: Partial<IFormValues>;
  validationSchema: Yup.AnyObjectSchema;
  onConfirm: (values: IFormValues) => void;
  isSendingData: boolean;
  onCloseModal: () => void;
  creditLineTerms: TCreditLineTerms;
  isMobile: boolean;
  steps: StepDetails[];
  currentStep: number;
  currentStepsNumber: StepDetails;
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
  errorModal: boolean;
  setErrorModal: React.Dispatch<React.SetStateAction<boolean>>;
  errorMessage: string;
  loading: boolean;
  setCurrentStep: (step: number) => void;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
}

export interface IStep {
  id: number;
  number: number;
  name: string;
  description: string;
}

export const stepsAddProduct = {
  creditLineSelection: {
    id: 1,
    number: 1,
    name: "Línea de crédito",
    description: "Selecciona la línea de crédito",
  },
  paymentConfiguration: {
    id: 2,
    number: 2,
    name: "Medio de pago",
    description: "Configura el medio de pago",
  },
  termSelection: {
    id: 3,
    number: 3,
    name: "Restricciones de la solicitud",
    description: "Restricciones del cliente.",
  },
  amountCapture: {
    id: 4,
    number: 4,
    name: "Valor de la solicitud",
    description: "Registra el valor de la solicitud",
  },
  verification: { 
    id: 5, 
    number: 5, 
    name: "Verificación", 
    description: "" 
  },
};

export const titleButtonTextAssisted = {
  goBackText: "Atrás",
  goNextText: "Siguiente",
  submitText: "Agregar producto",
};

export const errorMessages = {
  getPaymentMethods: "Error al obtener los medios de pago",
  linesOfCredit: "Error al obtener las líneas de crédito",
};

export const noAvailablePaymentMethods = "No hay medios de pago disponibles";

export const stepsAddProductEnum = {
  creditLineSelection: {
    code: "StepsAddProduct_creditLineSelection",
    description: "Step to select the credit line",
    i18n: {
      en: "Credit line",
      es: "Línea de crédito",
    },
  },
  paymentConfiguration: {
    code: "StepsAddProduct_paymentConfiguration",
    description: "Step to configure payment method",
    i18n: {
      en: "Payment method",
      es: "Medio de pago",
    },
  },
  termSelection: {
    code: "StepsAddProduct_termSelection",
    description: "Step for client restrictions",
    i18n: {
      en: "Application restrictions",
      es: "Restricciones de la solicitud",
    },
  },
  amountCapture: {
    code: "StepsAddProduct_amountCapture",
    description: "Step to register requested amount",
    i18n: {
      en: "Request amount",
      es: "Valor de la solicitud",
    },
  },
  verification: {
    code: "StepsAddProduct_verification",
    description: "Step for verification",
    i18n: {
      en: "Verification",
      es: "Verificación",
    },
  },
};

export const titleButtonTextAssistedEnum = {
  goBackText: {
    code: "TitleButtonTextAssisted_goBackText",
    description: "Text for back button",
    i18n: {
      en: "Back",
      es: "Atrás",
    },
  },
  goNextText: {
    code: "TitleButtonTextAssisted_goNextText",
    description: "Text for next button",
    i18n: {
      en: "Next",
      es: "Siguiente",
    },
  },
  submitText: {
    code: "TitleButtonTextAssisted_submitText",
    description: "Text for submit button",
    i18n: {
      en: "Add product",
      es: "Agregar producto",
    },
  },
};

export const errorMessagesEnum = {
  getPaymentMethods: {
    code: "ErrorMessages_getPaymentMethods",
    description: "Error when fetching payment methods",
    i18n: {
      en: "Error fetching payment methods",
      es: "Error al obtener los medios de pago",
    },
  },
  linesOfCredit: {
    code: "ErrorMessages_linesOfCredit",
    description: "Error when fetching lines of credit",
    i18n: {
      en: "Error fetching lines of credit",
      es: "Error al obtener las líneas de crédito",
    },
  },
};

export const noAvailablePaymentMethodsEnum = {
  code: "NoAvailablePaymentMethods",
  description: "Message when no payment methods are available",
  i18n: {
    en: "No payment methods available",
    es: "No hay medios de pago disponibles",
  },
};


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

export interface StepDetails {
  id: number;
  number: number;
  name: string;
  description: string;
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

export const extractBorrowerIncomeData = (
  dataProspect: IProspect | undefined,
): IBorrowerIncomeData => {
  const defaultIncomeData: IBorrowerIncomeData = {
    Dividends: 0,
    FinancialIncome: 0,
    Leases: 0,
    OtherNonSalaryEmoluments: 0,
    PensionAllowances: 0,
    PeriodicSalary: 0,
    PersonalBusinessUtilities: 0,
    ProfessionalFees: 0,
  };

  if (!dataProspect?.borrowers) {
    return defaultIncomeData;
  }

  const mainBorrower = dataProspect.borrowers.find(
    (borrower) => borrower.borrowerType === "MainBorrower",
  );

  if (!mainBorrower?.borrowerProperties) {
    return defaultIncomeData;
  }

  const result: IBorrowerIncomeData = { ...defaultIncomeData };

  mainBorrower.borrowerProperties.forEach((prop) => {
    const propertyName = prop.propertyName as keyof IBorrowerIncomeData;

    if (propertyName in result) {
      result[propertyName] = parseFloat(prop.propertyValue) || 0;
    }
  });

  return result;
};

export {
  creditLineOptions,
  paymentMethodOptions,
  paymentCycleOptions,
  firstPaymentCycleOptions,
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
};
