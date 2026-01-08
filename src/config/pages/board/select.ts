import { IOptionItemCheckedProps } from "@components/inputs/SelectCheck/OptionItem";

const selectCheckOptions: IOptionItemCheckedProps[] = [
  { id: "1", label: "Solo los míos", checked: false },
  { id: "2", label: "Todos los pendientes de algún tramite", checked: false },
  { id: "3", label: "En Gestión Comercial", checked: false },
  { id: "4", label: "En Verificación y Aprobación", checked: false },
  { id: "5", label: "Formalización y Garantías", checked: false },
  { id: "6", label: "En trámite de desembolso", checked: false },
  { id: "7", label: "En Cumplimiento de Garantías Pos", checked: false },
  { id: "8", label: "Finalizados hace menos de 30 días", checked: false },
  { id: "9", label: "En atención del Cliente", checked: false },
  { id: "10", label: "Con comentarios sin leer", checked: false },
  { id: "11", label: "Sin asignar responsable", checked: false },
];

export const selectCheckOptionsEnum = [
  {
    id: "1",
    code: "SelectCheckOptions_1",
    description: "Option for only my items",
    i18n: {
      en: "Only mine",
      es: "Solo los míos",
    },
    checked: false,
  },
  {
    id: "2",
    code: "SelectCheckOptions_2",
    description: "Option for all pending items of any process",
    i18n: {
      en: "All pending of any process",
      es: "Todos los pendientes de algún tramite",
    },
    checked: false,
  },
  {
    id: "3",
    code: "SelectCheckOptions_3",
    description: "Option for items in commercial management",
    i18n: {
      en: "In Commercial Management",
      es: "En Gestión Comercial",
    },
    checked: false,
  },
  {
    id: "4",
    code: "SelectCheckOptions_4",
    description: "Option for items in verification and approval",
    i18n: {
      en: "In Verification and Approval",
      es: "En Verificación y Aprobación",
    },
    checked: false,
  },
  {
    id: "5",
    code: "SelectCheckOptions_5",
    description: "Option for items in formalization and guarantees",
    i18n: {
      en: "Formalization and Guarantees",
      es: "Formalización y Garantías",
    },
    checked: false,
  },
  {
    id: "6",
    code: "SelectCheckOptions_6",
    description: "Option for items in disbursement process",
    i18n: {
      en: "In Disbursement Process",
      es: "En trámite de desembolso",
    },
    checked: false,
  },
  {
    id: "7",
    code: "SelectCheckOptions_7",
    description: "Option for items in compliance with post guarantees",
    i18n: {
      en: "In Post Guarantees Compliance",
      es: "En Cumplimiento de Garantías Pos",
    },
    checked: false,
  },
  {
    id: "8",
    code: "SelectCheckOptions_8",
    description: "Option for items finished in less than 30 days",
    i18n: {
      en: "Finished less than 30 days ago",
      es: "Finalizados hace menos de 30 días",
    },
    checked: false,
  },
  {
    id: "9",
    code: "SelectCheckOptions_9",
    description: "Option for items in client attention",
    i18n: {
      en: "In Client Attention",
      es: "En atención del Cliente",
    },
    checked: false,
  },
  {
    id: "10",
    code: "SelectCheckOptions_10",
    description: "Option for items with unread comments",
    i18n: {
      en: "With unread comments",
      es: "Con comentarios sin leer",
    },
    checked: false,
  },
  {
    id: "11",
    code: "SelectCheckOptions_11",
    description: "Option for items without assigned responsible",
    i18n: {
      en: "Without assigned responsible",
      es: "Sin asignar responsable",
    },
    checked: false,
  },
];


export { selectCheckOptions };
