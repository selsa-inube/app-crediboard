import { SectionBackground } from "@components/layout/BoardSection/types";
import { Filter } from "@components/cards/SelectedFilters/interface";

export type TBoardColumn = {
  id: string;
  code: string;
  description: string;
  i18n: {
    en: string;
    es: string;
  };
  sectionBackground: SectionBackground;
};

export const boardColumnsEnum: TBoardColumn[] = [
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
    description: "Column for formalization of guarantees",
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
    description: "Column for requirements compliance",
    i18n: {
      en: "Requirements Compliance",
      es: "Cumplimiento Requisitos",
    },
    sectionBackground: "gray",
  },
];

export const getBoardColumns = (
  activeFilters: Filter[],
  boardOrientation: string = "vertical",
): TBoardColumn[] => {
  const hasCompletedFilter = activeFilters.some(
    (filter) => filter.value === "completedLessThan30DaysAgo=Y",
  );

  if (hasCompletedFilter && boardOrientation === "horizontal") {
    return [
      ...boardColumnsEnum,
      {
        id: "TRAMITADA",
        code: "BoardColumns_TRAMITADA",
        description: "Column for processed items",
        i18n: {
          en: "Processed",
          es: "Tramitadas",
        },
        sectionBackground: "light",
      },
    ];
  }

  return boardColumnsEnum;
};

export const dataInformationModalEnum = {
  tilte: {
    code: "DataInformationModal_tilte",
    description: "Title of the information modal",
    i18n: {
      en: "Information",
      es: "Información",
    },
  },
  button: {
    code: "DataInformationModal_button",
    description: "Confirmation button in the modal",
    i18n: {
      en: "Understood",
      es: "Entendido",
    },
  },
  description: {
    code: "DataInformationModal_description",
    description: "Description explaining missing privileges",
    i18n: {
      en: "You do not have the required privileges to remove the pin from this card.",
      es: "No cuentas con los privilegios requeridos para quitar el ancla de esta tarjeta.",
    },
  },
};

export const dataInformationSearchModalEnum = {
  titleModal: {
    code: "DataInformationSearchModal_titleModal",
    description: "Title of the search modal",
    i18n: {
      en: "Applied filters",
      es: "Filtros aplicados",
    },
  },
  successModal: {
    code: "DataInformationSearchModal_succesModal",
    description: "Confirmation button to keep filters",
    i18n: {
      en: "Yes, keep them",
      es: "Sí, mantenerlos",
    },
  },
  buttonModal: {
    code: "DataInformationSearchModal_buttonModal",
    description: "Button to remove filters",
    i18n: {
      en: "No, remove them",
      es: "No, retirarlos",
    },
  },
  descriptionModal: {
    code: "DataInformationSearchModal_descriptionModal",
    description: "Description of the modal asking about keeping filters",
    i18n: {
      en: "For the search you are about to perform, do you want to keep the applied filters?",
      es: "Para la búsqueda que está a punto de hacer, ¿Desea mantener los filtros aplicados?",
    },
  },
};

export const boardLayoutDataEnum = {
  errorLoadingPins: {
    code: "BoardLayoutData_errorLoadingPins",
    description: "Error message when pinned items cannot be loaded",
    i18n: {
      en: "Error: Could not load pinned items state.",
      es: "Error: No se pudo cargar el estado de los anclados.",
    },
  },
  remove: {
    code: "BoardLayoutData_remove",
    description: "Label for removing an item",
    i18n: {
      en: "Remove",
      es: "Elimina",
    },
  },
  filter: {
    code: "BoardLayoutData_filter",
    description: "Label for filtering items",
    i18n: {
      en: "Filter",
      es: "Filtra",
    },
  },
};
