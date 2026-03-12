export const boardOrientationEnum = {
  vertical: {
    code: "Board_orientation_vertical",
    description: "Vertical orientation for the board layout",
    i18n: {
      en: "vertical",
      es: "vertical",
    },
  },
  horizontal: {
    code: "Board_orientation_horizontal",
    description: "Horizontal orientation for the board layout",
    i18n: {
      en: "horizontal",
      es: "horizontal",
    },
  },
};

export const completedFilterEnum = {
  code: "Filter_completed_less_than_30_days",
  description: "Filter key for requests completed less than 30 days ago",
  i18n: {
    en: "completedLessThan30DaysAgo",
    es: "completedLessThan30DaysAgo",
  },
  queryValue: {
    code: "Filter_completed_less_than_30_days_query",
    description: "Full query string for completed less than 30 days filter",
    i18n: {
      en: "completedLessThan30DaysAgo=Y",
      es: "completedLessThan30DaysAgo=Y",
    },
  },
};

export const dataCreditProspects = {
  simulate: {
    code: "Simulate",
    description: "Simulation action",
    i18n: {
      en: "Simulate credit",
      es: "Simular crédito",
    },
  },
};

export const retryButtonLabel = {
  code: "Retry_button_label",
  description: "Label for the retry button on error page",
  i18n: {
    en: "Retry",
    es: "Reintentar",
  },
};

export const scrollBehaviorEnum = {
  smooth: {
    code: "Scroll_behavior_smooth",
    description: "Smooth scroll behavior",
    i18n: {
      en: "smooth",
      es: "smooth",
    },
  },
};

export const scrollBlockEnum = {
  start: {
    code: "Scroll_block_start",
    description: "Scroll block alignment: start",
    i18n: {
      en: "start",
      es: "start",
    },
  },
};

export const scrollInlineEnum = {
  nearest: {
    code: "Scroll_inline_nearest",
    description: "Scroll inline alignment: nearest",
    i18n: {
      en: "nearest",
      es: "nearest",
    },
  },
};

export const filterTypeEnum = {
  assignment: {
    code: "Filter_type_assignment",
    description: "Filter type identifier for assignment filters",
    i18n: {
      en: "assignment",
      es: "assignment",
    },
  },
};
export const keywordLabel = {
  code: "Keyword_label",
  description: "Label for keyword search or input field",
  i18n: {
    en: "Keyword",
    es: "Palabra clave",
  },
};
export const scrollTargetIdEnum = {
  tramitada: {
    code: "TRAMITADA",
    description: "DOM element ID used to scroll to the TRAMITADA section",
    i18n: {
      en: "TRAMITADA",
      es: "TRAMITADA",
    },
  },
};
export const dataInformationModalEnum = {
  title: {
    code: "Information_modal_title",
    description:
      "Title for the information modal when pin action is restricted",
    i18n: {
      en: "Information",
      es: "Información",
    },
  },
  button: {
    code: "Information_modal_button",
    description: "Button label for the information modal",
    i18n: {
      en: "Accept",
      es: "Aceptar",
    },
  },
  description: {
    code: "Information_modal_description",
    description:
      "Description text shown in the information modal for unauthorized pin removal",
    i18n: {
      en: "You are not authorized to remove anchors placed by other users.",
      es: "No estás autorizado para eliminar anclajes colocados por otros usuarios.",
    },
  },
};

export const simulateRedirectModal = {
  title: {
    code: "SimulateRedirectModal_title",
    description: "Modal title for simulation redirection",
    i18n: {
      en: "Start new simulation",
      es: "Iniciar nueva simulación",
    },
  },
  message: {
    code: "SimulateRedirectModal_message",
    description:
      "Confirmation message before redirecting to simulation assistant",
    i18n: {
      en: "This action will redirect you to the simulation assistant. Do you want to continue?",
      es: "Esta acción te redirigirá al asistido de simulación dentro del portal CRM. ¿Deseas continuar?",
    },
  },
  confirmButton: {
    code: "SimulateRedirectModal_confirmButton",
    description: "Confirm button label to proceed to simulation assistant",
    i18n: {
      en: "Confirm",
      es: "Confirmar",
    },
  },
  cancelButton: {
    code: "SimulateRedirectModal_cancelButton",
    description: "Cancel button label to stay on the board",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
};

export const staffPortalCatalogCode = "Crm";

export const currentEnvironment = {
  dev: "dev",
  online: "online",
  cloud: "cloud",
};

export const UrlRedirect = (staffPortalId: string, environmentApp: string) => {
  return `https://app-crm-portal.inube.${environmentApp}/?portal=${staffPortalId}&redirectToSimulate=true`;
};
