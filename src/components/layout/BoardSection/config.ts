export const apiKeyToColumnIdEnum = {
  commercialManagement: {
    id: "GESTION_COMERCIAL",
    code: "ApiKey_commercialManagement",
    description: "Maps API key to commercial management column",
    value: "GESTION_COMERCIAL",
    i18n: {
      en: "Commercial Management",
      es: "Gestión Comercial",
    },
  },
  verificationAndApproval: {
    id: "VERIFICACION_APROBACION",
    code: "ApiKey_verificationAndApproval",
    description: "Maps API key to verification and approval column",
    value: "VERIFICACION_APROBACION",
    i18n: {
      en: "Verification and Approval",
      es: "Verificación y Aprobación",
    },
  },
  disbursementProcessing: {
    id: "TRAMITE_DESEMBOLSO",
    code: "ApiKey_disbursementProcessing",
    description: "Maps API key to disbursement processing column",
    value: "TRAMITE_DESEMBOLSO",
    i18n: {
      en: "Disbursement Processing",
      es: "Trámite Desembolso",
    },
  },
  guaranteeFormalization: {
    id: "FORMALIZACION_GARANTIAS",
    code: "ApiKey_guaranteeFormalization",
    description: "Maps API key to guarantee formalization column",
    value: "FORMALIZACION_GARANTIAS",
    i18n: {
      en: "Guarantee Formalization",
      es: "Formalización Garantías",
    },
  },
  requirementsFulfillment: {
    id: "CUMPLIMIENTO_REQUISITOS",
    code: "ApiKey_requirementsFulfillment",
    description: "Maps API key to requirements fulfillment column",
    value: "CUMPLIMIENTO_REQUISITOS",
    i18n: {
      en: "Requirements Fulfillment",
      es: "Cumplimiento Requisitos",
    },
  },
};

export const configOptionEnum = {
  textNodata: {
    code: "ConfigOption_no_data",
    description: "There are no requests in progress for this status",
    i18n: {
      en: "There are no requests in progress for this status",
      es: "No hay solicitudes en trámite para este estado",
    },
  },
  noMatches: {
    code: "ConfigOption_no_matches",
    description: "There are no requests that match",
    i18n: {
      en: "There are no requests that match",
      es: "No hay solicitudes que coincidan con",
    },
  },
  noFilterResults: {
    code: "ConfigOption_no_filter_results",
    description: "There are no requests that meet the applied filter",
    i18n: {
      en: "There are no requests that meet the applied filter",
      es: "No hay solicitudes que cumplan con el filtro aplicado",
    },
  },
  noKeywordResults: {
    code: "ConfigOption_no_keyword_results",
    description:
      "There are no requests that meet the keyword search criteria",
    i18n: {
      en: "There are no requests that meet the keyword search criteria",
      es: "No hay solicitudes que cumplan con el criterio de búsqueda por palabra clave",
    },
  },
  noPinnedRequests: {
    code: "ConfigOption_no_pinned_requests",
    description: "There are no pinned requests in this status",
    i18n: {
      en: "There are no pinned requests in this status",
      es: "No hay solicitudes ancladas en este estado",
    },
  },
  load: {
    code: "ConfigOption_load_more",
    description: "Show more data",
    i18n: {
      en: "Show more data",
      es: "Mostrar más datos",
    },
  },
};

export const totalsKeyBySectionEnum = {
  commercialManagement: {
    code: "Totals_commercial_management",
    description: "Commercial Management",
    i18n: {
      en: "Commercial Management",
      es: "Gestión Comercial",
    },
  },
  verificationAndApproval: {
    code: "Totals_verification_approval",
    description: "Verification and Approval",
    i18n: {
      en: "Verification and Approval",
      es: "Verificación y Aprobación",
    },
  },
  disbursementProcessing: {
    code: "Totals_disbursement_processing",
    description: "Disbursement Processing",
    i18n: {
      en: "Disbursement Processing",
      es: "Trámite Desembolso",
    },
  },
  guaranteeFormalization: {
    code: "Totals_guarantee_formalization",
    description: "Guarantee Formalization",
    i18n: {
      en: "Guarantee Formalization",
      es: "Formalización Garantías",
    },
  },
  requirementsFulfillment: {
    code: "Totals_requirements_fulfillment",
    description: "Requirements Fulfillment",
    i18n: {
      en: "Requirements Fulfillment",
      es: "Cumplimiento Requisitos",
    },
  },
};

export const messagesErrorEnum = {
  changeTracesToReadById: {
    description: {
      code: "Error_change_traces",
      description: "Error while changing traces",
      i18n: {
        en: "Error while changing traces",
        es: "Error al hacer el cambio de trazas",
      },
    },
  },
};

export const infoModalEnum = {
  title: {
    code: "InfoModal_title",
    description: "No data available",
    i18n: {
      en: "No data available",
      es: "Sin datos disponibles",
    },
  },
  button: {
    code: "InfoModal_button",
    description: "Understood",
    i18n: {
      en: "Understood",
      es: "Entendido",
    },
  },
  message: {
    code: "InfoModal_message",
    description:
      "You cannot change the orientation because there are no available requests in this section.",
    i18n: {
      en: "You cannot change the orientation because there are no available requests in this section.",
      es: "No puedes cambiar la orientación porque no hay solicitudes disponibles en esta sección.",
    },
  },
};
