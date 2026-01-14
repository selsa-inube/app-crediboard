
export const feedback = {
  fetchDataObligationPayment: {
    title: "Error al cargar obligaciones",
    description: "No se pudieron cargar las obligaciones de pago",
  },
  handleSaveChanges: {
    success: {
      title: "Cambios guardados",
      description: "Los créditos consolidados se actualizaron correctamente",
    },
    error: {
      title: "Error al guardar cambios",
      description: "No se pudieron actualizar los créditos consolidados",
    },
  },
};

export const ModalConfigEnum = {
  closeButton: {
    code: "ModalConfig_closeButton",
    description: "Label for modal close button",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  code: {
    code: "ModalConfig_code",
    description: "Label for code field",
    i18n: {
      en: "Code",
      es: "Código",
    },
  },
  terminated: {
    code: "ModalConfig_terminated",
    description: "Label for expiration date",
    i18n: {
      en: "Terminated",
      es: "Vencimiento",
    },
  },
  selectedText: {
    code: "ModalConfig_selectedText",
    description: "Label for selected obligations",
    i18n: {
      en: "Selected obligations:",
      es: "Obligaciones seleccionadas:",
    },
  },
  newObligations: {
    code: "ModalConfig_newObligations",
    description: "Label for newly found obligations",
    i18n: {
      en: "New obligations found:",
      es: "Nuevas obligaciones encontradas:",
    },
  },
  creditInvestment: {
    code: "ModalConfig_creditInvestment",
    description: "Label for credit investment type",
    i18n: {
      en: "Free investment credit",
      es: "Crédito libre inversión",
    },
  },
  close: {
    code: "ModalConfig_close",
    description: "Label for close action",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  keep: {
    code: "ModalConfig_keep",
    description: "Label for save action",
    i18n: {
      en: "Save",
      es: "Guardar",
    },
  },
  edit: {
    code: "ModalConfig_edit",
    description: "Label for edit obligations action",
    i18n: {
      en: "Edit obligations",
      es: "Editar obligaciones",
    },
  },
  collectedValue: {
    code: "ModalConfig_collectedValue",
    description: "Label for total collected value",
    i18n: {
      en: "Total collected value.",
      es: "Valor total recogido.",
    },
  },
  title: {
    code: "ModalConfig_title",
    description: "Title of the modal",
    i18n: {
      en: "Collected obligations",
      es: "Obligaciones recogidas",
    },
  },
  loading: {
    code: "ModalConfig_loading",
    description: "Label displayed while loading",
    i18n: {
      en: "Loading...",
      es: "Cargando...",
    },
  },
  noSelected: {
    code: "ModalConfig_noSelected",
    description: "Message when no obligations are selected",
    i18n: {
      en: "No obligations selected.",
      es: "No hay obligaciones seleccionadas.",
    },
  },
};

export const feedbackEnum = {
  fetchDataObligationPayment: {
    code: "Feedback_fetchDataObligationPayment",
    description: "Error when fetching payment obligations",
    i18n: {
      en: "Could not fetch payment obligations",
      es: "No se pudieron cargar las obligaciones de pago",
    },
  },
  handleSaveChanges: {
    success: {
      code: "Feedback_handleSaveChanges_success",
      description: "Message when changes saved successfully",
      i18n: {
        en: "Changes saved successfully",
        es: "Los créditos consolidados se actualizaron correctamente",
      },
    },
    error: {
      code: "Feedback_handleSaveChanges_error",
      description: "Message when saving changes fails",
      i18n: {
        en: "Error saving changes",
        es: "No se pudieron actualizar los créditos consolidados",
      },
    },
  },
};
