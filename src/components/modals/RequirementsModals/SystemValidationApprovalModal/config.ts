export const approvalsConfigEnum = {
  title: {
    code: "Approvals_title",
    description: "Requirement evaluation title",
    i18n: {
      en: "Requirement evaluation",
      es: "Evaluación del requisito",
    },
  },
  approveRequirementLabel: {
    code: "Approvals_approveRequirementLabel",
    description: "Approve requirement option",
    i18n: {
      en: "Yes, approve requirement.",
      es: "Sí, aprobar requisito.",
    },
  },
  rejectRequirementLabel: {
    code: "Approvals_rejectRequirementLabel",
    description: "Reject requirement option",
    i18n: {
      en: "Sí, approve requirement.",
      es: "Sí, aprobar requisito.",
    },
  },
  approval: {
    code: "Approvals_approval",
    description: "Approval question",
    i18n: {
      en: "Do you want to approve the requirement even if it is not met?",
      es: "¿Quieres aprobar el requisito aunque no se cumpla?",
    },
  },
  observations: {
    code: "Approvals_observations",
    description: "Observations label",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },
  observationdetails: {
    code: "Approvals_observationdetails",
    description: "Observation details description",
    i18n: {
      en: "Provide details about the requirement evaluation",
      es: "Proporciona detalles acerca de la evaluación del requisito",
    },
  },
  cancel: {
    code: "Approvals_cancel",
    description: "Cancel action",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  confirm: {
    code: "Approvals_confirm",
    description: "Confirm action",
    i18n: {
      en: "Approve",
      es: "Aprobar",
    },
  },
  titleError: {
    code: "Approvals_titleError",
    description: "Service error title",
    i18n: {
      en: "The service failed to process the request",
      es: "El servicio ha fallado al procesar la solicitud",
    },
  },
  maxLength: {
    code: "Approvals_maxLength",
    description: "Maximum length",
    i18n: {
      en: "Maximum length",
      es: "Longitud máxima",
    },
  },
  minLength: {
    code: "Approvals_minLength",
    description: "Minimum length",
    i18n: {
      en: "A minimum of 3 characters is required.",
      es: "Se requieren 3 caracteres como mínimo.",
    },
  },
};

export const MinCharactersObservation = 3;
