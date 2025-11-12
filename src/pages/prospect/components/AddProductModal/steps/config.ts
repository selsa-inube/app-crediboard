import * as Yup from "yup";

import { stepsAddProduct } from "../config";

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

export const loanData = {
  quotaCapTitle: "¿Tienes un tope para el valor de la cuota ordinaria?",
  quotaCapLabel: "¿Cuánto?",
  quotaCapPlaceholder: "Ej: 10.000.000",
  maximumTermTitle: "¿Tienes un plazo máximo para el pago?",
  maximumTermLabel: "¿Cuántos meses?",
  maximumTermPlaceholder: "Ej: 12",
  yes: "SI",
  no: "NO",
};

export const dataAmount = {
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
};

export const verificationAddProductConfig = {
  creditLineInfo: {
    title: stepsAddProduct.creditLineSelection.name,
    fields: {
      creditLine: "Línea de crédito",
      products: "Productos seleccionados",
    },
  },
  paymentConfiguration: {
    title: stepsAddProduct.paymentConfiguration.name,
    fields: {
      paymentMethod: dataAmount.ordinaryPayment,
      paymentCycle: paymentConfiguration.paymentCycle.label,
      firstPaymentDate: paymentConfiguration.firstPaymentDate.label,
    },
  },
  termInfo: {
    title: stepsAddProduct.termSelection.name,
    fields: {
      quotaCap: loanData.quotaCapTitle,
      maximumTerm: loanData.maximumTermTitle,
    },
  },
  amountInfo: {
    title: stepsAddProduct.amountCapture.name,
    fields: {
      creditAmount: amountCaptureTexts.label,
    },
  },
};