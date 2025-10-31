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
};

export const errorMessages = {
  updateProspect: {
    description: "No se pudieron restaurar las obligaciones financieras.",
  }
}
