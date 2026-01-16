export const frcConfigEnum = {
  title: {
    code: "FRC_title",
    description: "FRC main title",
    i18n: {
      en: "Maximum indebtedness by FRC",
      es: "Endeudamiento máximo x FRC",
    },
  },
  totalScoreMax: {
    id: "totalScoreMax",
    code: "FRC_totalScoreMax",
    description: "Sufijo para el puntaje total máximo",
    i18n: {
      en: "/1000",
      es: "/1000",
    },
  },
  seniorityMax: {
    id: "seniorityMax",
    code: "FRC_seniorityMax",
    description: "Sufijo para el puntaje máximo de antigüedad",
    i18n: {
      en: "/200",
      es: "/200",
    },
  },
  centralRiskMax: {
    id: "centralRiskMax",
    code: "FRC_centralRiskMax",
    description: "Sufijo para el puntaje máximo de central de riesgo",
    i18n: {
      en: "/200",
      es: "/200",
    },
  },
  employmentStabilityMax: {
    id: "employmentStabilityMax",
    code: "FRC_employmentStabilityMax",
    description: "Sufijo para el puntaje máximo de estabilidad laboral",
    i18n: {
      en: "/300",
      es: "/300",
    },
  },
  maritalStatusMax: {
    id: "maritalStatusMax",
    code: "FRC_maritalStatusMax",
    description: "Sufijo para el puntaje máximo de estado civil",
    i18n: {
      en: "/50",
      es: "/50",
    },
  },
  economicActivityMax: {
    id: "economicActivityMax",
    code: "FRC_economicActivityMax",
    description: "Sufijo para el puntaje máximo de actividad económica",
    i18n: {
      en: "/200",
      es: "/200",
    },
  },
  subTitle: {
    code: "FRC_subTitle",
    description: "Risk score subtitle",
    i18n: {
      en: "Risk score",
      es: "Score de riesgo",
    },
  },
  totalScoreLabel: {
    code: "FRC_totalScoreLabel",
    description: "Total score label",
    i18n: {
      en: "Total score",
      es: "Puntaje total",
    },
  },
  seniorityLabel: {
    code: "FRC_seniorityLabel",
    description: "Seniority label",
    i18n: {
      en: "Seniority",
      es: "Antigüedad",
    },
  },
  centralRiskLabel: {
    code: "FRC_centralRiskLabel",
    description: "Credit bureau label",
    i18n: {
      en: "Credit bureau",
      es: "Central de riesgo",
    },
  },
  employmentStabilityLabel: {
    code: "FRC_employmentStabilityLabel",
    description: "Employment stability label",
    i18n: {
      en: "Employment stability index",
      es: "Índice de estabilidad laboral",
    },
  },
  maritalStatusLabel: {
    code: "FRC_maritalStatusLabel",
    description: "Marital status label",
    i18n: {
      en: "Marital status - Married",
      es: "Estado civil - Casado",
    },
  },
  economicActivityLabel: {
    code: "FRC_economicActivityLabel",
    description: "Economic activity label",
    i18n: {
      en: "Economic activity - Retired",
      es: "Actividad economica - Pensionado",
    },
  },
  incomesLabel: {
    code: "FRC_incomesLabel",
    description: "Monthly income label",
    i18n: {
      en: "(+) Monthly income",
      es: "(+) Ingresos mensuales",
    },
  },
  timesIncome: {
    code: "FRC_timesIncome",
    description: "Income multiplier label",
    i18n: {
      en: "(x) Number of times the income for this score",
      es: "(x) No. de veces el ingreso para este score",
    },
  },
  maxIndebtedness: {
    code: "FRC_maxIndebtedness",
    description: "Maximum indebtedness label",
    i18n: {
      en: "Maximum indebtedness",
      es: "Endeudamiento máximo",
    },
  },
  closeBtn: {
    code: "FRC_closeBtn",
    description: "Close button",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  loading: {
    code: "FRC_loading",
    description: "Loading text",
    i18n: {
      en: "Loading...",
      es: "Cargando...",
    },
  },
  intercept: {
    code: "FRC_intercept",
    description: "Intercept label",
    i18n: {
      en: "Intercept",
      es: "Intercepto",
    },
  },
  maxLimit: {
    code: "FRC_maxLimit",
    description: "Maximum limit label",
    i18n: {
      en: "(=) Maximum limit",
      es: "(=) Tope máximo",
    },
  },
  totalPortafolio: {
    code: "FRC_totalPortafolio",
    description: "Total active portfolio label",
    i18n: {
      en: "(-) Total active portfolio",
      es: "(-) Cartera total vigente",
    },
  },

  infoTextsIntercept: {
    code: "FRC_infoTexts_intercept",
    description: "Intercept explanation",
    i18n: {
      en: "The intercept is the initial base value of the credit risk analysis. It represents the starting point of the score before applying other variables.",
      es: "El intercepto es el valor base inicial del análisis de riesgo crediticio. Representa el punto de partida del score antes de aplicar otras variables.",
    },
  },
  infoTextsSeniority: {
    code: "FRC_infoTexts_seniority",
    description: "Seniority explanation",
    i18n: {
      en: "Seniority evaluates the length of the client's relationship with the institution. Greater seniority generally indicates higher stability and trust.",
      es: "La antigüedad evalúa el tiempo de relación del cliente con la entidad. Mayor antigüedad generalmente indica mayor estabilidad y confianza.",
    },
  },
  infoTextsCentralRisk: {
    code: "FRC_infoTexts_centralRisk",
    description: "Central risk explanation",
    i18n: {
      en: "The credit bureau checks the client's credit history within the financial system. Good behavior improves the score.",
      es: "La central de riesgo verifica el historial crediticio del cliente en el sistema financiero. Un buen comportamiento mejora el puntaje.",
    },
  },
  infoTextsEmploymentStability: {
    code: "FRC_infoTexts_employmentStability",
    description: "Employment stability explanation",
    i18n: {
      en: "This index measures the client's job stability, considering time in the current job and type of employment relationship.",
      es: "Este índice mide la estabilidad laboral del cliente. Considera tiempo en el empleo actual y tipo de vinculación laboral.",
    },
  },
  infoTextsMaritalStatus: {
    code: "FRC_infoTexts_maritalStatus",
    description: "Marital status explanation",
    i18n: {
      en: "Marital status can influence payment capacity. Some marital statuses are considered financially more stable.",
      es: "El estado civil puede influir en la capacidad de pago. Algunos estados civiles se consideran de mayor estabilidad financiera.",
    },
  },
  infoTextsEconomicActivity: {
    code: "FRC_infoTexts_economicActivity",
    description: "Economic activity explanation",
    i18n: {
      en: "Economic activity classifies the income source. Different activities have different associated risk levels.",
      es: "La actividad económica clasifica la fuente de ingresos. Diferentes actividades tienen distintos niveles de riesgo asociados.",
    },
  },

  infoModalTitle: {
    code: "FRC_infoModal_title",
    description: "Info modal title",
    i18n: {
      en: "Information",
      es: "Información",
    },
  },
  infoModalButton: {
    code: "FRC_infoModal_button",
    description: "Info modal button",
    i18n: {
      en: "Understood",
      es: "Entendido",
    },
  },

  errorTitle: {
    code: "FRC_error_title",
    description: "Error title",
    i18n: {
      en: "Error loading data",
      es: "Error cargando datos",
    },
  },
  errorMessage: {
    code: "FRC_error_message",
    description: "Error message",
    i18n: {
      en: "Data could not be loaded. Please try again later.",
      es: "No se pudieron cargar los datos. Intenta nuevamente más tarde.",
    },
  },
};
