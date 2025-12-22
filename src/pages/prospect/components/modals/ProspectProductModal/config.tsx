import {
  Schedule,
  CreditLine,
  PaymentMethod,
  RateType,
} from "@services/enum/icorebanking-vi-crediboard/schedule";

export const modalTexts = {
  titles: {
    editProduct: "Editar producto",
  },
  buttons: {
    cancel: "Cancelar",
    confirm: "Confirmar",
  },
  placeholders: {
    creditAmount: "Monto solicitado",
    interestRate: "Ej: 0.9",
    selectOption: "Selecciona una opción",
    noPaymentOptions: "No hay opciones de pago disponibles",
  },
  labels: {
    creditAmount: "Monto del crédito",
    paymentMethod: "Medio de pago",
    paymentCycle: "Ciclo de pagos",
    firstPaymentCycle: "Primer ciclo de pago",
    termInMonths: "Plazo en meses",
    amortizationType: "Tipo de amortización",
    interestRate: "Tasa de interés",
    rateType: "Tipo de tasa",
  },
  messages: {
    errors: {
      loanAmountRange: (amount: number, from: number, to: number) =>
        `El monto ingresado es $${amount.toLocaleString()}. Debe estar entre $${from.toLocaleString()} y $${to.toLocaleString()}`,
      loanAmountMax: (amount: number, maxAmount: number) =>
        `El monto ingresado es $${amount.toLocaleString()}. El máximo permitido es $${maxAmount.toLocaleString()}`,
      loanAmountValidation: "No se pudo validar el monto del crédito",
      loanAmountGeneric: "Error al validar el monto del crédito",

      loanTermRange: (term: number, from: number, to: number) =>
        `El plazo ingresado es ${term} meses. Debe estar entre ${from} y ${to} meses`,
      loanTermValidation: "No se pudo validar el plazo",
      loanTermGeneric: "Error al validar el plazo",

      interestRateRange: (rate: number, min: number, max: number) =>
        `La tasa ingresada es ${rate}% mensual. Debe estar entre ${min.toFixed(2)}% y ${max.toFixed(2)}% mensual`,
      interestRateValidation: "Error al validar la tasa de interés",

      loadPaymentOptions: "Error al cargar las opciones de pago",
      validateLoanAmount: "Error al validar el monto del crédito",
      validateLoanTermBusiness: "El plazo no cumple con las reglas de negocio",
      validateLoanTermRange: "El plazo debe estar dentro del rango permitido",
      validateLoanTermOther: "Error al validar el plazo",
      validateInterestRateBusiness:
        "La tasa no cumple con las reglas de negocio",
      validateInterestRateRange:
        "La tasa debe estar dentro del rango permitido",
      validateInterestRateOther: "Error al validar la tasa de interés",
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
export const messagesErrorValidations = {
  loadPaymentOptions: "Error al cargar las opciones de pago",
  validateLoanAmount: "Error al validar el monto del crédito",
  validateLoanTermBusiness: "El plazo no cumple con las reglas de negocio",
  validateLoanTermRange: "El plazo debe estar dentro del rango permitido",
  validateLoanTermOther: "Error al validar el plazo",
  validateInterestRateBusiness: "La tasa no cumple con las reglas de negocio",
  validateInterestRateRange: "La tasa debe estar dentro del rango permitido",
  validateInterestRateOther: "Error al validar la tasa de interés",
};

export const repaymentStructureMap: Record<string, string> = {
  FixedInstallment: "Cuota integral fija",
  ConstantAmortization: "Abonos fijos a capital",
  GeometricGradientRepayment: "Gradiente geométrico",
  ArithmeticGradientRepayment: "Gradiente aritmético",
};

export const defaultPaymentOptions = [
  {
    id: "0",
    value: modalTexts.placeholders.noPaymentOptions,
    label: modalTexts.placeholders.noPaymentOptions,
  },
];
export const REPAYMENT_STRUCTURES_WITH_INCREMENT = {
  VALUE_INCREMENT: "Pagos valor de incremento",
  PERCENTAGE_INCREMENT: "Pagos con porcentaje de incremento",
};

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
  creditAmount: "Monto del crédito",
  termInMonths: "Plazo en meses",
  amortizationType: "Tipo de amortización",
  incrementValue: "Valor de incremento",
  incrementPercentage: "Porcentaje de incremento",
  interestRate: "Tasa de interés",
  rateType: "Tipo de tasa",
  paymentMethod: "Método de pago",
  paymentCycle: "Ciclo de pago",
  firstPaymentCycle: "Primer ciclo de pago",
  creditLine: "Línea de crédito",
  ordinaryPayment: "Cuota ordinaria mensual",
};

export const fieldPlaceholders = {
  incrementValue: "Ej: 50000",
  incrementPercentage: "Ej: 5",
  creditAmount: "Ingrese el monto",
  interestRate: "Ingrese la tasa",
};

export const errorMessages = {
  updateCreditProduct: {
    description: "No se pudo actualizar el producto de crédito.",
  },
};

export {
  creditLineOptions,
  paymentMethodOptions,
  paymentCycleOptions,
  firstPaymentCycleOptions,
  termInMonthsOptions,
  rateTypeOptions,
};
