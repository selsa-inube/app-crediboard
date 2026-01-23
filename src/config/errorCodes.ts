export const errorCodesEnum = {
  400: {
    whatWentWrong: {
      code: "ErrorCodes_400_whatWentWrong",
      description: "What went wrong for error 400",
      i18n: {
        en: [
          "The request could not be processed due to invalid data.",
          "Ensure that the submitted data is correct.",
        ],
        es: [
          "La solicitud no se pudo procesar debido a datos inválidos.",
          "Asegúrate de que los datos enviados sean correctos.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_400_howToFix",
      description: "How to fix error 400",
      i18n: {
        en: [
          "Check the data you submitted and make sure it is correct.",
          "Try again with valid data.",
        ],
        es: [
          "Revisa los datos que enviaste y asegúrate de que sean correctos.",
          "Intenta nuevamente con datos válidos.",
        ],
      },
    },
  },
  401: {
    whatWentWrong: {
      code: "ErrorCodes_401_whatWentWrong",
      description: "What went wrong for error 401",
      i18n: {
        en: [
          "You do not have permission to access this resource.",
          "Your session may have expired.",
        ],
        es: [
          "No tienes permisos para acceder a este recurso.",
          "Tu sesión puede haber expirado.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_401_howToFix",
      description: "How to fix error 401",
      i18n: {
        en: [
          "Log in with a valid account.",
          "If the problem persists, contact support.",
        ],
        es: [
          "Inicia sesión con una cuenta válida.",
          "Si el problema persiste, contacta al soporte.",
        ],
      },
    },
  },
  403: {
    whatWentWrong: {
      code: "ErrorCodes_403_whatWentWrong",
      description: "What went wrong for error 403",
      i18n: {
        en: [
          "Access to the requested page is denied.",
          "You may not have the necessary privileges.",
        ],
        es: [
          "Acceso denegado a la página solicitada.",
          "Puede que no tengas los privilegios necesarios.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_403_howToFix",
      description: "How to fix error 403",
      i18n: {
        en: [
          "Contact the administrator if you think this is an error.",
          "Check your access permissions.",
        ],
        es: [
          "Contacta al administrador si crees que esto es un error.",
          "Verifica tus permisos de acceso.",
        ],
      },
    },
  },
  404: {
    whatWentWrong: {
      code: "ErrorCodes_404_whatWentWrong",
      description: "What went wrong for error 404",
      i18n: {
        en: [
          "The requested URL was not found on the server.",
          "The page may have been removed or moved.",
        ],
        es: [
          "La URL solicitada no se encontró en el servidor.",
          "Puede que la página haya sido eliminada o movida.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_404_howToFix",
      description: "How to fix error 404",
      i18n: {
        en: [
          "Check the URL or go back to the home page.",
          "Use the navigation menu to find what you are looking for.",
        ],
        es: [
          "Verifica la URL o vuelve a la página principal.",
          "Usa el menú de navegación para encontrar lo que buscas.",
        ],
      },
    },
  },
  500: {
    whatWentWrong: {
      code: "ErrorCodes_500_whatWentWrong",
      description: "What went wrong for error 500",
      i18n: {
        en: [
          "There was a problem on the server.",
          "There may be a temporary system error.",
        ],
        es: [
          "Ocurrió un problema en el servidor.",
          "Puede que haya un error temporal en el sistema.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_500_howToFix",
      description: "How to fix error 500",
      i18n: {
        en: [
          "Try again later or contact support.",
          "Provide error details if possible.",
        ],
        es: [
          "Intenta nuevamente más tarde o contacta al soporte.",
          "Proporciona detalles del error si es posible.",
        ],
      },
    },
  },
  1000: {
    whatWentWrong: {
      code: "ErrorCodes_1000_whatWentWrong",
      description: "Portal code is empty or invalid",
      i18n: {
        en: ["The portal code is empty.", "The portal code in the URL is not valid."],
        es: ["El codigo del portal esta vacio", "El codigo del portal de la URL no es valido"],
      },
    },
    howToFix: {
      code: "ErrorCodes_1000_howToFix",
      description: "How to fix portal code issues",
      i18n: {
        en: ["Ensure you are using the correct URL."],
        es: ["Confirma que estés usando la url adecuada."],
      },
    },
  },
  1001: {
    whatWentWrong: {
      code: "ErrorCodes_1001_whatWentWrong",
      description: "User company lacks privileges",
      i18n: {
        en: [
          "The company you work for does NOT have the required privileges to access the portal.",
          "You are not registered or the credentials used do not match the registered ones.",
        ],
        es: [
          "La compañía donde trabajas NO tiene los privilegios requeridos para acceder al portal.",
          "No estás registrado(a) o las atribuciones utilizadas no corresponden con las registradas.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_1001_howToFix",
      description: "How to fix privilege issues",
      i18n: {
        en: ["Ensure you are using the correct URL."],
        es: ["Confirma que estés usando la url adecuada."],
      },
    },
  },
  1002: {
    whatWentWrong: {
      code: "ErrorCodes_1002_whatWentWrong",
      description: "Portal code has no operator",
      i18n: {
        en: ["The portal code has no operator."],
        es: ["El codigo del portal no tiene un operador."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1002_howToFix",
      description: "How to fix missing operator issue",
      i18n: {
        en: ["Ensure you are using the correct URL."],
        es: ["Confirma que estés usando la url adecuada."],
      },
    },
  },
  1003: {
    whatWentWrong: {
      code: "ErrorCodes_1003_whatWentWrong",
      description: "No business unit for portal code",
      i18n: {
        en: ["There is no business unit related to the portal code."],
        es: ["No hay una unidad de negocio relacionada con el codigo del portal."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1003_howToFix",
      description: "How to fix missing business unit",
      i18n: {
        en: ["Ensure you are using the correct URL."],
        es: ["Confirma que estés usando la url adecuada."],
      },
    },
  },
  1004: {
    whatWentWrong: {
      code: "ErrorCodes_1004_whatWentWrong",
      description: "User is not an employee",
      i18n: {
        en: ["The user accessing is not an employee."],
        es: ["El usuario con que accedio no es un empleado."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1004_howToFix",
      description: "How to fix non-employee access",
      i18n: {
        en: ["Ensure you are using the correct URL."],
        es: ["Confirma que estés usando la url adecuada."],
      },
    },
  },
  1005: {
    whatWentWrong: {
      code: "ErrorCodes_1005_whatWentWrong",
      description: "No options found for employee",
      i18n: {
        en: ["No options were found for the employee."],
        es: ["No se encontraron opciones para el empleado."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1005_howToFix",
      description: "How to fix missing employee options",
      i18n: {
        en: ["Ensure you are using the correct URL."],
        es: ["Confirma que estés usando la url adecuada."],
      },
    },
  },
  1010: {
    whatWentWrong: {
      code: "ErrorCodes_1010_whatWentWrong",
      description: "Prospect number not found",
      i18n: {
        en: ["The requested prospect number was not found."],
        es: ["No se encontró el número del prospecto solicitado."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1010_howToFix",
      description: "How to fix missing prospect number",
      i18n: {
        en: ["Ensure you are using the correct ID."],
        es: ["Confirma que estes usando el id correcto."],
      },
    },
  },
  1011: {
    whatWentWrong: {
      code: "ErrorCodes_1011_whatWentWrong",
      description: "Prospect ID does not match client",
      i18n: {
        en: [
          "Ensure the prospect ID you are using is correct and corresponds to the current client.",
        ],
        es: [
          "Confirma que el ID de prospecto que estás utilizando es correcto y corresponde al cliente actual.",
        ],
      },
    },
    howToFix: {
      code: "ErrorCodes_1011_howToFix",
      description: "How to fix incorrect prospect ID",
      i18n: {
        en: [
          "Check the system to confirm that the prospect has not been previously processed.",
        ],
        es: ["Verifica en el sistema que el prospecto no haya sido tramitado previamente."],
      },
    },
  },
  1012: {
    whatWentWrong: {
      code: "ErrorCodes_1012_whatWentWrong",
      description: "Prospect does not exist or already processed",
      i18n: {
        en: ["The requested prospect does not exist or has already been processed."],
        es: ["El prospecto solicitado no existe o ya fue tramitado."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1012_howToFix",
      description: "How to fix missing or processed prospect",
      i18n: {
        en: ["Check the prospect's status or validate the selected ID."],
        es: ["Confirma el estado del prospecto o valida el ID seleccionado."],
      },
    },
  },
  1013: {
    whatWentWrong: {
      code: "ErrorCodes_1013_whatWentWrong",
      description: "Business rules not configured",
      i18n: {
        en: ["Some business rules have not been configured."],
        es: ["No se ha realizado la configuración de algunas reglas de negocio"],
      },
    },
    howToFix: {
      code: "ErrorCodes_1013_howToFix",
      description: "How to fix missing business rules",
      i18n: {
        en: ["Check the configuration of the following business rules:"],
        es: ["Confirma la configuración de las siguientes reglas de negocio:"],
      },
    },
  },
  1014: {
    whatWentWrong: {
      code: "ErrorCodes_1014_whatWentWrong",
      description: "Disbursement modeinstead not defined",
      i18n: {
        en: ["It is necessary to define the Disbursement modeinstead for the prospect."],
        es: ["Es necesario definir el medio de desembolso para el prospecto."],
      },
    },
    howToFix: {
      code: "ErrorCodes_1014_howToFix",
      description: "How to fix missing Disbursement modeinstead",
      i18n: {
        en: ["Check the configuration of the business rule:"],
        es: ["Confirma la configuración de la regla de negocio:"],
      },
    },
  },
};
