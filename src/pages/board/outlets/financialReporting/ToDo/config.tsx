import { MdOutlineModeEditOutline } from "react-icons/md";

export const infoIcon = {
  icon: <MdOutlineModeEditOutline />,
  onClick: () => console.log("info"),
};

export const staffConfig = {
  title: "Gestor Comercial y Analista",
  confirm: "Aceptar",
  meets: "Cumple el requisito",
  doesNotComply: "No cumple el requisito",
  observations: "Observaciones",
  observationdetails:
    "Proporcione detalles acerca de la evaluación del requisito",
  closeBtn: "Cerrar",
  Cancel: "Cancelar",

  maxLength: 120,
};

export const errorMessagge =
  "Ups, algo salió mal. No se puede cargar la información. Intente nuevamente más tarde.";

export interface FlagMessage {
  title: string;
  description: string;
  appearance: "success" | "danger";
}

export const flagMessages: Record<string, FlagMessage> = {
  changeSuccess: {
    title: "Cambio realizado",
    description: "El cambio se realizó con éxito.",
    appearance: "success",
  },
};

export const buttonText = "Enviar";

export const txtLabels = {
  title: "Confirmar la decisión",
  buttonText: "Enviar",
  secondaryButtonText: "Cancelar",
  inputLabel: "Justificación",
  inputPlaceholder: "Describe el motivo de su decisión.",
};

export const txtFlags = {
  titleSuccess: "¡Proceso exitoso!",
  descriptionSuccess: `La tarea se ha ejecutado de manera correcta. Nueva tarea asignada.`,

  titleWarning: "Error al registrar la decisión",
  descriptionWarning: `Hubo un problema con el proceso. Código: `,

  titleDanger: "Error inesperado",
  descriptionDanger:
    "Ocurrió un error al registrar la tarea. Intente nuevamente más tarde.",

  duration: 5000,
};

export const txtOthersOptions = {
  optionClose: "Cerrar",
  txtDecision: "Decisión",
  txtNoSelect: "No se seleccionó una decisión disponible.",
};
export const soporteInvalidOptions = [
  {
    id: "1",
    label: "Firma de pagares",
    value: "Payroll_discount_authorization",
  },
  { id: "2", label: "Firma de libranza", value: "Promissory_note" },
  { id: "3", label: "Gestión de garantías.", value: "Warranties" },
];

export const txtTaskQuery = {
  txtCommercialManager: "Gestor Comercial",
  txtAnalyst: "Analista",
};

export const titlesModal = {
  title: "Información",
  subTitle: "¿Porque está deshabilitado?",
  description:
    "No cuentas con los privilegios necesarios para ejecutar esta acción.",
  textButtonNext: "Entendido",
};

export const errorMessages = {
  patchChangeUsersByCreditRequest: {
    description: "",
  },
};

export const staffConfigEnum = {
  title: {
    code: "StaffConfig_title",
    description: "Title for staff roles",
    i18n: {
      en: "Commercial Manager and Analyst",
      es: "Gestor Comercial y Analista",
    },
  },
  confirm: {
    code: "StaffConfig_confirm",
    description: "Label for confirm button",
    i18n: {
      en: "Accept",
      es: "Aceptar",
    },
  },
  meets: {
    code: "StaffConfig_meets",
    description: "Label when requirement is met",
    i18n: {
      en: "Meets the requirement",
      es: "Cumple el requisito",
    },
  },
  doesNotComply: {
    code: "StaffConfig_doesNotComply",
    description: "Label when requirement is not met",
    i18n: {
      en: "Does not meet the requirement",
      es: "No cumple el requisito",
    },
  },
  observations: {
    code: "StaffConfig_observations",
    description: "Label for observations field",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },
  observationdetails: {
    code: "StaffConfig_observationdetails",
    description: "Details about requirement evaluation",
    i18n: {
      en: "Provide details about the requirement evaluation",
      es: "Proporcione detalles acerca de la evaluación del requisito",
    },
  },
  closeBtn: {
    code: "StaffConfig_closeBtn",
    description: "Label for close button",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  cancel: {
    code: "StaffConfig_cancel",
    description: "Label for cancel button",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  maxLength: {
    code: "StaffConfig_maxLength",
    description: "Maximum character length allowed",
    i18n: {
      en: "120",
      es: "120",
    },
  },
};

export const errorMessaggeEnum = {
  default: {
    code: "ErrorMessage_default",
    description: "Default error message",
    i18n: {
      en: "Oops, something went wrong. Unable to load information. Please try again later.",
      es: "Ups, algo salió mal. No se puede cargar la información. Intente nuevamente más tarde.",
    },
  },
};

export const flagMessagesEnum = {
  changeSuccess: {
    code: "FlagMessages_changeSuccess",
    description: "Message for successful change",
    i18n: {
      en: {
        title: "Change completed",
        description: "The change was successfully made.",
        appearance: "success",
      },
      es: {
        title: "Cambio realizado",
        description: "El cambio se realizó con éxito.",
        appearance: "success",
      },
    },
  },
};

export const buttonTextEnum = {
  send: {
    code: "ButtonText_send",
    description: "Text for send button",
    i18n: {
      en: "Send",
      es: "Enviar",
    },
  },
};

export const txtLabelsEnum = {
  title: {
    code: "TxtLabels_title",
    description: "Title for decision confirmation modal",
    i18n: {
      en: "Confirm Decision",
      es: "Confirmar la decisión",
    },
  },
  buttonText: {
    code: "TxtLabels_buttonText",
    description: "Label for send button",
    i18n: {
      en: "Send",
      es: "Enviar",
    },
  },
  secondaryButtonText: {
    code: "TxtLabels_secondaryButtonText",
    description: "Label for cancel button",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  inputLabel: {
    code: "TxtLabels_inputLabel",
    description: "Label for input justification",
    i18n: {
      en: "Justification",
      es: "Justificación",
    },
  },
  inputPlaceholder: {
    code: "TxtLabels_inputPlaceholder",
    description: "Placeholder for input justification",
    i18n: {
      en: "Describe your decision reason.",
      es: "Describe el motivo de su decisión.",
    },
  },
};

export const txtFlagsEnum = {
  titleSuccess: {
    code: "TxtFlags_titleSuccess",
    description: "Success message title",
    i18n: {
      en: "Process successful!",
      es: "¡Proceso exitoso!",
    },
  },
  descriptionSuccess: {
    code: "TxtFlags_descriptionSuccess",
    description: "Success message description",
    i18n: {
      en: "The task was executed correctly. New task assigned.",
      es: "La tarea se ha ejecutado de manera correcta. Nueva tarea asignada.",
    },
  },
  titleWarning: {
    code: "TxtFlags_titleWarning",
    description: "Warning message title",
    i18n: {
      en: "Error registering decision",
      es: "Error al registrar la decisión",
    },
  },
  descriptionWarning: {
    code: "TxtFlags_descriptionWarning",
    description: "Warning message description",
    i18n: {
      en: "There was a problem with the process. Code: ",
      es: "Hubo un problema con el proceso. Código: ",
    },
  },
  titleDanger: {
    code: "TxtFlags_titleDanger",
    description: "Danger message title",
    i18n: {
      en: "Unexpected error",
      es: "Error inesperado",
    },
  },
  descriptionDanger: {
    code: "TxtFlags_descriptionDanger",
    description: "Danger message description",
    i18n: {
      en: "An error occurred while registering the task. Please try again later.",
      es: "Ocurrió un error al registrar la tarea. Intente nuevamente más tarde.",
    },
  },
  duration: {
    code: "TxtFlags_duration",
    description: "Duration of the flag message",
    i18n: {
      en: 5000,
      es: 5000,
    },
  },
};

export const txtOthersOptionsEnum = {
  optionClose: {
    code: "TxtOthersOptions_optionClose",
    description: "Label for close option",
    i18n: {
      en: "Close",
      es: "Cerrar",
    },
  },
  txtDecision: {
    code: "TxtOthersOptions_txtDecision",
    description: "Label for decision text",
    i18n: {
      en: "Decision",
      es: "Decisión",
    },
  },
  txtNoSelect: {
    code: "TxtOthersOptions_txtNoSelect",
    description: "Message when no decision is selected",
    i18n: {
      en: "No available decision was selected.",
      es: "No se seleccionó una decisión disponible.",
    },
  },
};

export const soporteInvalidOptionsEnum = {
  payrollDiscount: {
    code: "SoporteInvalidOptions_payrollDiscount",
    description: "Option for payroll discount authorization",
    i18n: {
      en: "Promissory note signature",
      es: "Firma de pagares",
    },
    value: "Payroll_discount_authorization",
  },
  promissoryNote: {
    code: "SoporteInvalidOptions_promissoryNote",
    description: "Option for promissory note signature",
    i18n: {
      en: "Payroll signature",
      es: "Firma de libranza",
    },
    value: "Promissory_note",
  },
  warranties: {
    code: "SoporteInvalidOptions_warranties",
    description: "Option for managing warranties",
    i18n: {
      en: "Warranties management",
      es: "Gestión de garantías.",
    },
    value: "Warranties",
  },
};

export const txtTaskQueryEnum = {
  txtCommercialManager: {
    code: "TxtTaskQuery_txtCommercialManager",
    description: "Label for commercial manager",
    i18n: {
      en: "Commercial Manager",
      es: "Gestor Comercial",
    },
  },
  txtAnalyst: {
    code: "TxtTaskQuery_txtAnalyst",
    description: "Label for analyst",
    i18n: {
      en: "Analyst",
      es: "Analista",
    },
  },
};

export const titlesModalEnum = {
  title: {
    code: "TitlesModal_title",
    description: "Title for information modal",
    i18n: {
      en: "Information",
      es: "Información",
    },
  },
  subTitle: {
    code: "TitlesModal_subTitle",
    description: "Subtitle explaining why action is disabled",
    i18n: {
      en: "Why is it disabled?",
      es: "¿Porque está deshabilitado?",
    },
  },
  description: {
    code: "TitlesModal_description",
    description: "Description explaining missing privileges",
    i18n: {
      en: "You do not have the necessary privileges to execute this action.",
      es: "No cuentas con los privilegios necesarios para ejecutar esta acción.",
    },
  },
  textButtonNext: {
    code: "TitlesModal_textButtonNext",
    description: "Label for next/acknowledge button",
    i18n: {
      en: "Understood",
      es: "Entendido",
    },
  },
};

export const errorMessagesEnum = {
  patchChangeUsersByCreditRequest: {
    code: "ErrorMessages_patchChangeUsersByCreditRequest",
    description: "Error description placeholder",
    i18n: {
      en: "",
      es: "",
    },
  },
};

