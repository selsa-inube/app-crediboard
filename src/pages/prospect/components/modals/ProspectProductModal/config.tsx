export const paymentCycleMap: Record<string, string> = {
  Weekly: "Cada 10 días",
  Biweekly: "Bisemanal",
  Semimonthly: "Quincenal",
  Monthly: "Mensual",
};



export const VALIDATED_NUMBER_REGEX = /[^0-9]/g;


export const REPAYMENT_STRUCTURES_WITH_INCREMENT = {
  VALUE_INCREMENT: "Pagos valor de incremento",
  PERCENTAGE_INCREMENT: "Pagos con porcentaje de incremento",
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
  creditRequestCode: string | undefined;
  interestRate?: number;
  loanTerm?: number;
  loanAmount?: number;
}
export const validationMessages = {
  incrementRequired: "El valor de incremento es requerido",
  incrementMustBePositive: "El valor debe ser mayor a 0",
  incrementValidating: "Validando...",
  incrementValueRange: (min: number, max: number) =>
    `El valor debe estar entre $${min.toLocaleString()} y $${max.toLocaleString()}`,
  incrementPercentageRange: (min: number, max: number) =>
    `El porcentaje debe estar entre ${min}% y ${max}%`,
  incrementValidationError: "Error al validar el incremento",
  loanAmountOutOfRange: (amount: number, min: number, max: number) =>
    `El monto ingresado es $${amount.toLocaleString()}. Debe estar entre $${min.toLocaleString()} y $${max.toLocaleString()}`,
  loanAmountExceedsMax: (amount: number, max: number) =>
    `El monto ingresado es $${amount.toLocaleString()}. El máximo permitido es $${max.toLocaleString()}`,
  loanAmountValidationFailed: "No se pudo validar el monto del crédito",
  loanAmountValidationError: "Error al validar el monto del crédito",
  loanTermOutOfRange: (term: number, min: number, max: number) =>
    `El plazo ingresado es ${term} meses. Debe estar entre ${min} y ${max} meses`,
  loanTermValidationFailed: "No se pudo validar el plazo",
  loanTermValidationError: "Error al validar el plazo",
  interestRateOutOfRange: (rate: number, min: number, max: number) =>
    `La tasa ingresada es ${rate}% mensual. Debe estar entre ${min.toFixed(2)}% y ${max.toFixed(2)}% mensual`,
  interestRateValidationError: "Error al validar la tasa de interés",
};
export const fieldLabels = {
  creditAmount: {
    code: "Credit_amount",
    description: "Credit amount field label",
    i18n: {
      en: "Credit amount",
      es: "Monto del crédito",
    },
  },
  termInMonths: {
    code: "Term_in_months",
    description: "Term in months field label",
    i18n: {
      en: "Term in months",
      es: "Plazo en meses",
    },
  },
  amortizationType: {
    code: "Amortization_type",
    description: "Amortization type field label",
    i18n: {
      en: "Amortization type",
      es: "Tipo de amortización",
    },
  },
  incrementValue: {
    code: "Increment_value",
    description: "Increment value field label",
    i18n: {
      en: "Increment value",
      es: "Valor de incremento",
    },
  },
  incrementPercentage: {
    code: "Increment_percentage",
    description: "Increment percentage field label",
    i18n: {
      en: "Increment percentage",
      es: "Porcentaje de incremento",
    },
  },
  interestRate: {
    code: "Interest_rate",
    description: "Interest rate field label",
    i18n: {
      en: "Interest rate",
      es: "Tasa de interés",
    },
  },
  rateType: {
    code: "Rate_type",
    description: "Rate type field label",
    i18n: {
      en: "Rate type",
      es: "Tipo de tasa",
    },
  },
  paymentMethod: {
    code: "Payment_method",
    description: "Payment method field label",
    i18n: {
      en: "Payment method",
      es: "Método de pago",
    },
  },
  paymentCycle: {
    code: "Payment_cycle",
    description: "Payment cycle field label",
    i18n: {
      en: "Payment cycle",
      es: "Ciclo de pago",
    },
  },
  firstPaymentCycle: {
    code: "First_payment_cycle",
    description: "First payment cycle field label",
    i18n: {
      en: "First payment cycle",
      es: "Primer ciclo de pago",
    },
  },
  creditLine: {
    code: "Credit_line",
    description: "Credit line field label",
    i18n: {
      en: "Credit line",
      es: "Línea de crédito",
    },
  },
  ordinaryPayment: {
    code: "Ordinary_payment",
    description: "Monthly ordinary installment field label",
    i18n: {
      en: "Monthly ordinary installment",
      es: "Cuota ordinaria mensual",
    },
  },
};
export const fieldPlaceholders = {
  incrementValue: "Ej: 50000",
  incrementPercentage: "Ej: 5",
  creditAmount: "Ingrese el monto",
  interestRate: "Ingrese la tasa",
};
