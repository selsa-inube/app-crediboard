import { MdAddCircleOutline } from "react-icons/md";

import { IOptionButtons } from "@components/modals/ListModal";

export const approvalsConfig = {
  title: "Evaluar",
  observations: "Observaciones",
  selectDocument: "Selecciona el documento que corresponde con el requisito.",
  newDocument: "Cargar documento nuevo",
  answer: "Respuesta",
  answerPlaceHoleder: "Selecciona de la lista",
  observationdetails:
    "Proporciona detalles acerca de la evaluación del requisito",
  cancel: "Cancelar",
  confirm: "Confirmar",
  see: "Ver",
  seen: "Visto",
  titleError: "Lamentamos los inconvenientes",
  titleErrorDocument: "No se pudo obtener el documento. Intenta de nuevo.",
  maxLength: 200,
};

export const optionsAnswer = [
  {
    id: "compliant",
    label: "Cumple",
    value: "Cumple",
  },
  {
    id: "does_not_comply",
    label: "No cumple",
    value: "No cumple",
  },
  { id: "approve", label: "Aprobar", value: "Aprobar" },
  {
    id: "reject",
    label: "No cumple y rechazar solicitud",
    value: "No cumple y rechazar solicitud",
  },
];

export const optionButtons: IOptionButtons = {
  label: "Adjuntar archivo",
  variant: "none",
  icon: <MdAddCircleOutline />,
  fullwidth: false,
  onClick: () => {},
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
  },
};

export const optionsAnswerEnum = {
  compliant: {
    code: "Approvals_answer_compliant",
    description: "Compliant option",
    i18n: { en: "Compliant", es: "Cumple" },
  },
  doesNotComply: {
    code: "Approvals_answer_doesNotComply",
    description: "Does not comply option",
    i18n: { en: "Does not comply", es: "No cumple" },
  },
  approve: {
    code: "Approvals_answer_approve",
    description: "Approve option",
    i18n: { en: "Approve", es: "Aprobar" },
  },
  reject: {
    code: "Approvals_answer_reject",
    description: "Reject option",
    i18n: {
      en: "Does not comply and reject request",
      es: "No cumple y rechazar solicitud",
    },
  },
};

export const optionButtonsEnum = {
  attachFile: {
    code: "Approvals_attachFile",
    description: "Attach file button",
    i18n: { en: "Attach file", es: "Adjuntar archivo" },
  },
};
