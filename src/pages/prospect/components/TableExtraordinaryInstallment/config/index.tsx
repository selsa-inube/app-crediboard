import { currencyFormat } from "@utils/formatData/currency";
import { IHeaders } from "@components/modals/ExtraordinaryPaymentModal/types";

export const rowsVisbleMobile = ["datePayment", "value", "actions"];

export const rowsActions = [
  {
    label: "Acciones",
    key: "actions",
  },
];

export const headersTableExtraordinaryInstallment: IHeaders[] = [
  {
    label: "Fecha",
    key: "datePayment",
  },
  {
    label: "Valor",
    key: "value",
    mask: (value: string | number) => {
      return currencyFormat(value as number);
    },
  },
  {
    label: "Medio de pago",
    key: "paymentMethod",
  },
];

export const dataTableExtraordinaryInstallment = {
  noData: "¡Ups! No se encontraron registros.",
  deletion: "Eliminación",
  delete: "Eliminar",
  content: "¿Realmente desea eliminar este pago extra?",
  cancel: "Cancelar",
};

export const messageError = {
  removeExtraordinaryInstallments: {
    description: "Error no se pudo eliminar los Pagos Extras."
  }
}

export const dataTableExtraordinaryInstallmentEnum = {
  noData: {
    code: "DataTableExtraordinaryInstallment_noData",
    description: "Message shown when no extraordinary installment records are found",
    i18n: {
      en: "Oops! No records found.",
      es: "¡Ups! No se encontraron registros.",
    },
  },
  deletion: {
    code: "DataTableExtraordinaryInstallment_deletion",
    description: "Label for deletion action",
    i18n: {
      en: "Deletion",
      es: "Eliminación",
    },
  },
  delete: {
    code: "DataTableExtraordinaryInstallment_delete",
    description: "Label for delete button",
    i18n: {
      en: "Delete",
      es: "Eliminar",
    },
  },
  content: {
    code: "DataTableExtraordinaryInstallment_content",
    description: "Confirmation text for deleting an extraordinary installment",
    i18n: {
      en: "Do you really want to delete this extra payment?",
      es: "¿Realmente desea eliminar este pago extra?",
    },
  },
  cancel: {
    code: "DataTableExtraordinaryInstallment_cancel",
    description: "Label for cancel action",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
};

export const messageErrorEnum = {
  removeExtraordinaryInstallments: {
    code: "MessageError_removeExtraordinaryInstallments",
    description: "Error when failing to remove extraordinary installments",
    i18n: {
      en: "Error could not remove the Extra Payments.",
      es: "Error no se pudo eliminar los Pagos Extras.",
    },
  },
};


export const pageLength = 5;
