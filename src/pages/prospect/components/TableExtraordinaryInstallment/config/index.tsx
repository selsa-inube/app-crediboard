import { currencyFormat } from "@utils/formatData/currency";
import { IHeaders } from "@components/modals/ExtraordinaryPaymentModal/types";

import { EnumType } from "@hooks/useEnum";

export const rowsVisbleMobile = ["datePayment", "value", "actions"];

export const rowsActions = [
  {
    label: "Acciones",
    key: "actions",
  },
];

export const headersExtraordinaryInstallmentLabels = {
  date: {
    code: "Headers_date",
    description: "Label for the date column",
    i18n: {
      en: "Date",
      es: "Fecha",
    },
  },
  value: {
    code: "Headers_value",
    description: "Label for the value column",
    i18n: {
      en: "Value",
      es: "Valor",
    },
  },
  paymentMethod: {
    code: "Headers_paymentMethod",
    description: "Label for the payment method column",
    i18n: {
      en: "Payment method",
      es: "Medio de pago",
    },
  },
};

export const getHeadersTableExtraordinaryInstallment = (
  lang: EnumType,
): IHeaders[] => [
  {
    label: headersExtraordinaryInstallmentLabels.date.i18n[lang],
    key: "datePayment",
  },
  {
    label: headersExtraordinaryInstallmentLabels.value.i18n[lang],
    key: "value",
    mask: (value: string | number) => {
      return currencyFormat(value as number);
    },
  },
  {
    label: headersExtraordinaryInstallmentLabels.paymentMethod.i18n[lang],
    key: "paymentMethod",
  },
];

export const messageError = {
  removeExtraordinaryInstallments: {
    description: "Error no se pudo eliminar los Pagos Extras.",
  },
};

export const dataTableExtraordinaryInstallmentEnum = {
  noData: {
    code: "DataTableExtraordinaryInstallment_noData",
    description:
      "Message shown when no extraordinary installment records are found",
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
      es: "¿Estás seguro de eliminar?",
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
      es: "¿Realmente deseas eliminar este pago extra?",
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
