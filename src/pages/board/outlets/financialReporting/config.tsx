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
      id: "titleCard",
      code: "ErrorMessages_comercialManagement_titleCard",
      description: "Título de la tarjeta de gestión comercial",
      i18n: { en: "Status", es: "Estado" },
    },
    descriptionCard: {
      id: "descriptionCard",
      code: "ErrorMessages_comercialManagement_descriptionCard",
      description: "Descripción de la tarjeta",
      i18n: { en: "Commercial Management", es: "Gestión Comercial" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_comercialManagement_title",
      description: "Título de error solicitud no encontrada",
      i18n: { en: "Credit request not found", es: "No se encontró la solicitud de crédito" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_comercialManagement_description",
      description: "Descripción de error",
      i18n: { en: "No data related to the selected credit request.", es: "No hay datos relacionados a la solicitud de crédito seleccionada." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_comercialManagement_button",
      description: "Etiqueta botón reintentar",
      i18n: { en: "Search again", es: "Volver a buscar" },
    },
  },
  toDo: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_toDo_titleCard",
      description: "Título tarjeta Por hacer",
      i18n: { en: "To do", es: "Por hacer" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_toDo_title",
      description: "Título error tareas",
      i18n: { en: "No tasks found", es: "No se encontraron tareas" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_toDo_description",
      description: "Descripción error tareas",
      i18n: { en: "No tasks are available to display at this time.", es: "No hay tareas disponibles para mostrar en este momento." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_toDo_button",
      description: "Botón reintentar tareas",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  approval: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_approval_titleCard",
      description: "Título tarjeta aprobaciones",
      i18n: { en: "Approvals", es: "Aprobaciones" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_approval_title",
      description: "Título error aprobaciones",
      i18n: { en: "No approvals found", es: "No se encontraron aprobaciones" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_approval_description",
      description: "Descripción error aprobaciones",
      i18n: { en: "No data related to the credit approval was found.", es: "No se encontraron datos relacionados con la aprobación del crédito." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_approval_button",
      description: "Botón reintentar aprobaciones",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  requirements: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_requirements_titleCard",
      description: "Título tarjeta requisitos",
      i18n: { en: "Requirements", es: "Requisitos" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_requirements_title",
      description: "Título error requisitos",
      i18n: { en: "No requirements found", es: "No se encontraron requisitos" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_requirements_description",
      description: "Descripción error requisitos",
      i18n: { en: "No requirements available for this request.", es: "No hay requisitos disponibles para esta solicitud." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_requirements_button",
      description: "Botón reintentar requisitos",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  management: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_management_titleCard",
      description: "Título tarjeta gestión",
      i18n: { en: "Management", es: "Gestión" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_management_title",
      description: "Título error gestión",
      i18n: { en: "No management found", es: "No se encontró gestión" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_management_description",
      description: "Descripción error gestión",
      i18n: { en: "No management has been registered for this request.", es: "No se ha registrado gestión para esta solicitud." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_management_button",
      description: "Botón reintentar gestión",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  promissoryNotes: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_promissoryNotes_titleCard",
      description: "Título tarjeta pagarés",
      i18n: { en: "Promissory Notes and Payroll Deductions", es: "Pagarés y Libranzas" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_promissoryNotes_title",
      description: "Título error pagarés",
      i18n: { en: "No obligation documents found", es: "No se encontraron documentos de obligación" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_promissoryNotes_description",
      description: "Descripción error pagarés",
      i18n: { en: "No documents available related to promissory notes or payroll deductions.", es: "No hay documentos disponibles relacionados con pagarés o libranzas." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_promissoryNotes_button",
      description: "Botón reintentar pagarés",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  postingVouchers: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_postingVouchers_titleCard",
      description: "Título tarjeta comprobantes",
      i18n: { en: "Accounting Vouchers", es: "Comprobantes de Contabilización" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_postingVouchers_title",
      description: "Título error comprobantes",
      i18n: { en: "No vouchers found", es: "No se encontraron comprobantes" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_postingVouchers_description",
      description: "Descripción error comprobantes",
      i18n: { en: "No accounting vouchers associated with this request.", es: "No hay comprobantes contables asociados a esta solicitud." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_postingVouchers_button",
      description: "Botón reintentar comprobantes",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  share: {
    titleCard: {
      id: "titleCard",
      code: "ErrorMessages_share_titleCard",
      description: "Título tarjeta compartir",
      i18n: { en: "Share", es: "Compartir" },
    },
    title: {
      id: "title",
      code: "ErrorMessages_share_title",
      description: "Título error compartir",
      i18n: { en: "No documents found", es: "No se encontraron documentos" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_share_description",
      description: "Descripción error compartir",
      i18n: { en: "Error generating the document to share.", es: "Error al generar el documento para compartir." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_share_button",
      description: "Botón reintentar compartir",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
    spinner: {
      id: "spinner",
      code: "ErrorMessages_share_spinner",
      description: "Texto cargando PDF",
      i18n: { en: "Generating PDF...", es: "Generando PDF..." },
    },
  },
  getData: {
    title: {
      id: "title",
      code: "ErrorMessages_getData_title",
      description: "Título error carga datos",
      i18n: { en: "Error loading data", es: "Error al cargar los datos" },
    },
    description: {
      id: "description",
      code: "ErrorMessages_getData_description",
      description: "Descripción error carga datos",
      i18n: { en: "There was a problem loading the data. Please try again later.", es: "Hubo un problema al cargar los datos. Por favor, inténtelo de nuevo más tarde." },
    },
    button: {
      id: "button",
      code: "ErrorMessages_getData_button",
      description: "Botón reintentar carga",
      i18n: { en: "Try again", es: "Volver a intentar" },
    },
  },
  lateRejection: {
    description: {
      id: "lateRejectionDescription",
      code: "ErrorMessages_lateRejection_description",
      description: "Error rechazo tardío",
      i18n: { en: "Error: credit request could not be rejected.", es: "Error no se pudo rechazar la solicitud de crédito." },
    },
  },
  registerNews: {
    description: {
      id: "registerNewsDescription",
      code: "ErrorMessages_registerNews_description",
      description: "Error registro novedades",
      i18n: { en: "Error sending the message. Please try again.", es: "Error al enviar el mensaje. Intente nuevamente." },
    },
  },
  unreadErrors: {
    description: {
      id: "unreadErrorsDescription",
      code: "ErrorMessages_unreadErrors_description",
      description: "Error búsqueda errores no leídos",
      i18n: { en: "Error: could not retrieve unread errors.", es: "Error no se pudo traer los errores no leídos." },
    },
  },
  searchProspect: {
    description: {
      id: "searchProspectDescription",
      code: "ErrorMessages_searchProspect_description",
      description: "Error búsqueda prospecto",
      i18n: { en: "Could not retrieve related prospect data.", es: "No se pudo obtener los datos del prospecto relacionado." },
    },
  },
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
