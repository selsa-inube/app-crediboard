export const approvalsConfigEnum = {
  title: {
    code: "Approvals_title",
    description: "Requirement evaluation title",
    i18n: {
      en: "Requirement evaluation",
      es: "Evaluación del requisito",
    },
  },
  approval: {
    code: "Approvals_approval",
    description: "Approval question",
    i18n: {
      en: "After evaluating the requirement, what is your answer?",
      es: "Después de evaluar el requisito, ¿Cuál es tu respuesta?",
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
    code: "Approvals_observationDetails",
    description: "Observation details helper",
    i18n: {
      en: "Provide details about the requirement evaluation",
      es: "Proporciona detalles acerca de la evaluación del requisito",
    },
  },
  answer: {
    code: "Approvals_answer",
    description: "Answer label",
    i18n: {
      en: "Answer",
      es: "Respuesta",
    },
  },
  answerPlaceHolder: {
    code: "Approvals_answerPlaceholder",
    description: "Answer placeholder",
    i18n: {
      en: "Select from the list",
      es: "Selecciona de la lista",
    },
  },
  cancel: {
    code: "Approvals_cancel",
    description: "Cancel button",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  confirm: {
    code: "Approvals_confirm",
    description: "Confirm button",
    i18n: {
      en: "Confirm",
      es: "Confirmar",
    },
  },
  titleError: {
    code: "Approvals_titleError",
    description: "Generic error title",
    i18n: {
      en: "We regret the inconvenience",
      es: "Lamentamos los inconvenientes",
    },
  },
};

export const optionsAnswerEnum = {
  compliant: {
    id: "compliant",
    value: "compliant",
    code: "Approvals_answer_compliant",
    description: "Compliant option",
    i18n: { en: "Compliant", es: "Cumple" },
  },
  doesNotComply: {
    id: "doesNotComply",
    value: "doesNotComply",
    code: "Approvals_answer_doesNotComply",
    description: "Does not comply option",
    i18n: { en: "Does not comply", es: "No cumple" },
  },
  approve: {
    id: "approve",
    value: "approve",
    code: "Approvals_answer_approve",
    description: "Approve option",
    i18n: { en: "Approve", es: "Aprobar" },
  },
  reject: {
    id: "reject",
    value: "reject",
    code: "Approvals_answer_reject",
    description: "Reject option",
    i18n: {
      en: "Does not comply and reject request",
      es: "No cumple y rechazar solicitud",
    },
  },
};