import { MdAddCircleOutline } from "react-icons/md";

import { IOptionButtons } from "@components/modals/ListModal";

export const optionButtons: IOptionButtons = {
  label: "Adjuntar archivo",
  variant: "none",
  icon: <MdAddCircleOutline />,
  fullwidth: false,
  onClick: () => {},
};

export interface IUploadedFileReturn {
  documentId: string;
  documentCode: string;
  abbreviatedName: string;
}

export interface IUploadedFileReturn {
  documentId: string;
  documentCode: string;
  abbreviatedName: string;
}

export const optionButtonsEnum = {
  attachFile: {
    id: "attachFile",
    code: "OptionButtons_attachFile",
    description: "Etiqueta para el botón de adjuntar archivo",
    i18n: {
      en: "Attach file",
      es: "Adjuntar archivo",
    },
  },
};

export const approvalsConfigEnum = {
  title: {
    code: "Approvals_title",
    description: "Evaluate title",
    i18n: { en: "Evaluate", es: "Evaluar" },
  },
  observations: {
    code: "Approvals_observations",
    description: "Observations label",
    i18n: { en: "Observations", es: "Observaciones" },
  },
  selectDocument: {
    code: "Approvals_selectDocument",
    description: "Select document instruction",
    i18n: {
      en: "Select the document that matches the requirement.",
      es: "Selecciona el documento que corresponde con el requisito.",
    },
  },
  newDocument: {
    code: "Approvals_newDocument",
    description: "Upload new document",
    i18n: { en: "Upload new document", es: "Cargar documento nuevo" },
  },
  answer: {
    code: "Approvals_answer",
    description: "Answer label",
    i18n: { en: "Answer", es: "Respuesta" },
  },
  answerPlaceHolder: {
    code: "Approvals_answerPlaceHolder",
    description: "Answer placeholder",
    i18n: { en: "Select from the list", es: "Selecciona de la lista" },
  },
  observationdetails: {
    code: "Approvals_observationDetails",
    description: "Observation details helper text",
    i18n: {
      en: "Provide details about the requirement evaluation",
      es: "Proporciona detalles acerca de la evaluación del requisito",
    },
  },
  cancel: {
    code: "Approvals_cancel",
    description: "Cancel button",
    i18n: { en: "Cancel", es: "Cancelar" },
  },
  confirm: {
    code: "Approvals_confirm",
    description: "Confirm button",
    i18n: { en: "Confirm", es: "Confirmar" },
  },
  see: {
    code: "Approvals_see",
    description: "See action",
    i18n: { en: "See", es: "Ver" },
  },
  seen: {
    code: "Approvals_seen",
    description: "Seen status",
    i18n: { en: "Seen", es: "Visto" },
  },
  titleError: {
    code: "Approvals_titleError",
    description: "Generic error title",
    i18n: {
      en: "We regret the inconvenience",
      es: "Lamentamos los inconvenientes",
    },
  },
  titleErrorDocument: {
    code: "Approvals_titleErrorDocument",
    description: "Document fetch error title",
    i18n: {
      en: "The document could not be obtained. Try again.",
      es: "No se pudo obtener el documento. Intenta de nuevo.",
    },
    maxLength: {
      code: "Approvals_titleErrorDocument",
      value: 200,
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
