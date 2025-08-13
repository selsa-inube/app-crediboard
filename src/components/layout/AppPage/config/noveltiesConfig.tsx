import { MdChevronRight } from "react-icons/md";
import userNovelties from "@assets/images/user.Novelties.jpg";

export interface NoveltyData {
  id: string;
  userImage: string;
  userName: string;
  dateTime: string;
  referenceCode: string;
  description: string;
  actionText: string;
  actionIcon: React.ReactNode;
  onActionClick: () => void;
}

export const noveltiesConfig: NoveltyData[] = [
  {
    id: "1",
    userImage: userNovelties,
    userName: "Julie Andrews Stein",
    dateTime: "02/Jun/2024 - 12:23 p. m.",
    referenceCode: "SC-545454678",
    description: "Lorem ipsum dolor sit gravida eget eros.",
    actionText: "Ir a esta solicitud",
    actionIcon: <MdChevronRight />,
    onActionClick: () => {
      console.log("Navegando a solicitud SC-545454678");
    },
  },
  {
    id: "2",
    userImage: userNovelties,
    userName: "Carlos Rodriguez Martinez",
    dateTime: "01/Jun/2024 - 09:15 a. m.",
    referenceCode: "SC-545454679",
    description:
      "Solicitud de cambio de horario laboral pendiente de aprobación.",
    actionText: "Ir a esta solicitud",
    actionIcon: <MdChevronRight />,
    onActionClick: () => {
      console.log("Viendo detalles SC-545454679");
    },
  },
  {
    id: "3",
    userImage: userNovelties,
    userName: "Ana Sofia Gutierrez",
    dateTime: "31/May/2024 - 03:45 p. m.",
    referenceCode: "SC-545454680",
    description: "Actualización de datos personales requiere verificación.",
    actionText: "Ir a esta solicitud",
    actionIcon: <MdChevronRight />,
    onActionClick: () => {
      console.log("Verificando datos SC-545454680");
    },
  },
  {
    id: "4",
    userImage: userNovelties,
    userName: "Miguel Angel Torres",
    dateTime: "30/May/2024 - 11:30 a. m.",
    referenceCode: "SC-545454681",
    description: "Solicitud de vacaciones aprobada correctamente.",
    actionText: "Ir a esta solicitud",
    actionIcon: <MdChevronRight />,
    onActionClick: () => {
      console.log("Viendo aprobación SC-545454681");
    },
  },
];
