export const incomeModalConfigEnum = {
  title: {
    id: "title",
    code: "IncomeModal_title",
    description: "Título principal del modal de crédito vacacional",
    i18n: {
      en: "Max limit for Vacation Credit",
      es: "Tope máx. para Crédito vacacional",
    },
  },
  loading: {
    id: "loading",
    code: "IncomeModal_loading",
    description: "Texto de carga general",
    i18n: {
      en: "Loading...",
      es: "Cargando...",
    },
  },
  errorTitle: {
    id: "errorTitle",
    code: "IncomeModal_errorTitle",
    description: "Título del mensaje de error",
    i18n: {
      en: "Error loading data",
      es: "Error cargando datos",
    },
  },
  errorMessage: {
    id: "errorMessage",
    code: "IncomeModal_errorMessage",
    description: "Mensaje detallado de error",
    i18n: {
      en: "The data could not be loaded. Please try again later.",
      es: "No se pudieron cargar los datos. Intenta nuevamente más tarde.",
    },
  },
  incomeSourcesLabel: {
    id: "incomeSourcesLabel",
    code: "IncomeModal_incomeSourcesLabel",
    description: "Etiqueta para el total de fuentes de ingreso",
    i18n: {
      en: "Total reported income sources",
      es: "Total fuentes de ingreso reportadas",
    },
  },
  financialObligationsLabel: {
    id: "financialObligationsLabel",
    code: "IncomeModal_financialObligationsLabel",
    description: "Etiqueta para el tope máximo de la línea",
    i18n: {
      en: "(+) Maximum limit for the credit line",
      es: "(+) Tope máximo para la línea de crédito",
    },
  },
  subsistenceReserveLabel: {
    id: "subsistenceReserveLabel",
    code: "IncomeModal_subsistenceReserveLabel",
    description: "Etiqueta para la cartera vigente",
    i18n: {
      en: "(-) Current portfolio in the credit line",
      es: "(-) Cartera vigente en la línea de crédito",
    },
  },
  availableCommitmentsLabel: {
    id: "availableCommitmentsLabel",
    code: "IncomeModal_availableCommitmentsLabel",
    description: "Etiqueta para el neto disponible",
    i18n: {
      en: "Net available for new commitments",
      es: "Neto disponible para nuevos compromisos",
    },
  },
  maxVacationTermLabel: {
    id: "maxVacationTermLabel",
    code: "IncomeModal_maxVacationTermLabel",
    description: "Etiqueta para el plazo máximo",
    i18n: {
      en: "Max term in 'vacation'",
      es: "Plazo máx. en ‘vacaciones’",
    },
  },
  textfieldLabel: {
    id: "textfieldLabel",
    code: "IncomeModal_textfieldLabel",
    description: "Etiqueta para el campo de monto máximo",
    i18n: {
      en: "Maximum amount",
      es: "Monto máximo",
    },
  },
  textfieldPlaceholder: {
    id: "textfieldPlaceholder",
    code: "IncomeModal_textfieldPlaceholder",
    description: "Placeholder para el campo de monto",
    i18n: {
      en: "Enter the amount",
      es: "Ingrese la cantidad",
    },
  },
  btnClose: {
    id: "btnClose",
    code: "IncomeModal_btnClose",
    description: "Texto para el botón de cerrar",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  btnRecalculate: {
    id: "btnRecalculate",
    code: "IncomeModal_btnRecalculate",
    description: "Texto para el botón de recalcular",
    i18n: {
      en: "Recalculate",
      es: "Recalcular",
    },
  },
  maxAmountDescription: {
    id: "maxAmountDescription",
    code: "IncomeModal_maxAmountDescription",
    description: "Descripción del monto máximo disponible",
    i18n: {
      en: "Maximum amount available for the credit line",
      es: "Monto máximo disponible para la línea de crédito",
    },
  },
  maxAmountQuote: {
    id: "maxAmountQuote",
    code: "IncomeModal_maxAmountQuote",
    description: "Informativo con formato sobre el monto máximo calculado",
    i18n: {
      en: (
        <>
          Maximum amount calculated for a fee of
          <strong> $1,500,000 </strong> and a term of <strong>60 </strong>
          months.
        </>
      ),
      es: (
        <>
          Monto máximo calculado para una cuota de
          <strong> $1'500.000 </strong> y plazo de <strong>60 </strong>
          meses.
        </>
      ),
    },
  },
};