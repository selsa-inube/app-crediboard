export const approvalsConfig = {
  title: "Evaluación del requisito",
  approval: "Después de evaluar el requisito, ¿Cuál es tu respuesta?",
  observations: "Observaciones",
  observationdetails:
    "Proporciona detalles acerca de la evaluación del requisito",
  answer: "Respuesta",
  answerPlaceHoleder: "Selecciona de la lista",
  Cancel: "Cancelar",
  confirm: "Confirmar",
  titleError: "Lamentamos los inconvenientes",
  maxLength: 200,
};

export const validationHuman = {
  passed: "PASSED_HUMAN_VALIDATION",
  failed: "FAILED_HUMAN_VALIDATION",
  cancel: "VALIDATION_FAILED_CANCELS_REQUEST",
  ignored: "IGNORED_BY_THE_USER_HUMAN_VALIDATION",
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
