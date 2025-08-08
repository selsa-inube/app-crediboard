import { SectionBackground } from "@components/layout/BoardSection/types";
import { IOptionItemCheckedProps } from "@components/inputs/SelectCheck/OptionItem";

interface SelectConfigProps {
  label: string;
  id: string;
  name: string;
  placeholder: string;
  options: IOptionItemCheckedProps[];
  onChangeCheck: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  onChange: () => void;
  fullwidth: boolean;
}

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

const selectConfig = (
  selectOptions: IOptionItemCheckedProps[],
  handleSelectCheckChange: (e: React.ChangeEvent<HTMLInputElement>) => void
): SelectConfigProps => ({
  label: "Filtrado por",
  id: "FilterRequests",
  name: "FilterRequests",
  placeholder: "Seleccione una opción",
  options: selectOptions,
  onChangeCheck: handleSelectCheckChange,
  value: "",
  onChange: () => {},
  fullwidth: true,
});

const dataInformationModal = {
  tilte: "Información",
  button: "Entendido",
  description:
    "No cuenta con los privilegios requeridos para quitar el ancla de esta tarjeta.",
};

const dataInformationSearchModal = {
  titleModal: "Filtros aplicados",
  succesModal: "Sí, mantenerlos",
  buttonModal: "No, retirarlos",
  descriptionModal:
    "Para la búsqueda que está a punto de hacer, ¿Desea mantener los filtros aplicados?",
};
export {
  boardColumns,
  dataInformationModal,
  selectConfig,
  dataInformationSearchModal,
};
