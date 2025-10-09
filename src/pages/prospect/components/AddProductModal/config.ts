import { ObjectSchema, AnyObject } from "yup";

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
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  identificationDocumentNumber?: string;
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

export interface IFormValues {
  selectedProducts: string[];
  creditLine?: string;
  creditAmount?: number;
  paymentMethod?: string;
  paymentCycle?: string;
  firstPaymentCycle?: string;
  termInMonths?: number;
  amortizationType?: string;
  interestRate?: number;
  rateType?: string;
}

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
  validationSchema: ObjectSchema<IFormValues, AnyObject, IFormValues>;
  onConfirm: (values: IFormValues) => void;
  onCloseModal: () => void;
  iconBefore?: React.JSX.Element;
  iconAfter?: React.JSX.Element;
  creditLineTerms: TCreditLineTerms;
  isMobile: boolean;
}