export const dataTabs = [
  {
    id: "borrower",
    label: "Codeudor",
  },
  { id: "mortgage", label: "Hipoteca" },
  { id: "pledge", label: "Pignoración" },
  { id: "bail", label: "Fianza" },
];

export const dataGuarantee = {
  title: "Garantías ofrecidas",
  close: "Cerrar",
  borrower: "Codeudor",
  noBorrowersTitle: "No se encontraron codeudores.",
  noBorrowersDescription: "No hay codeudores disponibles para esta solicitud.",
  retry: "Volver a intentar",
  errorMortgage: "Error al obtener los datos de la Hipoteca",
  errorPledge: "Error al obtener los datos de la Pignoración",
  errorCoDebtor: "Error al obtener los datos del Codeudor",
};

export const dataTabsEnum = {
  borrower: {
    id: "borrower",
    code: "GuaranteeTabs_borrower",
    description: "Co-debtor tab",
    i18n: {
      en: "Co-debtor",
      es: "Codeudor",
    },
  },
  mortgage: {
    id: "mortgage",
    code: "GuaranteeTabs_mortgage",
    description: "Mortgage tab",
    i18n: {
      en: "Mortgage",
      es: "Hipoteca",
    },
  },
  pledge: {
    id: "pledge",
    code: "GuaranteeTabs_pledge",
    description: "Pledge tab",
    i18n: {
      en: "Pledge",
      es: "Pignoración",
    },
  },
  bail: {
    id: "bail",
    code: "GuaranteeTabs_bail",
    description: "Bail tab",
    i18n: {
      en: "Bail",
      es: "Fianza",
    },
  },
};

export const dataGuaranteeEnum = {
  title: {
    code: "Guarantee_title",
    description: "Guarantees offered title",
    i18n: {
      en: "Offered guarantees",
      es: "Garantías ofrecidas",
    },
  },
  close: {
    code: "Guarantee_close",
    description: "Close",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  borrower: {
    code: "Guarantee_borrower",
    description: "Co-debtor label",
    i18n: {
      en: "Co-debtor",
      es: "Codeudor",
    },
  },
  noBorrowersTitle: {
    code: "Guarantee_noBorrowersTitle",
    description: "No co-debtors found title",
    i18n: {
      en: "No co-debtors found.",
      es: "No se encontraron codeudores.",
    },
  },
  noBorrowersDescription: {
    code: "Guarantee_noBorrowersDescription",
    description: "No co-debtors found description",
    i18n: {
      en: "There are no co-debtors available for this request.",
      es: "No hay codeudores disponibles para esta solicitud.",
    },
  },
  retry: {
    code: "Guarantee_retry",
    description: "Retry action",
    i18n: {
      en: "Retry",
      es: "Volver a intentar",
    },
  },
  errorMortgage: {
    code: "Guarantee_errorMortgage",
    description: "Mortgage error",
    i18n: {
      en: "Error retrieving mortgage data",
      es: "Error al obtener los datos de la Hipoteca",
    },
  },
  errorPledge: {
    code: "Guarantee_errorPledge",
    description: "Pledge error",
    i18n: {
      en: "Error retrieving pledge data",
      es: "Error al obtener los datos de la Pignoración",
    },
  },
  errorCoDebtor: {
    code: "Guarantee_errorCoDebtor",
    description: "Co-debtor error",
    i18n: {
      en: "Error retrieving co-debtor data",
      es: "Error al obtener los datos del Codeudor",
    },
  },
};
