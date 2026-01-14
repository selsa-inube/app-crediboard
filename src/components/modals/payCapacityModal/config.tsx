export const dataTabsEnum = {
  ordinary: {
    id: "ordinary",
    code: "PaymentTabs_ordinary",
    description: "Ordinary installments tab",
    i18n: {
      en: "Ordinary installments",
      es: "Cuotas ordinarias",
    },
  },
  extraordinary: {
    id: "extraordinary",
    code: "PaymentTabs_extraordinary",
    description: "Extraordinary installments tab",
    i18n: {
      en: "Extraordinary installments",
      es: "Cuotas extraordinarias",
    },
  },
};

export const headers = [
  { label: "Concepto", key: "concept" },
  { label: "Valor", key: "value" },
  { label: "Fecha", key: "date" },
];

export const headersEnum = {
  concept: {
    key: "concept",
    code: "PaymentHeaders_concept",
    description: "Concept column",
    i18n: {
      en: "Concept",
      es: "Concepto",
    },
  },
  value: {
    key: "value",
    code: "PaymentHeaders_value",
    description: "Value column",
    i18n: {
      en: "Value",
      es: "Valor",
    },
  },
  date: {
    key: "date",
    code: "PaymentHeaders_date",
    description: "Date column",
    i18n: {
      en: "Date",
      es: "Fecha",
    },
  },
};

export const paymentCapacityDataEnum = {
  incomeSources: {
    id: "incomeSources",
    code: "PaymentCapacity_incomeSources",
    description: "Total de fuentes de ingreso reportadas",
    i18n: {
      en: "(+) Total reported income sources",
      es: "(+) Total fuentes de ingreso reportadas",
    },
  },
  subsistenceReserve: {
    id: "subsistenceReserve",
    code: "PaymentCapacity_subsistenceReserve",
    description: "Reserva mínima de subsistencia",
    i18n: {
      en: "(-) Minimum subsistence reserve",
      es: "(-) Reserva mínima de subsistencia",
    },
  },
  newPromises: {
    id: "newPromises",
    code: "PaymentCapacity_newPromises",
    description: "Neto disponible para nuevos compromisos",
    i18n: {
      en: "(=) Net available for new commitments",
      es: "(=) Neto disponible para nuevos compromisos",
    },
  },
  lineOfCredit: {
    id: "lineOfCredit",
    code: "PaymentCapacity_lineOfCredit",
    description: "Texto base para el plazo máximo en la línea de crédito",
    i18n: {
      en: "(x) Max term in",
      es: "(x) Plazo máx. en",
    },
  },
  maxValue: {
    id: "maxValue",
    code: "PaymentCapacity_maxValue",
    description: "Cita informativa del monto máximo calculado con formato",
    i18n: {
      en: (
        <>
          Maximum amount calculated for an installment of <strong>2,000,000</strong> and a term of <strong>20</strong> months.
        </>
      ),
      es: (
        <>
          Monto máximo calculado para una cuota de <strong>2.000.000</strong> y plazo de <strong>20</strong> meses.
        </>
      ),
    },
  },
  maxValueDescription: {
    id: "maxValueDescription",
    code: "PaymentCapacity_maxValueDescription",
    description: "Descripción del monto máximo con cuotas ordinarias",
    i18n: {
      en: "Maximum amount with ordinary installments",
      es: "Monto máximo con cuotas ordinarias",
    },
  },
  maxValueAmount: {
    id: "maxValueAmount",
    code: "PaymentCapacity_maxValueAmount",
    description: "Monto máximo calculado para un plazo específico",
    i18n: {
      en: "Maximum amount calculated for a 24-month term.",
      es: "Monto máximo calculado para un plazo de 24 meses.",
    },
  },
  maxAmountOridinary: {
    id: "maxAmountOridinary",
    code: "PaymentCapacity_maxAmountOrdinary",
    description: "Monto máximo con cuotas ordinarias",
    i18n: {
      en: "Maximum amount with ordinary installments",
      es: "Monto máximo con cuotas ordinarias",
    },
  },
  maxAmountExtraordinary: {
    id: "maxAmountExtraordinary",
    code: "PaymentCapacity_maxAmountExtraordinary",
    description: "Monto máximo sumando ordinarias y extraordinarias",
    i18n: {
      en: "Maximum amount including ordinary and extraordinary installments",
      es: "Monto máximo sumando cuotas ordinarias y extraordinarias.",
    },
  },
  maxTotal: {
    id: "maxTotal",
    code: "PaymentCapacity_maxTotal",
    description: "Etiqueta para el monto máximo total",
    i18n: {
      en: "Total maximum amount",
      es: "Monto máximo total",
    },
  },
  noExtraordinaryInstallmentsAvailable: {
    id: "noExtraordinaryInstallmentsAvailable",
    code: "PaymentCapacity_noExtraordinaryInstallments",
    description: "Aviso de no disponibilidad de cuotas extraordinarias",
    i18n: {
      en: "No extraordinary installments available",
      es: "No hay cuotas extraordinarias disponibles",
    },
  },
  errorLoadingData: {
    id: "errorLoadingData",
    code: "PaymentCapacity_errorLoadingData",
    description: "Título de error al cargar datos",
    i18n: {
      en: "Error loading data",
      es: "Error al cargar datos",
    },
  },
  errorNoData: {
    id: "errorNoData",
    code: "PaymentCapacity_errorNoData",
    description: "Mensaje descriptivo de falta de información de capacidad",
    i18n: {
      en: "Could not retrieve payment capacity information. Please try again.",
      es: "No se pudo obtener la información de capacidad de pago. Por favor, intenta nuevamente.",
    },
  },
  months: {
    id: "months",
    code: "PaymentCapacity_months",
    description: "Sufijo para meses",
    i18n: {
      en: " months",
      es: " meses",
    },
  },
};

export const getMaxValueText = (
  maxAmount: number,
  maxTerm: number,
  language: "en" | "es"
) => {
  const locale = language === "es" ? "es-CO" : "en-US";
  const formattedAmount = maxAmount.toLocaleString(locale);

  return language === "es" ? (
    <>
      Monto máximo calculado para una cuota de{" "}
      <strong>{formattedAmount}</strong> y plazo de{" "}
      <strong>{maxTerm}</strong> meses.
    </>
  ) : (
    <>
      Maximum amount calculated for a fee of{" "}
      <strong>{formattedAmount}</strong> and a term of{" "}
      <strong>{maxTerm}</strong> months.
    </>
  );
};
export const detailsExtraordinaryInstallmentsEnum = {
  title: {
    id: "title",
    code: "ExtraordinaryInstallments_title",
    description: "Título del modal de detalles de cuotas extraordinarias",
    i18n: {
      en: "Details",
      es: "Detalles",
    },
  },
  close: {
    id: "close",
    code: "ExtraordinaryInstallments_close",
    description: "Etiqueta para el botón de cerrar",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  value: {
    id: "value",
    code: "ExtraordinaryInstallments_value",
    description: "Etiqueta para mostrar el valor",
    i18n: {
      en: "Value",
      es: "Valor",
    },
  },
  date: {
    id: "date",
    code: "ExtraordinaryInstallments_date",
    description: "Etiqueta para mostrar la fecha",
    i18n: {
      en: "Date",
      es: "Fecha",
    },
  },
};