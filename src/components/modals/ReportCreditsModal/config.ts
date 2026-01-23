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

export const defaultOptionsSelectEnum = {
  noDebtors: {
    id: "0",
    code: "DebtorSelect_noDebtors",
    description: "Opción por defecto cuando no hay deudores disponibles",
    value: "0",
    i18n: {
      en: "No borrowers",
      es: "No hay deudores",
    },
  },
};

export const configSelectEnum = {
  label: {
    id: "debtorLabel",
    code: "DebtorSelect_label",
    description: "Etiqueta para el selector de deudores",
    i18n: {
      en: "Borrower",
      es: "Deudor",
    },
  },
  placeholder: {
    id: "borrowerPlaceholder",
    code: "BorrowerSelect_placeholder",
    description: "Placeholder para el selector de deudores",
    i18n: {
      en: "Select an option",
      es: "Seleccione una opción",
    },
  },
  name: {
    id: "borrowerPlaceholder",
    code: "BorrowerSelect_placeholder",
    description: "name",
    i18n: {
      en: "borrower",
      es: "borrower",
    },
  },
};

export const restoreDataEnum = {
  justification: {
    id: "restoreJustification",
    code: "Restore_justification",
    description:
      "Justificación para la restauración de obligaciones financieras",
    i18n: {
      en: "Restore financial obligations",
      es: "Restaurar obligaciones financieras",
    },
  },
  label: {
    id: "restoreLabel",
    code: "Restore_label",
    description: "Etiqueta para el botón de restaurar",
    i18n: {
      en: "Restore",
      es: "Restaurar",
    },
  },
};

export const errorMessagesEnum = {
  updateProspectDescription: {
    id: "updateProspectDescription",
    code: "Error_updateProspectDescription",
    description:
      "Mensaje de error cuando falla la restauración de obligaciones",
    i18n: {
      en: "Financial obligations could not be restored.",
      es: "No se pudieron restaurar las obligaciones financieras.",
    },
  },
};
