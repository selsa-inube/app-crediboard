export const disbursemenTabsEnum = {
  internal: {
    id: "Internal_account",
    code: "DisbursementTabs_internal",
    description: "Pestaña para cuenta interna",
    i18n: {
      en: "Internal account",
      es: "Cuenta interna",
    },
  },
  external: {
    id: "External_account",
    code: "DisbursementTabs_external",
    description: "Pestaña para cuenta externa",
    i18n: {
      en: "External account",
      es: "Cuenta externa",
    },
  },
  check: {
    id: "Certified_check",
    code: "DisbursementTabs_check",
    description: "Pestaña para cheque de la entidad",
    i18n: {
      en: "Entity check",
      es: "Cheque entidad",
    },
  },
  management: {
    id: "Business_check",
    code: "DisbursementTabs_management",
    description: "Pestaña para cheque de gerencia",
    i18n: {
      en: "Business check",
      es: "Cheque de gerencia",
    },
  },
  cash: {
    id: "Cash",
    code: "DisbursementTabs_cash",
    description: "Pestaña para dinero en efectivo",
    i18n: {
      en: "Cash",
      es: "Dinero en efectivo",
    },
  },
};

export const disbursementGeneralEnum = {
  labelTurn: {
    id: "labelTurn",
    code: "DisbursementGeneral_labelTurn",
    description: "Etiqueta para el valor a girar",
    i18n: {
      en: "Amount to be disbursed with this method",
      es: "Valor a girar con esta forma de desembolso",
    },
  },
  placeTurn: {
    id: "placeTurn",
    code: "DisbursementGeneral_placeTurn",
    description: "Placeholder para el valor a girar",
    i18n: {
      en: "Eg: 1,000,000",
      es: "Ej: 1.000.000",
    },
  },
  labelCheck: {
    id: "labelCheck",
    code: "DisbursementGeneral_labelCheck",
    description: "Etiqueta informativa sobre el saldo pendiente",
    i18n: {
      en: "The amount to be disbursed is equal to the outstanding balance.",
      es: "El valor a girar con esta forma de desembolso es igual al saldo pendiente por desembolsar.",
    },
  },
  labelToggle: {
    id: "labelToggle",
    code: "DisbursementGeneral_labelToggle",
    description: "Pregunta sobre desembolso a nombre propio",
    i18n: {
      en: "Is the Disbursement is in the name of the borrower?",
      es: "¿El desembolso es a nombre propio?",
    },
  },
  optionToggleYes: {
    id: "optionToggleYes",
    code: "DisbursementGeneral_optionToggleYes",
    description: "Opción afirmativa para el toggle",
    i18n: {
      en: "Yes",
      es: "Sí",
    },
  },
  optionToggleNo: {
    id: "optionToggleNo",
    code: "DisbursementGeneral_optionToggleNo",
    description: "Opción negativa para el toggle",
    i18n: {
      en: "No",
      es: "No",
    },
  },
};

export const disbursemenOptionAccountEnum = {
  labelAccount: {
    id: "labelAccount",
    code: "DisbursementAccount_labelAccount",
    description: "Etiqueta para cuenta de desembolso",
    i18n: {
      en: "Account to disburse the money",
      es: "Cuenta para desembolsar el dinero",
    },
  },
  labelName: {
    id: "labelName",
    code: "DisbursementAccount_labelName",
    description: "Etiqueta para nombres",
    i18n: {
      en: "First Name",
      es: "Nombre",
    },
  },
  placeName: {
    id: "placeName",
    code: "DisbursementAccount_placeName",
    description: "Placeholder para nombres",
    i18n: {
      en: "Eg: Mary Jane",
      es: "Ej: Maria Camila",
    },
  },
  labelLastName: {
    id: "labelLastName",
    code: "DisbursementAccount_labelLastName",
    description: "Etiqueta para apellidos",
    i18n: {
      en: "Last Name",
      es: "Apellidos",
    },
  },
  placeLastName: {
    id: "placeLastName",
    code: "DisbursementAccount_placeLastName",
    description: "Placeholder para apellidos",
    i18n: {
      en: "Eg: Smith Doe",
      es: "Ej: Hernández Guerrero",
    },
  },
  labelSex: {
    id: "labelSex",
    code: "DisbursementAccount_labelSex",
    description: "Etiqueta para sexo biológico",
    i18n: {
      en: "Biological sex",
      es: "Sexo biológico",
    },
  },
  labelDocumentType: {
    id: "labelDocumentType",
    code: "DisbursementAccount_labelDocumentType",
    description: "Etiqueta para tipo de documento",
    i18n: {
      en: "Document type",
      es: "Tipo de documento",
    },
  },
  labelDocumentNumber: {
    id: "labelDocumentNumber",
    code: "DisbursementAccount_labelDocumentNumber",
    description: "Etiqueta para número de documento",
    i18n: {
      en: "Document number",
      es: "Número de documento",
    },
  },
  placeDocumentNumber: {
    id: "placeDocumentNumber",
    code: "DisbursementAccount_placeDocumentNumber",
    description: "Placeholder para número de documento",
    i18n: {
      en: "Eg: 1015744898",
      es: "Ej: 1015744898",
    },
  },
  labelBirthdate: {
    id: "labelBirthdate",
    code: "DisbursementAccount_labelBirthdate",
    description: "Etiqueta para fecha de nacimiento",
    i18n: {
      en: "Date of birth",
      es: "Fecha de nacimiento",
    },
  },
  labelphone: {
    id: "labelphone",
    code: "DisbursementAccount_labelphone",
    description: "Etiqueta para teléfono de contacto",
    i18n: {
      en: "Contact phone",
      es: "Teléfono de contacto",
    },
  },
  placephone: {
    id: "placephone",
    code: "DisbursementAccount_placephone",
    description: "Placeholder para teléfono",
    i18n: {
      en: "Eg: 3103217765",
      es: "Ej: 3103217765",
    },
  },
  labelMail: {
    id: "labelMail",
    code: "DisbursementAccount_labelMail",
    description: "Etiqueta para correo electrónico",
    i18n: {
      en: "Email",
      es: "Correo electrónico",
    },
  },
  placeMail: {
    id: "placeMail",
    code: "DisbursementAccount_placeMail",
    description: "Placeholder para correo",
    i18n: {
      en: "Eg: myemail@mail.com",
      es: "Ej: micorreo@mail.com",
    },
  },
  labelCity: {
    id: "labelCity",
    code: "DisbursementAccount_labelCity",
    description: "Etiqueta para ciudad",
    i18n: {
      en: "City of residence",
      es: "Ciudad de residencia",
    },
  },
  labelBank: {
    id: "labelBank",
    code: "DisbursementAccount_labelBank",
    description: "Etiqueta para banco",
    i18n: {
      en: "Bank",
      es: "Banco",
    },
  },
  labelAccountType: {
    id: "labelAccountType",
    code: "DisbursementAccount_labelAccountType",
    description: "Etiqueta para tipo de cuenta",
    i18n: {
      en: "Account type",
      es: "Tipo de cuenta",
    },
  },
  labelAccountNumber: {
    id: "labelAccountNumber",
    code: "DisbursementAccount_labelAccountNumber",
    description: "Etiqueta para número de cuenta",
    i18n: {
      en: "Account number",
      es: "Número de cuenta",
    },
  },
  placeAccountNumber: {
    id: "placeAccountNumber",
    code: "DisbursementAccount_placeAccountNumber",
    description: "Placeholder para número de cuenta",
    i18n: {
      en: "Eg: 1040 2200 3582",
      es: "Ej: 1040 2200 3582",
    },
  },
  observation: {
    id: "observation",
    code: "DisbursementAccount_observation",
    description: "Etiqueta para observaciones",
    i18n: {
      en: "Observations",
      es: "Observaciones",
    },
  },
  placeObservation: {
    id: "placeObservation",
    code: "DisbursementAccount_placeObservation",
    description: "Placeholder para observaciones",
    i18n: {
      en: "Extra things to be taken into account.",
      es: "Cosas extra que deben tenerse en cuenta.",
    },
  },
  placeOption: {
    id: "placeOption",
    code: "DisbursementAccount_placeOption",
    description: "Texto para seleccionar una opción",
    i18n: {
      en: "Select an option",
      es: "Selecciona una opción",
    },
  },
  valueTurnFail: {
    id: "valueTurnFail",
    code: "DisbursementAccount_valueTurnFail",
    description: "Error cuando el valor a girar es incorrecto",
    i18n: {
      en: "The total amount with this Disbursement modeinstead is different from ",
      es: "El valor a girar sumando esta forma de desembolso es distinto a ",
    },
  },
  errorFlagInternal: {
    id: "errorFlagInternal",
    code: "DisbursementAccount_errorFlagInternal",
    description: "Error obteniendo cuentas internas",
    i18n: {
      en: "Error retrieving internal accounts",
      es: "Error al obtener cuentas internas",
    },
  },
  errorBanks: {
    id: "errorBanks",
    code: "DisbursementAccount_errorBanks",
    description: "Error obteniendo bancos",
    i18n: {
      en: "Error retrieving banks",
      es: "Error al obtener bancos",
    },
  },
} as const;

export const modalTitlesEnum = {
  title: {
    id: "title",
    code: "ModalTitles_title",
    description: "Título del modal de edición",
    i18n: {
      en: "Edit disbursement",
      es: "Editar desembolso",
    },
  },
  close: {
    id: "close",
    code: "ModalTitles_close",
    description: "Botón para cancelar o cerrar",
    i18n: {
      en: "Cancel",
      es: "Cancelar",
    },
  },
  save: {
    id: "save",
    code: "ModalTitles_save",
    description: "Botón para guardar cambios",
    i18n: {
      en: "Save",
      es: "Guardar",
    },
  },
}