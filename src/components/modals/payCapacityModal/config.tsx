export const dataTabs = [
  { id: "ordinary", label: "Cuotas ordinarias" },
  { id: "extraordinary", label: "Cuotas extraordinarias" },
];

export const headers = [
  { label: "Concepto", key: "concept" },
  { label: "Valor", key: "value" },
  { label: "Fecha", key: "date" },
];

export const paymentCapacityData = {
  incomeSources: "(+) Total fuentes de ingreso reportadas",
  subsistenceReserve: "(-) Reserva mínima de subsistencia",
  newPromises: "(=) Neto disponible para nuevos compromisos",
  lineOfCredit: "(*) Plazo máx. en *Nombre línea de crédito*",
  maxValue: (
    <>
      Monto máximo calculado para una cuota de <strong>2.000.000</strong> y
      plazo de <strong>20</strong> meses.
    </>
  ),
  maxValueDescription: "Monto máximo con cuotas ordinarias",
  maxValueAmount: "Monto máximo calculado para un plazo de 24 meses.",
  maxAmountOridinary: "Monto máximo con cuotas ordinarias",
  maxAmountExtraordinary:
    "Monto máximo sumando cuotas ordinarias y extraordinarias.",
  maxTotal: "Monto máximo total",
};

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
    code: "PaymentCapacity_incomeSources",
    description: "Total reported income sources",
    i18n: {
      en: "(+) Total reported income sources",
      es: "(+) Total fuentes de ingreso reportadas",
    },
  },
  subsistenceReserve: {
    code: "PaymentCapacity_subsistenceReserve",
    description: "Minimum subsistence reserve",
    i18n: {
      en: "(-) Minimum subsistence reserve",
      es: "(-) Reserva mínima de subsistencia",
    },
  },
  newPromises: {
    code: "PaymentCapacity_newPromises",
    description: "Net available for new commitments",
    i18n: {
      en: "(=) Net available for new commitments",
      es: "(=) Neto disponible para nuevos compromisos",
    },
  },
  lineOfCredit: {
    code: "PaymentCapacity_lineOfCredit",
    description: "Maximum term for credit line",
    i18n: {
      en: "(*) Max term in *Credit line name*",
      es: "(*) Plazo máx. en *Nombre línea de crédito*",
    },
  },
  maxValue: {
    code: "PaymentCapacity_maxValue",
    description: "Calculated maximum amount with formatted content",
    i18n: {
      en: (
        <>
          Maximum amount calculated for an installment of{" "}
          <strong>2,000,000</strong> and a term of <strong>20</strong> months.
        </>
      ),
      es: (
        <>
          Monto máximo calculado para una cuota de{" "}
          <strong>2.000.000</strong> y plazo de <strong>20</strong> meses.
        </>
      ),
    },
  },
  maxValueDescription: {
    code: "PaymentCapacity_maxValueDescription",
    description: "Maximum amount with ordinary installments",
    i18n: {
      en: "Maximum amount with ordinary installments",
      es: "Monto máximo con cuotas ordinarias",
    },
  },
  maxValueAmount: {
    code: "PaymentCapacity_maxValueAmount",
    description: "Maximum amount for 24 months term",
    i18n: {
      en: "Maximum amount calculated for a 24-month term.",
      es: "Monto máximo calculado para un plazo de 24 meses.",
    },
  },
  maxAmountOridinary: {
    code: "PaymentCapacity_maxAmountOridinary",
    description: "Maximum amount with ordinary installments",
    i18n: {
      en: "Maximum amount with ordinary installments",
      es: "Monto máximo con cuotas ordinarias",
    },
  },
  maxAmountExtraordinary: {
    code: "PaymentCapacity_maxAmountExtraordinary",
    description: "Maximum amount with ordinary and extraordinary installments",
    i18n: {
      en: "Maximum amount including ordinary and extraordinary installments",
      es: "Monto máximo sumando cuotas ordinarias y extraordinarias.",
    },
  },
  maxTotal: {
    code: "PaymentCapacity_maxTotal",
    description: "Total maximum amount",
    i18n: {
      en: "Total maximum amount",
      es: "Monto máximo total",
    },
  },
};

