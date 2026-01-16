import {
  MdOutlinePayments,
  MdOutlineMonetizationOn,
  MdOutlineBalance,
  MdOutlineAccountBalanceWallet,
  MdOutlineEdit,
  MdOutlineRemoveRedEye,
  MdOutlineMessage,
} from "react-icons/md";

import { IOptions } from "@components/navigation/MenuProspect/types";
import { EnumType } from "@hooks/useEnum";

export const SummaryTitlesEnum = {
  requestedAmount: {
    code: "Summary_requestedAmount",
    description: "Requested credit amount",
    i18n: {
      en: "Requested Amount",
      es: "Monto solicitado",
    },
  },
  totalConsolidatedAmount: {
    code: "Summary_totalConsolidatedAmount",
    description: "Consolidated obligations amount",
    i18n: {
      en: "Consolidated Obligations",
      es: "Obligaciones recogidas",
    },
  },
  deductibleExpenses: {
    code: "Summary_deductibleExpenses",
    description: "Deductible expenses",
    i18n: {
      en: "Deductible Expenses",
      es: "Gastos descontables",
    },
  },
  netAmountToDisburse: {
    code: "Summary_netAmountToDisburse",
    description: "Net amount to disburse",
    i18n: {
      en: "Net to Disburse",
      es: "Neto a girar",
    },
  },
  totalRegularInstallment: {
    code: "Summary_totalRegularInstallment",
    description: "Regular installment amount",
    i18n: {
      en: "Regular Installment",
      es: "Cuota ordinaria",
    },
  },
};

export const SummaryProspectCreditEnum = [
  {
    item: [
      {
        id: "requestedAmount",
        title: SummaryTitlesEnum.requestedAmount,
        miniIcon: false,
        operation: "-",
      },
      {
        id: "totalConsolidatedAmount",
        title: SummaryTitlesEnum.totalConsolidatedAmount,
        miniIcon: true,
        icon: <MdOutlineEdit />,
        modal: "edit",
        operation: "-",
      },
      {
        id: "deductibleExpenses",
        title: SummaryTitlesEnum.deductibleExpenses,
        miniIcon: true,
        icon: <MdOutlineRemoveRedEye />,
        modal: "view",
        operation: "=",
      },
      {
        id: "netAmountToDisburse",
        title: SummaryTitlesEnum.netAmountToDisburse,
        miniIcon: false,
        operation: "|",
      },
      {
        id: "totalRegularInstallment",
        title: SummaryTitlesEnum.totalRegularInstallment,
        miniIcon: true,
        operation: "",
      },
    ],
    iconEdit: false,
  },
];


export const incomeOptions = [
  { id: "user1", label: "Camilo Rincón", value: "camilo-rincon" },
  {
    id: "user2",
    label: "Juan Carlos Pérez Gómez",
    value: "juan-carlos-perez-gomez",
  },
  {
    id: "user3",
    label: "Sofía Alejandra Romero Ruiz",
    value: "sofia-alejandra-romero-ruiz",
  },
];

export const menuOptionsEnum = {
  creditLimit: {
    code: "MenuOptions_creditLimit",
    description: "Menu option for credit limit",
    i18n: {
      en: "Credit Limit Source",
      es: "Origen de cupo",
    },
  },
  incomeSources: {
    code: "MenuOptions_incomeSources",
    description: "Menu option for income sources",
    i18n: {
      en: "Income Sources",
      es: "Fuentes de ingreso",
    },
  },
  financialObligations: {
    code: "MenuOptions_financialObligations",
    description: "Menu option for financial obligations",
    i18n: {
      en: "Financial Obligations",
      es: "Obligaciones financieras",
    },
  },
  preApprovalObservations: {
    code: "MenuOptions_preApprovalObservations",
    description: "Menu option for pre-approval observations",
    i18n: {
      en: "Pre-approval Observations",
      es: "Observaciones de preaprobación",
    },
  },
  extraPayments: {
    code: "MenuOptions_extraPayments",
    description: "Menu option for extra payments",
    i18n: {
      en: "Extraordinary installments",
      es: "Pagos extras",
    },
  },
} as const;

export const menuOptions = (
  handleOpenModal: (modalName: string) => void,
  visibleExtraPayments: boolean,
  lang: EnumType
): IOptions[] => [
  {
    title: menuOptionsEnum.creditLimit.i18n[lang],
    onClick: () => handleOpenModal("creditLimit"),
    icon: <MdOutlineBalance />,
    visible: true,
  },
  {
    title: menuOptionsEnum.incomeSources.i18n[lang],
    onClick: () => handleOpenModal("IncomeModal"),
    icon: <MdOutlineAccountBalanceWallet />,
    visible: true,
  },
  {
    title: menuOptionsEnum.financialObligations.i18n[lang],
    onClick: () => handleOpenModal("reportCreditsModal"),
    icon: <MdOutlineMonetizationOn />,
    visible: true,
  },
  {
    title: menuOptionsEnum.preApprovalObservations.i18n[lang],
    onClick: () => {
      handleOpenModal("observationsModal");
    },
    icon: <MdOutlineMessage />,
    visible: true,
  },
  {
    title: menuOptionsEnum.extraPayments.i18n[lang],
    onClick: () => {
      handleOpenModal("extraPayments");
    },
    icon: <MdOutlinePayments />,
    visible: !visibleExtraPayments,
  },
];

export const tittleOptionsEnum = {
  titleCreditId: {
    code: "TittleOptions_titleCreditId",
    description: "Label for credit ID",
    i18n: {
      en: "No. Ref.: ",
      es: "No. Rad.: ",
    },
  },
  titleDestination: {
    code: "TittleOptions_titleDestination",
    description: "Label for destination",
    i18n: {
      en: "Destination: ",
      es: "Destino: ",
    },
  },
  tittleAmount: {
    code: "TittleOptions_tittleAmount",
    description: "Label for amount",
    i18n: {
      en: "Amount: ",
      es: "Valor: ",
    },
  },
  titleProfile: {
    code: "TittleOptions_titleProfile",
    description: "Label to view credit profile",
    i18n: {
      en: "View credit profile",
      es: "Ver perfil crediticio",
    },
  },
  titleDisbursement: {
    code: "TittleOptions_titleDisbursement",
    description: "Label for Disbursements modeinstead",
    i18n: {
      en: "Disbursements modeinstead",
      es: "Medios de desembolso",
    },
  },
  titleCall: {
    code: "TittleOptions_titleCall",
    description: "Label for phone call action",
    i18n: {
      en: "Call",
      es: "Llamada",
    },
  },
  titleVideoCall: {
    code: "TittleOptions_titleVideoCall",
    description: "Label for video call action",
    i18n: {
      en: "Video call",
      es: "Videollamada",
    },
  },
  titleAddProduct: {
    code: "TittleOptions_titleAddProduct",
    description: "Label to add a product",
    i18n: {
      en: "Add product",
      es: "Agregar producto",
    },
  },
  titleExtraPayments: {
    code: "TittleOptions_titleExtraPayments",
    description: "Label for extra payments",
    i18n: {
      en: "Extraordinary installments",
      es: "Pagos extras",
    },
  },
  titleError: {
    code: "TittleOptions_titleError",
    description: "Title for error messages",
    i18n: {
      en: "Oops, something went wrong!",
      es: "¡Uy, algo ha salido mal!",
    },
  },
  descriptionError: {
    code: "TittleOptions_descriptionError",
    description: "Description for error messages",
    i18n: {
      en: "Changes could not be saved.",
      es: "No se han podido guardar los cambios.",
    },
  },
  deductibleExpensesErrorTitle: {
    code: "TittleOptions_deductibleExpensesErrorTitle",
    description: "Title for deductible expenses loading error",
    i18n: {
      en: "Error loading deductible expenses",
      es: "Error al cargar gastos descontables",
    },
  },
  descriptionDelete: {
    code: "TittleOptions_descriptionDelete",
    description: "Confirmation message for deleting a product",
    i18n: {
      en: "Do you really want to delete this product?",
      es: "¿Realmente desea eliminar este producto?",
    },
  },
  successDeleteDescription: {
    code: "TittleOptions_successDeleteDescription",
    description: "Message when product deletion succeeds",
    i18n: {
      en: "The product was successfully deleted",
      es: "El producto fue eliminado correctamente",
    },
  },
  successDeleteTitle: {
    code: "TittleOptions_successDeleteTitle",
    description: "Title for successful deletion",
    i18n: {
      en: "Product deleted",
      es: "Producto eliminado",
    },
  },
  errorDeleteProduct: {
    code: "TittleOptions_errorDeleteProduct",
    description: "Message when product deletion fails",
    i18n: {
      en: "Could not delete the product",
      es: "No se pudo eliminar el producto",
    },
  },
};
export const initialDisbursementState = {
  internal: null,
  external: null,
  checkEntity: null,
  checkManagement: null,
  cash: null,
};

export const infoErrorProspectEnum = {
  description: {
    id: "infoErrorProspect_description",
    code: "InfoErrorProspect_description",
    description: "Error message when prospect data cannot be retrieved",
    i18n: {
      en: "Could not retrieve the related prospect data",
      es: "No se pudo obtener los datos del prospecto relacionado",
    },
  },
};