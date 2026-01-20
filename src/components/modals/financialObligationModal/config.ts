const entityOptionsEnum = [
  {
    id: "Bancolombia",
    code: "EntityOption_bancolombia",
    description: "Opción de entidad Bancolombia",
    value: "bancolombia",
    i18n: {
      en: "Bancolombia",
      es: "Bancolombia",
    },
  },
  {
    id: "Falabella",
    code: "EntityOption_falabella",
    description: "Opción de entidad Falabella",
    value: "falabella",
    i18n: {
      en: "Falabella",
      es: "Falabella",
    },
  },
  {
    id: "Davivienda",
    code: "EntityOption_davivienda",
    description: "Opción de entidad Davivienda",
    value: "davivienda",
    i18n: {
      en: "Davivienda",
      es: "Davivienda",
    },
  },
  {
    id: "Finandina",
    code: "EntityOption_finandina",
    description: "Opción de entidad Finandina",
    value: "finandina",
    i18n: {
      en: "Finandina",
      es: "Finandina",
    },
  },
  {
    id: "Propio",
    code: "EntityOption_own",
    description: "Opción de entidad propia",
    value: "propio",
    i18n: {
      en: "Own",
      es: "Propio",
    },
  },
];

const meansPaymentOptionsEnum = [
  {
    id: "Caja",
    code: "MeansPayment_cash_desk",
    description: "Medio de pago a través de caja",
    value: "Caja",
    i18n: {
      en: "Cash desk",
      es: "Caja",
    },
  },
  {
    id: "Nomina convencional",
    code: "MeansPayment_conventional_payroll",
    description: "Medio de pago por nómina convencional",
    value: "nomina convencional",
    i18n: {
      en: "Conventional Payroll",
      es: "Nomina convencional",
    },
  },
];

const dataInputsEnum = {
  close: {
    id: "close",
    code: "FinancialObligation_close",
    description: "Texto para el botón de cerrar",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  cancel: {
    id: "cancel",
    code: "FinancialObligation_cancel",
    description: "Texto para el botón de cancelar",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  labelType: {
    id: "labelType",
    code: "FinancialObligation_labelType",
    description: "Etiqueta para el tipo de obligación",
    i18n: {
      en: "Type",
      es: "Tipo",
    },
  },
  labelEntity: {
    id: "labelEntity",
    code: "FinancialObligation_labelEntity",
    description: "Etiqueta para la entidad financiera",
    i18n: {
      en: "Entity",
      es: "Entidad",
    },
  },
  labelPayment: {
    id: "labelPayment",
    code: "FinancialObligation_labelPayment",
    description: "Etiqueta para el medio de pago",
    i18n: {
      en: "Payment channel",
      es: "Medio de pago",
    },
  },
  palaceHolderSelect: {
    id: "palaceHolderSelect",
    code: "FinancialObligation_palaceHolderSelect",
    description: "Placeholder para campos de selección",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  labelFee: {
    id: "labelFee",
    code: "FinancialObligation_labelFee",
    description: "Etiqueta para el valor de la cuota",
    i18n: {
      en: "Fee",
      es: "Cuota",
    },
  },
  palaceHolderFee: {
    id: "palaceHolderFee",
    code: "FinancialObligation_palaceHolderFee",
    description: "Placeholder para el valor de la cuota",
    i18n: {
      en: "Fee amount",
      es: "Valor de la cuota",
    },
  },
  labelBalance: {
    id: "labelBalance",
    code: "FinancialObligation_labelBalance",
    description: "Etiqueta para el saldo de la deuda",
    i18n: {
      en: "Balance",
      es: "Saldo",
    },
  },
  palaceHolderBalance: {
    id: "palaceHolderBalance",
    code: "FinancialObligation_palaceHolderBalance",
    description: "Placeholder para el valor total o saldo",
    i18n: {
      en: "Total value",
      es: "Valor total",
    },
  },
  labelId: {
    id: "labelId",
    code: "FinancialObligation_labelId",
    description: "Etiqueta para el identificador",
    i18n: {
      en: "Id",
      es: "Id",
    },
  },
  palaceHolderId: {
    id: "palaceHolderId",
    code: "FinancialObligation_palaceHolderId",
    description: "Placeholder para el identificador",
    i18n: {
      en: "Identifier",
      es: "Identificador",
    },
  },
  labelFeePaid: {
    id: "labelFeePaid",
    code: "FinancialObligation_labelFeePaid",
    description: "Etiqueta para cuotas ya pagadas",
    i18n: {
      en: "Paid installments",
      es: "Cuotas pagadas",
    },
  },
  palaceHolderFeePaid: {
    id: "palaceHolderFeePaid",
    code: "FinancialObligation_palaceHolderFeePaid",
    description: "Placeholder para el número de cuotas pagadas",
    i18n: {
      en: "Paid installments",
      es: "Cuotas pagadas",
    },
  },
  labelterm: {
    id: "labelterm",
    code: "FinancialObligation_labelTerm",
    description: "Etiqueta para el plazo de la obligación",
    i18n: {
      en: "Term",
      es: "plazo",
    },
  },
  palaceHolderterm: {
    id: "palaceHolderterm",
    code: "FinancialObligation_palaceHolderTerm",
    description: "Placeholder para el total de cuotas",
    i18n: {
      en: "Total fees",
      es: "Total de cuotas",
    },
  },
  errorBanks: {
    code: "DisbursementAccount_errorBanks",
    description: "Error loading banks",
    i18n: {
      en: "Error retrieving banks",
      es: "Error al obtener bancos",
    },
  },
};

export const obligationTypeEnum = {
  consumo: {
    code: "ObligationType_consumo",
    description: "Consumption",
    i18n: {
      en: "Consumption",
      es: "Consumo",
    },
  },
  tarjeta: {
    code: "ObligationType_tarjeta",
    description: "Credit Card",
    i18n: {
      en: "Credit Card",
      es: "Tarjeta",
    },
  },
  vivienda: {
    code: "ObligationType_vivienda",
    description: "Housing",
    i18n: {
      en: "Housing",
      es: "Vivienda",
    },
  },
  vehiculo: {
    code: "ObligationType_vehiculo",
    description: "Vehicle",
    i18n: {
      en: "Vehicle",
      es: "Vehículo",
    },
  },
  otros: {
    code: "ObligationType_otros",
    description: "Others",
    i18n: {
      en: "Others",
      es: "Otros",
    },
  },
};

export const entityEnum = {
  bancolombia: {
    code: "Entity_bancolombia",
    description: "Bancolombia",
    i18n: {
      en: "Bancolombia",
      es: "Bancolombia",
    },
  },
  falabella: {
    code: "Entity_falabella",
    description: "Falabella",
    i18n: {
      en: "Falabella",
      es: "Falabella",
    },
  },
  davivienda: {
    code: "Entity_davivienda",
    description: "Davivienda",
    i18n: {
      en: "Davivienda",
      es: "Davivienda",
    },
  },
  finandina: {
    code: "Entity_finandina",
    description: "Finandina",
    i18n: {
      en: "Finandina",
      es: "Finandina",
    },
  },
  propio: {
    code: "Entity_propio",
    description: "Own",
    i18n: {
      en: "Own",
      es: "Propio",
    },
  },
};

export const meansPaymentEnum = {
  caja: {
    code: "MeansPayment_caja",
    description: "Cash Desk",
    i18n: {
      en: "Cash Desk",
      es: "Caja",
    },
  },
  nominaConvencional: {
    code: "MeansPayment_nomina_convencional",
    description: "Conventional Payroll",
    i18n: {
      en: "Conventional Payroll",
      es: "Nómina convencional",
    },
  },
};

export const obligationTypeOptionsEnum = [
  {
    id: "Consumo",
    code: "ObligationType_consumption",
    description: "Tipo de obligación de consumo",
    value: "consumo",
    i18n: {
      en: "Consumption",
      es: "Consumo",
    },
  },
  {
    id: "Tarjeta",
    code: "ObligationType_card",
    description: "Tipo de obligación de tarjeta de crédito",
    value: "tarjeta",
    i18n: {
      en: "Card",
      es: "Tarjeta",
    },
  },
  {
    id: "Vivienda",
    code: "ObligationType_housing",
    description: "Tipo de obligación de vivienda",
    value: "vivienda",
    i18n: {
      en: "Housing",
      es: "Vivienda",
    },
  },
  {
    id: "Vehículo",
    code: "ObligationType_vehicle",
    description: "Tipo de obligación de vehículo",
    value: "vehículo",
    i18n: {
      en: "Vehicle",
      es: "Vehículo",
    },
  },
  {
    id: "Otros",
    code: "ObligationType_others",
    description: "Otros tipos de obligaciones",
    value: "otros",
    i18n: {
      en: "Others",
      es: "Otros",
    },
  },
];

export { entityOptionsEnum, meansPaymentOptionsEnum, dataInputsEnum };
