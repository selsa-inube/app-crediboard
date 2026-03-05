import { MdOutlineModeEditOutline } from "react-icons/md";

export const infoIcon = {
  icon: <MdOutlineModeEditOutline />,
  onClick: () => {},
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

export const staffModalTextsEnum = {
  title: {
    code: "staffModal_title",
    description: "Title of the staff modal",
    i18n: {
      en: "Commercial Manager and Analyst",
      es: "Gestor Comercial y Analista",
    },
  },
  commercialManagerLabel: {
    code: "staffModal_commercialManagerLabel",
    description: "Label for the commercial manager field",
    i18n: {
      en: "Commercial Manager",
      es: "Gestor Comercial",
    },
  },
  commercialManagerPlaceholder: {
    code: "staffModal_commercialManagerPlaceholder",
    description:
      "Placeholder for the commercial manager select when options are available",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  commercialManagerEmptyPlaceholder: {
    code: "staffModal_commercialManagerEmptyPlaceholder",
    description:
      "Placeholder for the commercial manager select when no options are available",
    i18n: {
      en: "No managers available",
      es: "No hay gestores disponibles",
    },
  },
  analystLabel: {
    code: "staffModal_analystLabel",
    description: "Label for the analyst field",
    i18n: {
      en: "Analyst",
      es: "Analista",
    },
  },
  analystPlaceholder: {
    code: "staffModal_analystPlaceholder",
    description:
      "Placeholder for the analyst select when options are available",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  analystEmptyPlaceholder: {
    code: "staffModal_analystEmptyPlaceholder",
    description:
      "Placeholder for the analyst select when no options are available",
    i18n: {
      en: "No analysts available",
      es: "No hay analistas disponibles",
    },
  },
  justification: {
    code: "staffModal_justification",
    description: "Justification message for the assignment of a new role",
    i18n: {
      en: (roleLabel: string, previousUserName: string, newUserName: string) =>
        `A new ${roleLabel} is being assigned. Previous: ${previousUserName || "N/A"}. New: ${newUserName}`,
      es: (roleLabel: string, previousUserName: string, newUserName: string) =>
        `Se realiza la asignación de un nuevo ${roleLabel}. Anterior: ${previousUserName || "N/A"}. Nuevo: ${newUserName}`,
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

export const soporteInvalidOptionsEnum = [
  {
    id: "1",
    code: "SoporteInvalid_payroll",
    description: "Opción para firma de libranza",
    value: "Payroll_discount_authorization",
    i18n: {
      en: "Payroll discount signature",
      es: "Firma de libranza",
    },
  },
  {
    id: "2",
    code: "SoporteInvalid_promissory",
    description: "Opción para firma de pagarés",
    value: "Promissory_note",
    i18n: {
      en: "Promissory notes signature",
      es: "Firma de pagarés",
    },
  },
  {
    id: "3",
    code: "SoporteInvalid_warranties",
    description: "Opción para gestión de garantías",
    value: "Warranties",
    i18n: {
      en: "Warranties management",
      es: "Gestión de garantías",
    },
  },
];

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

export const txtConfirmRepresentativeEnum = {
  confirmTitle: {
    code: "TxtConfirmRepresentative_confirmTitle",
    description: "Title for representative confirmation modal",
    i18n: {
      en: "Confirm",
      es: "Confirmar",
    },
  },
  selectPlaceholder: {
    code: "TxtOthersOptions_selectPlaceholder",
    description: "Placeholder for select inputs",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  confirmationMessage: {
    i18n: {
      en: "You are about to register the decision",
      es: "Vas a registrar la decisión",
    },
  },
  decisionLabel: {
    i18n: {
      en: "on behalf of",
      es: "en representación de",
    },
  },
  decisionPlaceholder: {
    i18n: {
      en: "Do you want to continue?",
      es: "¿Deseas continuar?",
    },
  },
  processingDefault: {
    code: "TxtConfirmRepresentative_processingDefault",
    description: "Default text when no decision is selected",
    i18n: {
      en: "processing",
      es: "procesando",
    },
  },
  representativeLabel: {
    code: "TxtConfirmRepresentative_representativeLabel",
    description: "Label for representative selector",
    i18n: {
      en: "Representative",
      es: "Representante",
    },
  },
  representativePlaceholder: {
    code: "TxtConfirmRepresentative_representativePlaceholder",
    description: "Placeholder for representative selector",
    i18n: {
      en: "Select an option",
      es: "Seleccione una opción",
    },
  },
  taskLabel: {
    code: "TxtLabels_taskLabel",
    description: "Label for task field",
    i18n: {
      en: "Task",
      es: "Tarea",
    },
  },
};

