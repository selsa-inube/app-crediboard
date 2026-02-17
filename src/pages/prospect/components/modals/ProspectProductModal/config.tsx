import {
  Schedule,
  CreditLine,
  PaymentMethod,
  AmortizationType,
  RateType,
} from "@services/enum/icorebanking-vi-crediboard/schedule";

export const editProductModalLabels = {
  titles: {
    editProduct: {
      code: "Modal_title_editProduct",
      description: "Title for the edit product modal",
      i18n: { en: "Edit product", es: "Editar producto" },
    },
  },
  buttons: {
    cancel: {
      code: "Button_cancel",
      description: "Label for cancel button",
      i18n: { en: "Cancel", es: "Cancelar" },
    },
    confirm: {
      code: "Button_confirm",
      description: "Label for confirm button",
      i18n: { en: "Confirm", es: "Confirmar" },
    },
  },
  placeholders: {
    selectOption: {
      code: "Placeholder_selectOption",
      description: "Common placeholder for select inputs",
      i18n: { en: "Select an option", es: "Selecciona una opción" },
    },
    noPaymentOptions: {
      code: "Placeholder_noPaymentOptions",
      description: "Message when no payment options are available",
      i18n: {
        en: "No payment options available",
        es: "No hay opciones de pago disponibles",
      },
    },
  },
  paymentCycleMap: {
    Weekly: { en: "Weekly", es: "Semanal" },
    TenDayIntervals: { en: "Every 10 days", es: "Cada 10 días" },
    Biweekly: { en: "Biweekly", es: "Bisemanal" },
    Semimonthly: { en: "Semimonthly", es: "Quincenal" },
    Monthly: { en: "Monthly", es: "Mensual" },
  },
  interestRateTypeMap: {
    VariableInterestRate: { en: "Variable rate", es: "Tasa variable" },
    FixedInterestRate: { en: "Fixed rate", es: "Tasa fija" },
  },
  repaymentStructureMap: {
    FixedInstallment: {
      en: "Fixed integral installment",
      es: "Cuota integral fija",
    },
    ConstantAmortization: {
      en: "Fixed capital payments",
      es: "Abonos fijos a capital",
    },
    GeometricGradientRepayment: {
      en: "Geometric gradient",
      es: "Gradiente geométrico",
    },
    ArithmeticGradientRepayment: {
      en: "Arithmetic gradient",
      es: "Gradiente aritmético",
    },
    ValueIncrement: {
      en: "Increment value payments",
      es: "Pagos valor de incremento",
    },
    PercentageIncrement: {
      en: "Increment percentage payments",
      es: "Pagos con porcentaje de incremento",
    },
  },
  validationMessages: {
    incrementRequired: {
      code: "Validation_incrementRequired",
      description: "Error when increment field is empty",
      i18n: {
        en: "Increment value is required",
        es: "El valor de incremento es requerido",
      },
    },
    incrementMustBePositive: {
      code: "Validation_incrementPositive",
      description: "Error when value is 0 or negative",
      i18n: {
        en: "Value must be greater than 0",
        es: "El valor debe ser mayor a 0",
      },
    },
    incrementValidating: {
      code: "Validation_incrementPending",
      description: "Status while validating increment",
      i18n: { en: "Validating...", es: "Validando..." },
    },
    incrementValueRange: {
      code: "Validation_incrementValueRange",
      description: "Error for out of range currency increment",
      i18n: {
        en: "Value must be between ${min} and ${max}",
        es: "El valor debe estar entre ${min} y ${max}",
      },
    },
    incrementPercentageRange: {
      code: "Validation_incrementPercentageRange",
      description: "Error for out of range percentage increment",
      i18n: {
        en: "Percentage must be between {min}% and {max}%",
        es: "El porcentaje debe estar entre {min}% y {max}%",
      },
    },
    loanAmountRange: {
      code: "Validation_loanAmountRange",
      description: "Error for loan amount out of business rules range",
      i18n: {
        en: "The entered amount is {amount}. It must be between {from} and {to}",
        es: "El monto ingresado es {amount}. Debe estar entre {from} y {to}",
      },
    },
    loanAmountMax: {
      code: "Validation_loanAmountMax",
      description: "Error when loan exceeds maximum",
      i18n: {
        en: "The entered amount is {amount}. Maximum allowed is {max}",
        es: "El monto ingresado es {amount}. El máximo permitido es {max}",
      },
    },
    interestRateRange: {
      code: "Validation_interestRateRange",
      description: "Error for interest rate out of range",
      i18n: {
        en: "Rate is {rate}% monthly. Must be between {min}% and {max}%",
        es: "La tasa ingresada es {rate}% mensual. Debe estar entre {min}% y {max}%",
      },
    },
    genericFetchError: {
      code: "Error_loadPaymentOptions",
      description: "Error when service fails to load payment methods",
      i18n: {
        en: "Error loading payment options",
        es: "Error al cargar las opciones de pago",
      },
    },
  },
};

const creditLineOptions = [
  {
    id: CreditLine.Vacation,
    label: "Crédito Vacacional",
    value: CreditLine.Vacation,
  },
  {
    id: CreditLine.Education,
    label: "Crédito Educativo",
    value: CreditLine.Education,
  },
  {
    id: CreditLine.Mortgage,
    label: "Crédito Hipotecario",
    value: CreditLine.Mortgage,
  },
  {
    id: CreditLine.Personal,
    label: "Crédito Personal",
    value: CreditLine.Personal,
  },
  {
    id: CreditLine.Business,
    label: "Crédito Empresarial",
    value: CreditLine.Business,
  },
  { id: CreditLine.Auto, label: "Crédito Automotriz", value: CreditLine.Auto },
  {
    id: CreditLine.Health,
    label: "Crédito de Salud",
    value: CreditLine.Health,
  },
  {
    id: CreditLine.CreditCard,
    label: "Tarjeta de Crédito",
    value: CreditLine.CreditCard,
  },
  {
    id: CreditLine.Consolidation,
    label: "Consolidación de Deudas",
    value: CreditLine.Consolidation,
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

export const paymentCycleMap: Record<string, string> = {
  Weekly: "Cada 10 días",
  Biweekly: "Bisemanal",
  Semimonthly: "Quincenal",
  Monthly: "Mensual",
};

export const interestRateTypeMap: Record<string, string> = {
  VariableInterestRate: "Tasa variable",
  FixedInterestRate: "Tasa fija",
};

export const VALIDATED_NUMBER_REGEX = /[^0-9]/g;

export const repaymentStructureMap: Record<string, string> = {
  FixedInstallment: "Cuota integral fija",
  ConstantAmortization: "Abonos fijos a capital",
  GeometricGradientRepayment: "Gradiente geométrico",
  ArithmeticGradientRepayment: "Gradiente aritmético",
};

export const defaultPaymentOptions = [
  {
    id: "0",
    value: editProductModalLabels.placeholders.noPaymentOptions.i18n["en"],
    label: editProductModalLabels.placeholders.noPaymentOptions.i18n["en"],
  },
];
export const REPAYMENT_STRUCTURES_WITH_INCREMENT = {
  VALUE_INCREMENT: "Pagos valor de incremento",
  PERCENTAGE_INCREMENT: "Pagos con porcentaje de incremento",
};

export const validationMessagesEnum = {
  incrementRequired: {
    code: "Validation_incrementRequired",
    description: "Error when increment value is missing",
    i18n: {
      en: "Increment value is required",
      es: "El valor de incremento es requerido",
    },
  },
  incrementMustBePositive: {
    code: "Validation_incrementMustBePositive",
    description: "Error when value is zero or negative",
    i18n: {
      en: "The value must be greater than 0",
      es: "El valor debe ser mayor a 0",
    },
  },
  incrementValidating: {
    code: "Validation_incrementValidating",
    description: "Status text while validating increment",
    i18n: {
      en: "Validating...",
      es: "Validando...",
    },
  },
  incrementValueRange: {
    code: "Validation_incrementValueRange",
    description: "Error for increment value out of range",
    i18n: {
      en: "The value must be between ${min} and ${max}",
      es: "El valor debe estar entre ${min} y ${max}",
    },
  },
  incrementPercentageRange: {
    code: "Validation_incrementPercentageRange",
    description: "Error for increment percentage out of range",
    i18n: {
      en: "The percentage must be between {min}% and {max}%",
      es: "El porcentaje debe estar entre {min}% y {max}%",
    },
  },
  incrementValidationError: {
    code: "Validation_incrementError",
    description: "General error during increment validation",
    i18n: {
      en: "Error validating increment",
      es: "Error al validar el incremento",
    },
  },
  loanAmountOutOfRange: {
    code: "Validation_loanAmountOutOfRange",
    description: "Error for loan amount outside allowed range",
    i18n: {
      en: "The entered amount is ${amount}. It must be between ${min} and ${max}",
      es: "El monto ingresado es ${amount}. Debe estar entre ${min} y ${max}",
    },
  },
  loanAmountExceedsMax: {
    code: "Validation_loanAmountExceedsMax",
    description: "Error when loan amount exceeds maximum limit",
    i18n: {
      en: "The entered amount is ${amount}. The maximum allowed is ${max}",
      es: "El monto ingresado es ${amount}. El máximo permitido es ${max}",
    },
  },
  loanAmountValidationFailed: {
    code: "Validation_loanAmountFailed",
    description: "Error when loan amount validation cannot be completed",
    i18n: {
      en: "Could not validate the credit amount",
      es: "No se pudo validar el monto del crédito",
    },
  },
  loanAmountValidationError: {
    code: "Validation_loanAmountError",
    description: "Generic error during loan amount validation",
    i18n: {
      en: "Error validating credit amount",
      es: "Error al validar el monto del crédito",
    },
  },
  loanTermOutOfRange: {
    code: "Validation_loanTermOutOfRange",
    description: "Error for loan term outside allowed range",
    i18n: {
      en: "The entered term is {term} months. It must be between {min} and {max} months",
      es: "El plazo ingresado es {term} meses. Debe estar entre {min} y {max} meses",
    },
  },
  loanTermValidationFailed: {
    code: "Validation_loanTermFailed",
    description: "Error when loan term validation cannot be completed",
    i18n: {
      en: "Could not validate the term",
      es: "No se pudo validar el plazo",
    },
  },
  loanTermValidationError: {
    code: "Validation_loanTermError",
    description: "Generic error during loan term validation",
    i18n: {
      en: "Error validating term",
      es: "Error al validar el plazo",
    },
  },
  interestRateOutOfRange: {
    code: "Validation_interestRateOutOfRange",
    description: "Error for interest rate outside allowed range",
    i18n: {
      en: "The entered rate is {rate}% monthly. It must be between {min}% and {max}% monthly",
      es: "La tasa ingresada es {rate}% mensual. Debe estar entre {min}% y {max}% mensual",
    },
  },
  interestRateValidationError: {
    code: "Validation_interestRateError",
    description: "Generic error during interest rate validation",
    i18n: {
      en: "Error validating interest rate",
      es: "Error al validar la tasa de interés",
    },
  },
};

export const errorMessagesEnum = {
  updateCreditProduct: {
    code: "Error_update_credit_product",
    description: "Error message when the credit product update service fails",
    i18n: {
      en: "Could not update credit product.",
      es: "No se pudo actualizar el producto de crédito.",
    },
  },
};

export const fieldLabelsEnum = {
  creditAmount: {
    code: "FieldLabels_creditAmount",
    description: "Label for credit amount",
    i18n: {
      en: "Credit amount",
      es: "Monto del crédito",
    },
  },
  termInMonths: {
    code: "FieldLabels_termInMonths",
    description: "Label for term in months",
    i18n: {
      en: "Term in months",
      es: "Plazo en meses",
    },
  },
  amortizationType: {
    code: "FieldLabels_amortizationType",
    description: "Label for amortization type",
    i18n: {
      en: "Amortization type",
      es: "Tipo de amortización",
    },
  },
  incrementValue: {
    code: "FieldLabels_incrementValue",
    description: "Label for increment value",
    i18n: {
      en: "Increment value",
      es: "Valor de incremento",
    },
  },
  incrementPercentage: {
    code: "FieldLabels_incrementPercentage",
    description: "Label for increment percentage",
    i18n: {
      en: "Increment percentage",
      es: "Porcentaje de incremento",
    },
  },
  interestRate: {
    code: "FieldLabels_interestRate",
    description: "Label for interest rate",
    i18n: {
      en: "Interest rate",
      es: "Tasa de interés",
    },
  },
  rateType: {
    code: "FieldLabels_rateType",
    description: "Label for rate type",
    i18n: {
      en: "Rate type",
      es: "Tipo de tasa",
    },
  },
  paymentMethod: {
    code: "FieldLabels_paymentMethod",
    description: "Label for Payment channel",
    i18n: {
      en: "Payment channel",
      es: "Método de pago",
    },
  },
  paymentCycle: {
    code: "FieldLabels_paymentCycle",
    description: "Label for payment cycle",
    i18n: {
      en: "Payment cycle",
      es: "Ciclo de pago",
    },
  },
  firstPaymentCycle: {
    code: "FieldLabels_firstPaymentCycle",
    description: "Label for first payment cycle",
    i18n: {
      en: "First payment cycle",
      es: "Primer ciclo de pago",
    },
  },
  creditLine: {
    code: "FieldLabels_creditLine",
    description: "Label for credit line",
    i18n: {
      en: "Credit line",
      es: "Línea de crédito",
    },
  },
  ordinaryPayment: {
    code: "FieldLabels_ordinaryPayment",
    description: "Label for ordinary monthly payment",
    i18n: {
      en: "Ordinary monthly payment",
      es: "Cuota ordinaria mensual",
    },
  },
};

export const fieldPlaceholdersEnum = {
  incrementValue: {
    code: "FieldPlaceholders_incrementValue",
    description: "Placeholder for increment value",
    i18n: {
      en: "Ex: 50000",
      es: "Ej: 50000",
    },
  },
  incrementPercentage: {
    code: "FieldPlaceholders_incrementPercentage",
    description: "Placeholder for increment percentage",
    i18n: {
      en: "Ex: 5",
      es: "Ej: 5",
    },
  },
  creditAmount: {
    code: "FieldPlaceholders_creditAmount",
    description: "Placeholder for credit amount",
    i18n: {
      en: "Enter the amount",
      es: "Ingrese el monto",
    },
  },
  interestRate: {
    code: "FieldPlaceholders_interestRate",
    description: "Placeholder for interest rate",
    i18n: {
      en: "Enter the rate",
      es: "Ingrese la tasa",
    },
  },
};

export const simulationFormLabels = {
  cancelButton: {
    code: "Cancel_button",
    description: "Label for cancel button",
    i18n: { en: "Cancel", es: "Cancelar" },
  },
  creditAmountPlaceholder: {
    code: "Credit_amount_placeholder",
    description: "Placeholder for requested amount",
    i18n: { en: "Requested amount", es: "Monto solicitado" },
  },
  paymentMethod: {
    code: "Payment_method_label",
    description: "Label for payment method field",
    i18n: { en: "Payment method", es: "Medio de pago" },
  },
  paymentCycle: {
    code: "Payment_cycle_label",
    description: "Label for payment cycle field",
    i18n: { en: "Payment cycle", es: "Ciclo de pagos" },
  },
  termInMonthsLabel: {
    code: "Term_months_label",
    description: "Label for term in months select",
    i18n: { en: "Term in months", es: "Plazo en meses" },
  },
  selectPlaceholder: {
    code: "Select_option_placeholder",
    description: "Placeholder for select inputs",
    i18n: { en: "Select an option", es: "Selecciona una opción" },
  },
  amortizationTypeLabel: {
    code: "Amortization_type_label",
    description: "Label for amortization type select",
    i18n: { en: "Amortization type", es: "Tipo de amortización" },
  },
  interestRateLabel: {
    code: "Interest_rate_label",
    description: "Label for interest rate field",
    i18n: { en: "Interest rate", es: "Tasa de interés" },
  },
  interestRatePlaceholder: {
    code: "Interest_rate_placeholder",
    description: "Placeholder example for interest rate",
    i18n: { en: "E.g.: 0.9", es: "Ej: 0.9" },
  },
  rateTypeLabel: {
    code: "Rate_type_label",
    description: "Label for rate type select",
    i18n: { en: "Rate type", es: "Tipo de tasa" },
  },
  installmentAmountLabel: {
    code: "Installment_amount_label",
    description: "Label for installment amount field",
    i18n: { en: "Installment amount", es: "Monto de la cuota" },
  },
  installmentAmountPlaceholder: {
    code: "Installment_amount_placeholder",
    description: "Placeholder example for installment amount",
    i18n: { en: "E.g.: 500,000", es: "Ej: 500.0000" },
  },
};

export interface IUpdateProductPayload {
  creditProductCode: string;
  creditRequestCode: string;
  interestRate?: number;
  loanTerm?: number;
  loanAmount?: number;
}

export {
  creditLineOptions,
  paymentMethodOptions,
  paymentCycleOptions,
  firstPaymentCycleOptions,
  termInMonthsOptions,
  amortizationTypeOptions,
  rateTypeOptions,
};
