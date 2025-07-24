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
  maxLength: 200,
};

export const validationDocument = {
  passed: "DOCUMENT_STORED_AND_VALIDATED",
  failed: "FAILED_DOCUMENT_VALIDATION",
  cancel: "INVALID_DOCUMENT_CANCELS_REQUEST",
  ignored: "DOCUMENT_IGNORED_BY_THE_USER",
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
