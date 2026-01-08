export interface IFinancialObligation {
  type: string;
  balance: number;
  fee: number;
  entity: string;
  payment: string;
  feePaid: string;
  actions: string;
  id: string;
  idUser: string;
}

export const headers: {
  label: string;
  key: keyof IFinancialObligation;
  action?: boolean;
}[] = [
  { label: "Tipo", key: "type" },
  { label: "Saldo", key: "balance" },
  { label: "Cuota", key: "fee" },
  { label: "Entidad", key: "entity" },
  { label: "Medio de pago", key: "payment" },
  { label: "Id", key: "idUser" },
  { label: "Altura", key: "feePaid" },
  { label: "Acciones", key: "actions", action: true },
];

export const dataReport = {
  title: "Obligaciones financieras",
  close: "Cerrar",
  addObligations: "Agregar obligaciones",
  noData: "¡Ups! No se encontraron obligaciones financieras vigentes.",
  totalFee: "Cuota Total",
  totalBalance: "Saldo Total",
};

export const defaultOptionsSelect = {
  id: "0",
  label: "No hay deudores",
  value: "0",
};

export const configSelect = {
  name: "deudor",
  label: "Deudor",
  placeholder: "Seleccione una opcion",
};

export const restoreData = {
  justification: "Restore financial obligations",
  label: "Restaurar",
};

export const errorMessages = {
  updateProspect: {
    description: "No se pudieron restaurar las obligaciones financieras.",
  }
}

export const dataFinancialObligationEnum = {
  title: {
    code: "FinancialObligation_title",
    description: "Financial obligations title",
    i18n: {
      en: "Financial obligations",
      es: "Obligaciones financieras",
    },
  },
  close: {
    code: "FinancialObligation_close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  addObligations: {
    code: "FinancialObligation_addObligations",
    description: "Add financial obligations",
    i18n: {
      en: "Add obligations",
      es: "Agregar obligaciones",
    },
  },
  noData: {
    code: "FinancialObligation_noData",
    description: "No financial obligations found",
    i18n: {
      en: "No financial obligations were found.",
      es: "¡Ups! No se encontraron obligaciones financieras vigentes.",
    },
  },
  totalFee: {
    code: "FinancialObligation_totalFee",
    description: "Total fee",
    i18n: {
      en: "Total fee",
      es: "Cuota Total",
    },
  },
  totalBalance: {
    code: "FinancialObligation_totalBalance",
    description: "Total balance",
    i18n: {
      en: "Total balance",
      es: "Saldo Total",
    },
  },
};
