import * as Yup from "yup";

import { IProspect } from "@services/prospect/types";
import { EnumType } from "@hooks/useEnum";
import { ICrediboardData } from "@context/AppContext/types";

import { IPaymentConfiguration } from "./steps/config";
import { ICustomerData } from "./types";

export const messageNotFound = "No se encontraron resultados";

export interface IAddProductModalProps {
  onCloseModal: () => void;
  onConfirm: (values: IFormValues) => void;
  title: string;
  confirmButtonText: string;
  initialValues: Partial<IFormValues>;
  eventData: ICrediboardData;
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
  lang: EnumType;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  assistedControls?: {
    goBackText: string;
    goNextText: string;
    submitText: string;
  };
  eventData: ICrediboardData;
  dataProspect: IProspect;
}

export interface IStep {
  id: number;
  number: number;
  name: string;
  description: string;
}

export const stepsAddProductEnum = {
  creditLineSelection: {
    id: 1,
    number: 1,
    code: "StepsAddProduct_creditLineSelection",
    description: "Step to select the credit line",
    i18n: {
      en: "Credit line",
      es: "Línea de crédito",
    },
  },
  paymentConfiguration: {
    id: 2,
    number: 2,
    code: "StepsAddProduct_paymentConfiguration",
    description: "Step to configure Payment channel",
    i18n: {
      en: "Payment channel",
      es: "Medio de pago",
    },
  },
  termSelection: {
    id: 3,
    number: 3,
    code: "StepsAddProduct_termSelection",
    description: "Step for client restrictions",
    i18n: {
      en: "Application restrictions",
      es: "Restricciones de la solicitud",
    },
  },
  amountCapture: {
    id: 4,
    number: 4,
    code: "StepsAddProduct_amountCapture",
    description: "Step to register requested amount",
    i18n: {
      en: "Request amount",
      es: "Valor de la solicitud",
    },
  },
  verification: {
    id: 5,
    number: 5,
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
  id: number | string;
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
