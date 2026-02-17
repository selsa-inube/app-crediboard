export interface RowData {
  type: string;
  balance: string;
  fee: string;
  entity: string;
  payment: string;
  feePaid: string;
  actions: string;
  id: string;
  idUser: string;
}

export const headers: {
  label: string;
  key: keyof RowData;
  action?: boolean;
}[] = [
  { label: "Tipo", key: "type" },
  { label: "Saldo", key: "balance" },
  { label: "Cuota", key: "fee" },
  { label: "Entidad", key: "entity" },
  { label: "Medio de pago", key: "payment" },
  { label: "Id", key: "idUser" },
  { label: "Cuotas", key: "feePaid" },
  { label: "Acciones", key: "actions", action: true },
];

export const dataReportEnum = {
  title: {
    code: "DataReport_title",
    description: "Title of the financial obligations report",
    i18n: {
      en: "Financial obligations",
      es: "Obligaciones financieras",
    },
  },
  description: {
    code: "DataReport_description",
    description: "Name of the user or client",
    i18n: {
      en: "Camilo Alberto Rincon Jaramillo",
      es: "Camilo Alberto Rincon Jaramillo",
    },
  },
  addObligations: {
    code: "DataReport_addObligations",
    description: "Label for adding obligations",
    i18n: {
      en: "Add obligations",
      es: "Agregar obligaciones",
    },
  },
  noData: {
    code: "DataReport_noData",
    description: "Message when no financial obligations exist",
    i18n: {
      en: "No financial obligations exist",
      es: "No existen obligaciones financieras",
    },
  },
  descriptionTotalFee: {
    code: "DataReport_descriptionTotalFee",
    description: "Label for total loan amount",
    i18n: {
      en: "Total loan amount.",
      es: "Cuota total.",
    },
  },
  descriptionTotalBalance: {
    code: "DataReport_descriptionTotalBalance",
    description: "Label for total balance",
    i18n: {
      en: "Total balance.",
      es: "Saldo total.",
    },
  },
  close: {
    code: "DataReport_close",
    description: "Label for close action",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  restore: {
    code: "DataReport_restore",
    description: "Label for restore action",
    i18n: {
      en: "Restore",
      es: "Restablecer",
    },
  },
  descriptionModal: {
    code: "DataReport_descriptionModal",
    description: "Confirmation text for restoring values",
    i18n: {
      en: "Do you really want to restore the values to their initial state?",
      es: "¿Realmente desea restablecer los valores a su estado inicial?",
    },
  },
  save: {
    code: "DataReport_save",
    description: "Label for save action",
    i18n: {
      en: "Save",
      es: "Guardar",
    },
  },
  edit: {
    code: "DataReport_edit",
    description: "Label for edit action",
    i18n: {
      en: "Edit",
      es: "Editar",
    },
  },
  deletion: {
    code: "DataReport_deletion",
    description: "Label for deletion action",
    i18n: {
      en: "Deletion",
      es: "Eliminación",
    },
  },
  delete: {
    code: "DataReport_delete",
    description: "Label for delete button",
    i18n: {
      en: "Delete",
      es: "Eliminar",
    },
  },
  content: {
    code: "DataReport_content",
    description: "Confirmation text for deleting an obligation",
    i18n: {
      en: "Do you really want to delete this obligation?",
      es: "¿Realmente desea eliminar esta obligación?",
    },
  },
  cancel: {
    code: "DataReport_cancel",
    description: "Label for cancel action",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  errorIncome: {
    code: "DataReport_errorIncome",
    description: "Error when restoring income sources",
    i18n: {
      en: "Error restoring income sources",
      es: "Error al restablecer las fuentes de ingresos",
    },
  },
  add: {
    code: "DataReport_add",
    description: "Label for add action",
    i18n: {
      en: "Add",
      es: "Agregar",
    },
  },
};

export function convertObligationsToProperties(
  obligations: {
    balanceObligationTotal: number;
    duesPaid: number;
    entity: string;
    nextPaymentValueTotal: number;
    obligationNumber: string;
    outstandingDues: number;
    paymentMethodName: string;
    productName: string;
  }[],
): { propertyName: string; propertyValue: string }[] {
  return obligations.map((obligation) => ({
    propertyName: "FinancialObligation",
    propertyValue: [
      obligation.productName ?? "",
      obligation.balanceObligationTotal ?? 0,
      obligation.nextPaymentValueTotal ?? 0,
      obligation.entity ?? "",
      obligation.paymentMethodName ?? "",
      obligation.obligationNumber ?? "",
      obligation.duesPaid ?? 0,
      obligation.outstandingDues ?? 0,
    ].join(", "),
  }));
}

export const ROWS_PER_PAGE = 4;

export const errorMessages = {
  save: {
    title: "Error al guardar.",
    description: "Error al guardar la nueva obligación financiera.",
  },
  update: {
    title: "Error al actualizar.",
    description: "Error al actualizar la obligación financiera.",
  },
};

export const errorMessagesEnum = {
  save: {
    code: "ErrorMessages_save",
    description: "Error when saving a new financial obligation",
    i18n: {
      en: "Error saving.",
      es: "Error al guardar.",
    },
  },
  update: {
    code: "ErrorMessages_update",
    description: "Error when updating a financial obligation",
    i18n: {
      en: "Error updating.",
      es: "Error al actualizar.",
    },
  },
};
