const validationMessages = {
  maxCharacters: (count: number) => `Debe tener máximo ${count} caracteres`,
  minCharacters: (count: number) => `Debe tener al menos ${count} caracteres`,
  maxNumbers: (count: number) => `Debe tener máximo ${count} números`,
  minNumbers: (count: number) => `Debe tener al menos ${count} números`,
  required: "Este campo no puede estar vacío",
  onlyLetters: "Este campo debe contener solo letras",
  validIdentification:
    "Este campo debe contener un número de identificación válido",
  validEmail:
    "Este campo debe tener una dirección de correo electrónico válida",
  validPhone: "Este campo debe tener un número de teléfono válido",
  validPassword: `Este campo debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número`,
  passwordMatch: "Las contraseñas no coinciden",
  limitedTxt:"El número de caracteres es demasiado largo",
  errorNodo:
    "El nodo del portal no está definido. Esto puede ocurrir cuando el nodo para representar el portal no se ha definido correctamente.",
};

export const validationMessagesEnum = {
  maxCharacters: {
    code: "Validation_maxCharacters",
    description: "Message when input exceeds maximum character limit",
    i18n: {
      en: (count: number) => `Must have at most ${count} characters`,
      es: (count: number) => `Debe tener máximo ${count} caracteres`,
    },
  },
  minCharacters: {
    code: "Validation_minCharacters",
    description: "Message when input does not meet minimum character requirement",
    i18n: {
      en: (count: number) => `Must have at least ${count} characters`,
      es: (count: number) => `Debe tener al menos ${count} caracteres`,
    },
  },
  maxNumbers: {
    code: "Validation_maxNumbers",
    description: "Message when number input exceeds maximum digits",
    i18n: {
      en: (count: number) => `Must have at most ${count} numbers`,
      es: (count: number) => `Debe tener máximo ${count} números`,
    },
  },
  minNumbers: {
    code: "Validation_minNumbers",
    description: "Message when number input does not meet minimum digits",
    i18n: {
      en: (count: number) => `Must have at least ${count} numbers`,
      es: (count: number) => `Debe tener al menos ${count} números`,
    },
  },
  required: {
    code: "Validation_required",
    description: "Message when required field is empty",
    i18n: {
      en: "This field cannot be empty",
      es: "Este campo no puede estar vacío",
    },
  },
  onlyLetters: {
    code: "Validation_onlyLetters",
    description: "Message when input contains non-letter characters",
    i18n: {
      en: "This field must contain only letters",
      es: "Este campo debe contener solo letras",
    },
  },
  validIdentification: {
    code: "Validation_validIdentification",
    description: "Message when identification number is invalid",
    i18n: {
      en: "This field must contain a valid identification number",
      es: "Este campo debe contener un número de identificación válido",
    },
  },
  validEmail: {
    code: "Validation_validEmail",
    description: "Message when email format is invalid",
    i18n: {
      en: "This field must have a valid email address",
      es: "Este campo debe tener una dirección de correo electrónico válida",
    },
  },
  validPhone: {
    code: "Validation_validPhone",
    description: "Message when phone number format is invalid",
    i18n: {
      en: "This field must have a valid phone number",
      es: "Este campo debe tener un número de teléfono válido",
    },
  },
  validPassword: {
    code: "Validation_validPassword",
    description: "Message when password does not meet complexity requirements",
    i18n: {
      en: "This field must have at least 8 characters, one uppercase letter, one lowercase letter, and one number",
      es: "Este campo debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número",
    },
  },
  passwordMatch: {
    code: "Validation_passwordMatch",
    description: "Message when passwords do not match",
    i18n: {
      en: "Passwords do not match",
      es: "Las contraseñas no coinciden",
    },
  },
  limitedTxt: {
    code: "Validation_limitedTxt",
    description: "Message when text input is too long",
    i18n: {
      en: "The number of characters is too long",
      es: "El número de caracteres es demasiado largo",
    },
  },
  errorNodo: {
    code: "Validation_errorNodo",
    description: "Message when portal node is not defined correctly",
    i18n: {
      en: "The portal node is not defined. This can happen when the node representing the portal is not defined correctly.",
      es: "El nodo del portal no está definido. Esto puede ocurrir cuando el nodo para representar el portal no se ha definido correctamente.",
    },
  },
};


export { validationMessages };
