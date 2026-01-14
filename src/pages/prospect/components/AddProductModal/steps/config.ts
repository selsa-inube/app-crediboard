import * as Yup from "yup";

import { stepsAddProductEnum } from "../config";

export interface IResponsePaymentDatesChannel {
  abbreviatedName: string;
  payingEntityName: string;
  payingIdentification: string;
  paymentChannel: string;
  regularCycles: IRegularCycle[];
}

export interface IRegularCycle {
  cycleName: string;
  detailOfPaymentDate: string[];
  firstDayOfTheCycle: string;
  paymentChannel: string;
  periodicity: string;
}

export interface IFirstPaymentDate {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentConfiguration {
  paymentMethod: string;
  paymentCycle: string;
  firstPaymentDate: string;
  paymentChannelData: IResponsePaymentDatesChannel[];
}

export const VALIDATED_NUMBER_REGEX = /[^0-9]/g;

export interface ITermSelectionValues {
  toggles: {
    quotaCapToggle: boolean;
    maximumTermToggle: boolean;
  };
  quotaCapValue: string | number;
  maximumTermValue: string | number;
}

export interface ITermSelection {
  quotaCapValue: number;
  maximumTermValue: number;
  quotaCapEnabled: boolean;
  maximumTermEnabled: boolean;
  isMobile: boolean;
  onChange: (values: {
    quotaCapValue: number;
    maximumTermValue: number;
    quotaCapEnabled: boolean;
    maximumTermEnabled: boolean;
  }) => void;
  onFormValid: (isValid: boolean) => void;
}

export interface ITermSelectionUI {
  isMobile: boolean;
  initialValues: ITermSelectionValuesMain;
  lang: "en" | "es";
  validationSchema: Yup.ObjectSchema<{
    quotaCapValue?: string;
    maximumTermValue?: string;
  }>;
  handleValidationsForm: (values: ITermSelectionValuesMain) => void;
  handleQuotaCapToggleChange: (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => void;
  handleQuotaCapValueChange: (
    rawValue: string,
    setFieldValue: (field: string, value: string | number) => void,
  ) => void;
  handleMaximumTermToggleChange: (
    isChecked: boolean,
    setFieldValue: (field: string, value: string | number | boolean) => void,
    values: ITermSelectionValuesMain,
  ) => void;
  handleMaximumTermValueChange: (
    numericValue: number,
    setFieldValue: (field: string, value: string | number) => void,
  ) => void;
}

export interface ITermSelectionValuesMain {
  toggles: {
    quotaCapToggle: boolean;
    maximumTermToggle: boolean;
  };
  quotaCapValue: string | number;
  maximumTermValue: string | number;
}

export interface IPaymentsOptions {
  id: string;
  value: string;
  label: string;
}

export interface IPaymentConfigurationUI {
  paymentConfig: IPaymentConfiguration;
  paymentMethodOptions: IPaymentsOptions[];
  paymentCycleOptions: IPaymentsOptions[];
  firstPaymentDateOptions: IPaymentsOptions[];
  lang: "en" | "es";
  paymentConfiguration: {
    paymentMethod: {
      label: string;
      placeholder: string;
    };
    paymentCycle: {
      label: string;
    };
    firstPaymentDate: {
      label: string;
      placeholder: string;
    };
  };
  handlePaymentMethodChange: (value: string) => void;
  handlePaymentCycleChange: (value: string) => void;
  handleFirstPaymentDateChange: (value: string) => void;
  hasOnlyOnePaymentMethod: boolean;
  hasOnlyOnePaymentCycle: boolean;
  hasOnlyOneFirstPaymentDate: boolean;
}

export interface IPaymentConfigurationMain {
  paymentConfig: IPaymentConfiguration;
  onChange: (config: Partial<IPaymentConfiguration>) => void;
  onFormValid: (isValid: boolean) => void;
}

export interface IAmountCaptureProps {
  creditLine: string;
  amount: number;
  moneyDestination: string;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  onChange: (amount: number) => void;
  onFormValid: (isValid: boolean) => void;
  isMobile: boolean;
}

export interface IAmountCaptureUI {
  displayValue: string;
  loanAmountError: string;
  amountCaptureTexts: typeof amountCaptureTexts;
  handleCurrencyChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isMobile: boolean;
}

export type PaymentChannelItem = IResponsePaymentDatesChannel | { paymentChannels: IResponsePaymentDatesChannel[] };

export const amountCaptureTexts = {
  label: "Valor que el cliente espera recibir.",
  placeholder: "Ej. 500.000",
  errors: {
    zeroAmount: "El monto debe ser mayor a cero",
    rangeAmount: (from: number, to: number) =>
      `El monto debe estar entre ${from.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      })} y ${to.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      })}`,
    maxAmount: (max: number) =>
      `El monto máximo permitido es ${max.toLocaleString("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      })}`,
    validationFailed: "No se pudo validar el monto con las reglas de negocio",
    validationError: "Error al validar el monto del crédito",
  },
};

export const paymentConfiguration = {
  paymentMethod: {
    placeholder: "Selecciona una opcion",
    label: "Medio de pago",
  },
  paymentCycle: {
    placeholder: "Selecciona una opcion",
    label: "Ciclo de pagos",
  },
  firstPaymentDate: {
    placeholder: "Selecciona una opcion",
    label: "Primer ciclo de pago",
  },
};


/* export const dataAmount = {
  availableQuota: "Cupo disponible sin garantía.",
  expectToReceive: "Valor que el cliente espera recibir.",
  amountRequested: "Valor que el cliente espera recibir.",
  currentObligations: "¿Quiere abonar a otras obligaciones vigentes?",
  ordinaryPayment: "Medio de atención plan de pago ordinario",
  Periodicity: "Ciclo de pago",
  Requested: "(Requerido)",
  paymentDate: "Fecha primer pago",
  selectOption: "Selecciona una opción",
  creditText: "Cupo disponible sin garantía por línea de crédito",
  day15: "día-15",
  day30: "día-30",
  placeholderValue: "",
}; */

export const paymentConfigurationEnum = {
  paymentMethod: {
    label: {
      id: "paymentMethodLabel",
      code: "PaymentConfig_methodLabel",
      description: "Etiqueta medio de pago",
      i18n: { en: "Payment method", es: "Medio de pago" },
    },
    placeholder: {
      id: "paymentMethodPlaceholder",
      code: "PaymentConfig_methodPlaceholder",
      description: "Placeholder medio de pago",
      i18n: { en: "Select an option", es: "Selecciona una opcion" },
    },
  },
  paymentCycle: {
    label: {
      id: "paymentCycleLabel",
      code: "PaymentConfig_cycleLabel",
      description: "Etiqueta ciclo de pago",
      i18n: { en: "Payment cycle", es: "Ciclo de pagos" },
    },
  },
  firstPaymentDate: {
    label: {
      id: "firstPaymentDateLabel",
      code: "PaymentConfig_firstDateLabel",
      description: "Etiqueta primera fecha de pago",
      i18n: { en: "First payment cycle", es: "Primer ciclo de pago" },
    },
  },
    paymentDate: {
    label: {
      id: "paymentDate",
      code: "PaymentConfig_firstDateLabel",
      description: "Etiqueta primera fecha de pago",
      i18n: { en: "First payment date", es: "Fecha primer pago" },
    },
  },
};

export const amountCaptureTextsEnum = {
  label: {
    id: "label",
    code: "AmountCapture_label",
    description: "Etiqueta del valor que el cliente espera recibir",
    i18n: {
      en: "Amount the client expects to receive.",
      es: "Valor que el cliente espera recibir.",
    },
  },
  placeholder: {
    id: "placeholder",
    code: "AmountCapture_placeholder",
    description: "Ejemplo de monto",
    i18n: { en: "Eg. 500,000", es: "Ej. 500.000" },
  },
  errorZeroAmount: {
    id: "errorZeroAmount",
    code: "AmountCapture_errorZeroAmount",
    description: "Error monto cero",
    i18n: {
      en: "The amount must be greater than zero",
      es: "El monto debe ser mayor a cero",
    },
  },
  errorValidationFailed: {
    id: "errorValidationFailed",
    code: "AmountCapture_errorValidationFailed",
    description: "Error reglas de negocio",
    i18n: {
      en: "Could not validate the amount with business rules",
      es: "No se pudo validar el monto con las reglas de negocio",
    },
  },
};

export const dataAmountEnum = {
  availableQuota: {
    id: "availableQuota",
    code: "DataAmount_availableQuota",
    description: "Cupo disponible sin garantía",
    i18n: {
      en: "Available quota without guarantee.",
      es: "Cupo disponible sin garantía.",
    },
  },
  ordinaryPayment: {
    id: "ordinaryPayment",
    code: "DataAmount_ordinaryPayment",
    description: "Atención plan de pago ordinario",
    i18n: {
      en: "Ordinary payment plan attention method",
      es: "Medio de atención plan de pago ordinario",
    },
  },
};

export const loanDataEnum = {
  maximumTermPlaceholder: {
    id: "quotaCapTitle",
    code: "LoanData_quotaCapTitle",
    description: "Pregunta sobre el tope de cuota",
    i18n: {
      en: "e.g.: 12",
      es: "Ej: 12",
    },
  },
    quotaCapTitle: {
    id: "maximumTermPlaceholder",
    code: "maximumTermPlaceholder",
    description: "Máximo sobre el tope de cuota",
    i18n: {
      en: "Do you have a limit for the ordinary fee value?",
      es: "¿Tienes un tope para el valor de la cuota ordinaria?",
    },
  },
  quotaCapLabel: {
    id: "quotaCapLabel",
    code: "LoanData_quotaCapLabel",
    description: "Etiqueta cuanto tope de cuota",
    i18n: { en: "How much?", es: "¿Cuánto?" },
  },
  maximumTermTitle: {
    id: "maximumTermTitle",
    code: "LoanData_maximumTermTitle",
    description: "Pregunta sobre el plazo máximo",
    i18n: {
      en: "Do you have a maximum term for payment?",
      es: "¿Tienes un plazo máximo para el pago?",
    },
  },
  maximumTermLabel: {
    id: "maximumTermLabel",
    code: "LoanData_maximumTermLabel",
    description: "Etiqueta cuantos meses",
    i18n: { en: "How many months?", es: "¿Cuántos meses?" },
  },
  yes: {
    id: "yes",
    code: "LoanData_yes",
    description: "Opción sí",
    i18n: { en: "YES", es: "SÍ" },
  },
  no: {
    id: "no",
    code: "LoanData_no",
    description: "Opción no",
    i18n: { en: "NO", es: "NO" },
  },
};


export const getVerificationAddProductConfig = (lang: "en" | "es") => ({
  creditLineInfo: {
    title: stepsAddProductEnum.creditLineSelection.i18n[lang],
    fields: {
      creditLine: lang === "en" ? "Credit line" : "Línea de crédito",
      products: lang === "en" ? "Selected products" : "Productos seleccionados",
    },
  },
  paymentConfiguration: {
    title: stepsAddProductEnum.paymentConfiguration.i18n[lang],
    fields: {
      paymentMethod: dataAmountEnum.ordinaryPayment.i18n[lang],
      paymentCycle: paymentConfigurationEnum.paymentCycle.label.i18n[lang],
      firstPaymentDate: paymentConfigurationEnum.firstPaymentDate.label.i18n[lang],
    },
  },
  termInfo: {
    title: stepsAddProductEnum.termSelection.i18n[lang],
    fields: {
      quotaCap: loanDataEnum.quotaCapTitle.i18n[lang],
      maximumTerm: loanDataEnum.maximumTermTitle.i18n[lang],
    },
  },
  amountInfo: {
    title: stepsAddProductEnum.amountCapture.i18n[lang],
    fields: {
      creditAmount: amountCaptureTextsEnum.label.i18n[lang],
    },
  },
});