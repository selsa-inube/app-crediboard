export const creditBehaviorLabelsEnum = {
  title: {
    code: "CreditBehavior_title",
    description: "Main title for the credit behavior card",
    i18n: {
      en: "Credit behavior",
      es: "Comportamiento crediticio",
    },
  },
  notFound: {
    title: {
      code: "CreditBehavior_notFound_title",
      description: "Title when credit data is not found",
      i18n: {
        en: "Data not found",
        es: "Datos no encontrados",
      },
    },
    description: {
      code: "CreditBehavior_notFound_description",
      description: "Message explaining that data couldn't be fetched",
      i18n: {
        en: "We couldn't get the requested data.",
        es: "No pudimos obtener los datos solicitados.",
      },
    },
    retryButton: {
      code: "CreditBehavior_notFound_retry",
      description: "Label for the retry button",
      i18n: {
        en: "Retry",
        es: "Reintentar",
      },
    },
  },
  fields: {
    riskScore: {
      code: "CreditBehavior_riskScore",
      description: "Label for the credit risk score field",
      i18n: {
        en: "Credit risk score",
        es: "Score central de riesgo",
      },
    },
    internalDelinquencies: {
      code: "CreditBehavior_internalDelinquencies",
      description: "Label for the number of internal delinquencies",
      i18n: {
        en: "Number of internal delinquencies",
        es: "Número de moras internas",
      },
    },
    maxOverdue: {
      code: "CreditBehavior_maxOverdue",
      description: "Label for the maximum number of overdue installments",
      i18n: {
        en: "Maximum number of overdue installments",
        es: "Máximo de número de cuotas en mora",
      },
    },
  },
};