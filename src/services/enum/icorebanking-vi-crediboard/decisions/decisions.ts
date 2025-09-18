export const decisions = [
  {
    Code: "ANALISIS_RIESGO",
    Value: "Análisis Riesgo",
    Description: "Devolver la Solicitud para Validar Requisitos y Riesgo.",
    I18nAttribute: "DM_ENUM_EDECISIONS_ANALISIS_RIESGO",
    I18n: {
      es: "Devolver la solicitud a análisis de riesgo",
      en: "Risk analysis",
    },
  },
  {
    Code: "ANULAR_SOLICITUD",
    Value: "Anular Solicitud",
    Description: "Anular la Solicitud porque se crea erróneamente.",
    I18nAttribute: "DM_ENUM_EDECISIONS_ANULAR_SOLICITUD",
    I18n: { es: "Anular la solicitud", en: "Cancel application" },
  },
  {
    Code: "APROBAR_SOLICITUD",
    Value: "Aprobar Solicitud",
    Description: "Aprobar la Solicitud.",
    I18nAttribute: "DM_ENUM_EDECISIONS_APROBAR_SOLICITUD",
    I18n: { es: "Aprobar la solicitud", en: "Approve application" },
  },
  {
    Code: "CANCELAR_SOLICITUD",
    Value: "Cancelar Solicitud",
    Description:
      "Cancelar la Solicitud porque NO hay interés de continuar con el trámite.",
    I18nAttribute: "DM_ENUM_EDECISIONS_CANCELAR_SOLICITUD",
    I18n: { es: "Cancelar la solicitud", en: "Cancel application" },
  },
  {
    Code: "CONFIRMACION_CLIENTE",
    Value: "Confirmación Cliente",
    Description: "El cliente lo piensa y confirma plan de crédito.",
    I18nAttribute: "DM_ENUM_EDECISIONS_CONFIRMACION_CLIENTE",
    I18n: { es: "Confirmación del cliente", en: "Client confirmation" },
  },
  {
    Code: "DESEMBOLSO_DECLINADO",
    Value: "Desembolso Declinado",
    Description: "El desembolso NO se pudo realizar.",
    I18nAttribute: "DM_ENUM_EDECISIONS_DESEMBOLSO_DECLINADO",
    I18n: { es: "Desembolso fue declinado", en: "Disbursement declined" },
  },
  {
    Code: "DESEMBOLSO_REALIZADO",
    Value: "Desembolso Realizado",
    Description: "El desembolso del crédito se produjo satisfactoriamente.",
    I18nAttribute: "DM_ENUM_EDECISIONS_DESEMBOLSO_REALIZADO",
    I18n: { es: "Desembolso fue realizado", en: "Disbursement completed" },
  },
  {
    Code: "GESTION_COMERCIAL",
    Value: "Gestión Comercial",
    Description: "Devolver la solicitud para Gestión Comercial.",
    I18nAttribute: "DM_ENUM_EDECISIONS_GESTION_COMERCIAL",
    I18n: {
      es: "Devolvr la solicitud a gestión comercial",
      en: "Commercial management",
    },
  },
  {
    Code: "RECHAZAR_SOLICITUD",
    Value: "Rechazar Solicitud",
    Description: "Rechazar la solicitud porque NO resulta viable.",
    I18nAttribute: "DM_ENUM_EDECISIONS_RECHAZAR_SOLICITUD",
    I18n: { es: "Rechazar la solicitud", en: "Reject application" },
  },
  {
    Code: "SOPORTES_INVALIDOS",
    Value: "Soportes Inválidos",
    Description: "Los soportes y/o las garantías NO son válidos.",
    I18nAttribute: "DM_ENUM_EDECISIONS_SOPORTES_INVALIDOS",
    I18n: { es: "Los soportes son inválidos", en: "Invalid documents" },
  },
  {
    Code: "SOPORTES_POS_NO_RECIBIDOS",
    Value: "Soportes Pos No Recibidos",
    Description:
      "Los documentos soporte NO pueden ser entregados por el solicicitante.",
    I18nAttribute: "DM_ENUM_EDECISIONS_SOPORTES_POS_NO_RECIBIDOS",
    I18n: { es: "Soportes pos no recibidos", en: "POS documents not received" },
  },
  {
    Code: "SOPORTES_POS_RECIBIDOS",
    Value: "Soportes Pos Recibidos",
    Description:
      "Los documentos soporte requeridos segun el destino del dinero.",
    I18nAttribute: "DM_ENUM_EDECISIONS_SOPORTES_POS_RECIBIDOS",
    I18n: { es: "Soportes pos recibidos", en: "POS documents received" },
  },
  {
    Code: "SOPORTES_VALIDOS",
    Value: "Soportes Válidos",
    Description: "Los soportes y las garantías son Válidos.",
    I18nAttribute: "DM_ENUM_EDECISIONS_SOPORTES_VALIDOS",
    I18n: { es: "Los soportes son válidos", en: "Valid documents" },
  },
  {
    Code: "VIABILIZAR_SOLICITUD",
    Value: "Viabilizar Solicitud",
    Description: "La solicitud es viable.",
    I18nAttribute: "DM_ENUM_EDECISIONS_VIABILIZAR_SOLICITUD",
    I18n: { es: "Viabilizar la solicitud", en: "Make application viable" },
  },
  {
    Code: "PREVIABILIZAR_SOLICITUD",
    Value: "Previabilizar Solicitud",
    Description: "La solicitud es viable.",
    I18nAttribute: "DM_ENUM_EDECISIONS_PREVIABILIZAR_SOLICITUD",
    I18n: { es: "Previabilizar la solicitud", en: "Pre-qualify application" },
  },
  {
    Code: "CREAR_OBLIGACIONES_DE_CARTERA",
    Value: "Crear Obligaciones de Cartera",
    Description:
      "Las obligaciones deben ser creadas usando la Api prevista para ello.",
    I18nAttribute: "DM_ENUM_EDECISIONS_CREAR_OBLIGACIONES_DE_CARTERA",
    I18n: {
      es: "Crear las obligaciones de cartera",
      en: "Create portfolio obligations",
    },
  },
  {
    Code: "DECLINAR_OBLIGACIONES_DE_CARTERA",
    Value: "Declinar Obligaciones de Cartera",
    Description:
      "Debido a problemas con la interfaz de cartera NO es posible generar las obligaciones de cartera.",
    I18nAttribute: "DM_ENUM_EDECISIONS_DECLINAR_OBLIGACIONES_DE_CARTERA",
    I18n: {
      es: "Declinar las obligaciones de cartera",
      en: "Decline portfolio obligations",
    },
  },
];
