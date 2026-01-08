export const requirementJustificationMap: Record<string, string> = {
  "El asociado tiene más de 20 años de edad.":
    "Se valida la edad mínima para el requisito",
  "Antiguedad minima": "Se valida la antigüedad mínima para el requisito",
};

export const validationMessages = {
  requiredField: "Este campo es obligatorio",
};

export const requirementJustificationEnum = {
  ageRequirement: {
    code: "Requirement_ageRequirement",
    description: "Minimum age requirement validation",
    i18n: {
      en: "Minimum age requirement is validated",
      es: "Se valida la edad mínima para el requisito",
    },
  },
  seniorityRequirement: {
    code: "Requirement_seniorityRequirement",
    description: "Minimum seniority requirement validation",
    i18n: {
      en: "Minimum seniority requirement is validated",
      es: "Se valida la antigüedad mínima para el requisito",
    },
  },
};

export const validationMessagesEnum = {
  requiredField: {
    code: "Validation_requiredField",
    description: "Required field validation message",
    i18n: {
      en: "This field is required",
      es: "Este campo es obligatorio",
    },
  },
};
