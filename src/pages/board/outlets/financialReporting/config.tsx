import { MdAddCircleOutline } from "react-icons/md";

import { IOptionButtons } from "@components/modals/ListModal";
import { addItem } from "@mocks/utils/dataMock.service";

type Observer<T> = (data: T) => void;

function observer<T>() {
  const observers: Observer<T>[] = [];

  return {
    subscribe: (observer: Observer<T>) => {
      observers.push(observer);
    },
    unsubscribe: (observer: Observer<T>) => {
      observers.filter((obs) => obs !== observer);
    },
    notify: (data: T) => {
      observers.forEach((observer) => observer(data));
    },
  };
}

export const traceObserver = observer();

export const errorObserver = observer<{
  id: string;
  message: string;
}>();

export const handleConfirmReject = async (
  id: string,
  user: string,
  formData: { textarea: string }
) => {
  const justificationText = formData.textarea;

  if (justificationText && id) {
    const trace = {
      trace_value: "Document uploaded",
      credit_request_id: id,
      use_case: "document_upload",
      user_id: user,
      execution_date: new Date().toISOString(),
      justification: justificationText,
      decision_taken_by_user: "rejected",
      trace_type: "executed_task",
      read_novelty: "",
    };

    try {
      await addItem("trace", trace);
      traceObserver.notify(trace);
    } catch (error) {
      console.error(`No se ha podido realizar el rechazo: ${error}`);
    }
  }
};

export const handleConfirmCancel = async (
  id: string,
  user: string,
  formData: { textarea: string }
) => {
  const justificationText = formData.textarea;

  if (justificationText && id) {
    const trace = {
      trace_value: "Document cancelled",
      credit_request_id: id,
      use_case: "document_cancel",
      user_id: user,
      execution_date: new Date().toISOString(),
      justification: justificationText,
      decision_taken_by_user: "cancelled",
      trace_type: "executed_task",
      read_novelty: "",
    };

    try {
      await addItem("trace", trace);
      traceObserver.notify(trace);
    } catch (error) {
      console.error(`No se ha podido realizar la anulación: ${error}`);
    }
  }
};

export const optionButtons: IOptionButtons = {
  label: "Adjuntar archivo",
  variant: "none",
  icon: <MdAddCircleOutline />,
  fullwidth: false,
  onClick: () => {},
};

type ConfigHandleactions = {
  buttonReject: () => void;
  buttonCancel: () => void;
  buttonPrint: () => void;
  buttonAttach: () => void;
  buttonViewAttachments: () => void;
  buttonWarranty: () => void;
  menuIcon: () => void;
};

export const configHandleactions = ({
  buttonReject = () => {},
  buttonCancel = () => {},
  buttonPrint = () => {},
  buttonAttach = () => {},
  buttonViewAttachments = () => {},
  buttonWarranty = () => {},
  menuIcon = () => {},
}: ConfigHandleactions) => {
  return {
    buttons: {
      buttonReject: {
        OnClick: buttonReject,
      },
      buttonCancel: {
        OnClick: buttonCancel,
      },
      buttonPrint: {
        OnClick: buttonPrint,
      },
    },
    buttonsOutlined: {
      buttonAttach: {
        OnClick: buttonAttach,
      },
      buttonViewAttachments: {
        OnClick: buttonViewAttachments,
      },
      buttonWarranty: {
        OnClick: buttonWarranty,
      },
    },
    menuIcon: menuIcon,
  };
};

export const optionFlags = {
  title: "Adjuntar archivo",
  description: "El archivo que intentas agregar ya está registrado.",
  descriptionSuccess: "El archivo se ha guardado exitosamente.",
  appearance: "success",
  appearanceError: "danger",
};

export const errorMessages = {
  comercialManagement: {
    titleCard: "Estado",
    descriptionCard: "Gestión Comercial",
    title: "No se encontró la solicitud de crédito",
    description:
      "No hay datos relacionados a la solicitud de crédito seleccionada.",
    button: "Volver a buscar",
  },
  toDo: {
    titleCard: "Por hacer",
    title: "No se encontraron tareas",
    description: "No hay tareas disponibles para mostrar en este momento.",
    button: "Volver a intentar",
  },
  approval: {
    titleCard: "Aprobaciones",
    title: "No se encontraron aprobaciones",
    description:
      "No se encontraron datos relacionados con la aprobación del crédito.",
    button: "Volver a intentar",
  },
  Requirements: {
    titleCard: "Requisitos",
    title: "No se encontraron requisitos",
    description: "No hay requisitos disponibles para esta solicitud.",
    button: "Volver a intentar",
  },
  Management: {
    titleCard: "Gestión",
    title: "No se encontró gestión",
    description: "No se ha registrado gestión para esta solicitud.",
    button: "Volver a intentar",
  },
  PromissoryNotes: {
    titleCard: "Pagarés y Libranzas",
    title: "No se encontraron documentos de obligación",
    description:
      "No hay documentos disponibles relacionados con pagarés o libranzas.",
    button: "Volver a intentar",
  },
  Postingvouchers: {
    titleCard: "Comprobantes de Contabilización",
    title: "No se encontraron comprobantes",
    description: "No hay comprobantes contables asociados a esta solicitud.",
    button: "Volver a intentar",
  },
  share: {
    titleCard: "Compartir",
    title: "No se encontraron documentos",
    description: "Error al generar el documento para compartir.",
    button: "Volver a intentar",
    spinner: "Generando PDF...",
  },
  getData: {
    title: "Error al cargar los datos",
    description:
      "Hubo un problema al cargar los datos. Por favor, inténtelo de nuevo más tarde.",
    button: "Volver a intentar",
  },
  lateRejectionOfACreditRequest: {
    description: "Error no se pudo rechazar la solicitud de crédito.",
  },
  registerNewsToACreditRequest: {
    description: "Error al enviar el mensaje. Intente nuevamente.",
  },
  searchAllUnreadErrorsById: {
    description: "Error no se pudo traer los errores no leídos.",
  },
};

export const labelsAndValuesShare = {
  titleOnPdf: "Gestión Comercial",
  fileName: "reporte_comercial.pdf",
  text: "Reporte Comercial para compartir",
};

export const editCreditApplicationLabels = {
  placeholderExample: "Ej.: Escribe tu mensaje",
};

export const optionFlagsEnum = {
  title: {
    code: "OptionFlags_title",
    description: "Title for file attachment modal",
    i18n: {
      en: "Attach file",
      es: "Adjuntar archivo",
    },
  },
  description: {
    code: "OptionFlags_description",
    description: "Message when file already exists",
    i18n: {
      en: "The file you are trying to add is already registered.",
      es: "El archivo que intentas agregar ya está registrado.",
    },
  },
  descriptionSuccess: {
    code: "OptionFlags_descriptionSuccess",
    description: "Message when file is saved successfully",
    i18n: {
      en: "The file has been saved successfully.",
      es: "El archivo se ha guardado exitosamente.",
    },
  },
  appearance: {
    code: "OptionFlags_appearance",
    description: "Appearance type for success",
    i18n: {
      en: "success",
      es: "success",
    },
  },
  appearanceError: {
    code: "OptionFlags_appearanceError",
    description: "Appearance type for error",
    i18n: {
      en: "danger",
      es: "danger",
    },
  },
};

export const errorMessagesEnum = {
  comercialManagement: {
    titleCard: {
      code: "ErrorMessages_comercialManagement_titleCard",
      description: "Title for commercial management card",
      i18n: {
        en: "Status",
        es: "Estado",
      },
    },
    descriptionCard: {
      code: "ErrorMessages_comercialManagement_descriptionCard",
      description: "Description for commercial management card",
      i18n: {
        en: "Commercial Management",
        es: "Gestión Comercial",
      },
    },
    title: {
      code: "ErrorMessages_comercialManagement_title",
      description: "Title for error message",
      i18n: {
        en: "Credit request not found",
        es: "No se encontró la solicitud de crédito",
      },
    },
    description: {
      code: "ErrorMessages_comercialManagement_description",
      description: "Description for error message",
      i18n: {
        en: "No data related to the selected credit request.",
        es: "No hay datos relacionados a la solicitud de crédito seleccionada.",
      },
    },
    button: {
      code: "ErrorMessages_comercialManagement_button",
      description: "Label for retry button",
      i18n: {
        en: "Search again",
        es: "Volver a buscar",
      },
    },
  },
  toDo: {
    titleCard: {
      code: "ErrorMessages_toDo_titleCard",
      description: "Title for to-do card",
      i18n: {
        en: "To do",
        es: "Por hacer",
      },
    },
    title: {
      code: "ErrorMessages_toDo_title",
      description: "Title for to-do error message",
      i18n: {
        en: "No tasks found",
        es: "No se encontraron tareas",
      },
    },
    description: {
      code: "ErrorMessages_toDo_description",
      description: "Description for to-do error message",
      i18n: {
        en: "No tasks are available to display at this time.",
        es: "No hay tareas disponibles para mostrar en este momento.",
      },
    },
    button: {
      code: "ErrorMessages_toDo_button",
      description: "Label for retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },
  approval: {
    titleCard: {
      code: "ErrorMessages_approval_titleCard",
      description: "Title for approvals card",
      i18n: {
        en: "Approvals",
        es: "Aprobaciones",
      },
    },
    title: {
      code: "ErrorMessages_approval_title",
      description: "Title for approval error",
      i18n: {
        en: "No approvals found",
        es: "No se encontraron aprobaciones",
      },
    },
    description: {
      code: "ErrorMessages_approval_description",
      description: "Description for approval error",
      i18n: {
        en: "No data related to the credit approval was found.",
        es: "No se encontraron datos relacionados con la aprobación del crédito.",
      },
    },
    button: {
      code: "ErrorMessages_approval_button",
      description: "Label for retry button",
      i18n: {
        en: "Try again",
        es: "Volver a intentar",
      },
    },
  },
  // ... Continue for Requirements, Management, PromissoryNotes, Postingvouchers, share, getData, lateRejectionOfACreditRequest, registerNewsToACreditRequest, searchAllUnreadErrorsById
};

export const labelsAndValuesShareEnum = {
  titleOnPdf: {
    code: "LabelsAndValuesShare_titleOnPdf",
    description: "Title to display on PDF",
    i18n: {
      en: "Commercial Management",
      es: "Gestión Comercial",
    },
  },
  fileName: {
    code: "LabelsAndValuesShare_fileName",
    description: "Default file name for PDF",
    i18n: {
      en: "commercial_report.pdf",
      es: "reporte_comercial.pdf",
    },
  },
  text: {
    code: "LabelsAndValuesShare_text",
    description: "Text description for sharing",
    i18n: {
      en: "Commercial Report to share",
      es: "Reporte Comercial para compartir",
    },
  },
};

export const editCreditApplicationLabelsEnum = {
  placeholderExample: {
    code: "EditCreditApplication_placeholderExample",
    description: "Placeholder text example",
    i18n: {
      en: "Ex.: Write your message",
      es: "Ej.: Escribe tu mensaje",
    },
  },
};
