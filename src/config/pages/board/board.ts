import { SectionBackground } from "@components/layout/BoardSection/types";

type BoardColumn = {
  id: string;
  value: string;
  sectionBackground: SectionBackground;
};

const boardColumns: BoardColumn[] = [
  {
    id: "GESTION_COMERCIAL",
    value: "Gestión Comercial",
    sectionBackground: "gray",
  },
  {
    id: "VERIFICACION_APROBACION",
    value: "Verificación y Aprobación",
    sectionBackground: "light",
  },
  {
    id: "FORMALIZACION_GARANTIAS",
    value: "Formalización Garantías",
    sectionBackground: "gray",
  },
  {
    id: "TRAMITE_DESEMBOLSO",
    value: "Trámite Desembolso",
    sectionBackground: "light",
  },
  {
    id: "CUMPLIMIENTO_REQUISITOS",
    value: "Cumplimiento Requisitos",
    sectionBackground: "gray",
  },
];

export const boardColumnsEnum = [
  {
    id: "GESTION_COMERCIAL",
    code: "BoardColumns_GESTION_COMERCIAL",
    description: "Column for commercial management",
    i18n: {
      en: "Commercial Management",
      es: "Gestión Comercial",
    },
    sectionBackground: "gray",
  },
  {
    id: "VERIFICACION_APROBACION",
    code: "BoardColumns_VERIFICACION_APROBACION",
    description: "Column for verification and approval",
    i18n: {
      en: "Verification and Approval",
      es: "Verificación y Aprobación",
    },
    sectionBackground: "light",
  },
  {
    id: "FORMALIZACION_GARANTIAS",
    code: "BoardColumns_FORMALIZACION_GARANTIAS",
    description: "Column for formalizing guarantees",
    i18n: {
      en: "Guarantees Formalization",
      es: "Formalización Garantías",
    },
    sectionBackground: "gray",
  },
  {
    id: "TRAMITE_DESEMBOLSO",
    code: "BoardColumns_TRAMITE_DESEMBOLSO",
    description: "Column for disbursement process",
    i18n: {
      en: "Disbursement Process",
      es: "Trámite Desembolso",
    },
    sectionBackground: "light",
  },
  {
    id: "CUMPLIMIENTO_REQUISITOS",
    code: "BoardColumns_CUMPLIMIENTO_REQUISITOS",
    description: "Column for compliance with requirements",
    i18n: {
      en: "Requirements Compliance",
      es: "Cumplimiento Requisitos",
    },
    sectionBackground: "gray",
  },
];


export { boardColumns };
