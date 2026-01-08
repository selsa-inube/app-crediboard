const obligationTypeOptions = [
  {
    id: "Consumo",
    label: "Consumo",
    value: "consumo",
  },
  {
    id: "Tarjeta",
    label: "Tarjeta",
    value: "tarjeta",
  },
  {
    id: "Vivienda",
    label: "Vivienda",
    value: "vivienda",
  },
  {
    id: "Vehículo",
    label: "Vehículo",
    value: "vehículo",
  },
  {
    id: "Otros",
    label: "Otros",
    value: "otros",
  },
];

const entityOptions = [
  {
    id: "Bancolombia",
    label: "Bancolombia",
    value: "bancolombia",
  },
  {
    id: "Falabella",
    label: "Falabella",
    value: "falabella",
  },
  {
    id: "Davivienda",
    label: "Davivienda",
    value: "davivienda",
  },
  {
    id: "Finandina",
    label: "Finandina",
    value: "finandina",
  },
  {
    id: "Propio",
    label: "Propio",
    value: "propio",
  },
];

const meansPaymentOptions = [
  {
    id: "Caja",
    label: "Caja",
    value: "Caja",
  },
  {
    id: "Nomina convencional",
    label: "Nomina convencional",
    value: "nomina convencional",
  },
];

const dataInputs = {
  close: "Cerrar",
  cancel: "Cancelar",
  labelType: "Tipo",
  labelEntity: "Entidad",
  labelPayment: "Medio de pago",
  palaceHolderSelect: "Selecciona una opción",
  labelFee: "Cuota",
  palaceHolderFee: "Valor de la cuota",
  labelBalance: "Saldo",
  palaceHolderBalance: "Valor total",
  labelId: "Id",
  palaceHolderId: "Identificador",
  labelFeePaid: "Cuotas pagadas",
  palaceHolderFeePaid: "Cuotas pagadas",
  labelterm: "plazo",
  palaceHolderterm: "Total de cuotas",
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


export {
  obligationTypeOptions,
  entityOptions,
  meansPaymentOptions,
  dataInputs,
};
