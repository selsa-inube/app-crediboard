import { isValidElement } from "react";
import {
  MdCheck,
  MdClose,
  MdNotificationsNone,
  MdRemove,
  MdWarningAmber,
} from "react-icons/md";
import { Icon, Tag } from "@inube/design-system";

import { IEntries } from "@components/data/TableBoard/types";

const handledata = (data: IEntries) => {
  console.log(data, "function that receives data");
};

export async function handleData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const entriesApprovals = [
        {
          id: "uno",
          usuarios: "Pedro Pablo Iregui Gerrero",
          tag: <Tag label="Aprobado" appearance="success" />,
        },
        {
          id: "dos",
          usuarios: "Carlos Alberto Combita",
          tag: <Tag label="Rechazado" appearance="error" />,
        },
        {
          id: "tres",
          usuarios: "Jaime Alberto Linares Guacaneme",
          tag: <Tag label="Aprobado" appearance="success" />,
        },
        {
          id: "cuatro",
          usuarios: "Miguel Angel Fuentes",
          tag: <Tag label="Pendiente" appearance="warning" />,
        },
        {
          id: "cinco",
          usuarios: "Cesar Augusto Corredor",
          tag: <Tag label="Aprobado" appearance="success" />,
        },
        {
          id: "seis",
          usuarios: "Paula Andrea Betancurt",
          tag: <Tag label="Rechazado" appearance="error" />,
        },
        {
          id: "siete",
          usuarios: "Jaime Alejandro Vargas",
          tag: <Tag label="Pendiente" appearance="warning" />,
        },
        {
          id: "ocho",
          usuarios: "Viviana Amador Tejada",
          tag: <Tag label="Aprobado" appearance="success" />,
        },
      ];
      resolve(entriesApprovals);
    }, 2000);
  });
}

export const titlesApprovals = [
  {
    id: "usuarios",
    titleName: "Usuarios",
    priority: 1,
  },
  {
    id: "tag",
    titleName: "Decisión",
    priority: 2,
  },
];

export const entriesApprovals = [
  {
    id: "uno",
    usuarios: "Pedro Pablo Iregui Gerrero",
    decision: <Tag label="Aprobado" appearance="success" />,
    error: "",
  },
  {
    id: "dos",
    usuarios: "Carlos Alberto Combita",
    decision: <Tag label="Rechazado" appearance="error" />,
    error: (
      <Icon
        icon={<MdWarningAmber />}
        appearance="warning"
        spacing="compact"
        cursorHover
        size="24px"
      />
    ),
  },
  {
    id: "tres",
    usuarios: "Jaime Alberto Linares Guacaneme",
    decision: <Tag label="Aprobado" appearance="success" />,
    erro: "",
  },
  {
    id: "cuatro",
    usuarios: "Miguel Angel Fuentes",
    decision: <Tag label="Pendiente" appearance="warning" />,
    error: "",
  },
  {
    id: "cinco",
    usuarios: "Cesar Augusto Corredor",
    decision: <Tag label="Aprobado" appearance="success" />,
    error: "",
  },
  {
    id: "seis",
    usuarios: "Paula Andrea Betancurt",
    decision: <Tag label="Rechazado" appearance="error" />,
    error: (
      <Icon
        icon={<MdWarningAmber />}
        appearance="warning"
        spacing="compact"
        cursorHover
        size="24px"
      />
    ),
  },
  {
    id: "siete",
    usuarios: "Jaime Alejandro Vargas",
    decision: <Tag label="Pendiente" appearance="warning" />,
    error: "",
  },
  {
    id: "ocho",
    usuarios: "Viviana Amador Tejada",
    decision: <Tag label="Aprobado" appearance="success" />,
    error: "",
  },
];

export const actionsApprovals = [
  {
    id: "Error",
    actionName: "Error",
    content: (data: IEntries) => (
      <Icon
        icon={<MdWarningAmber />}
        appearance="warning"
        spacing="compact"
        cursorHover
        size="24px"
        onClick={() => handledata(data)}
        disabled={
          isValidElement(data?.tag) && data?.tag?.props?.label !== "Pendiente"
        }
      />
    ),
  },
  {
    id: "notificaciones",
    actionName: "Notificar",
    content: (data: IEntries) => (
      <Icon
        icon={<MdNotificationsNone />}
        appearance="primary"
        spacing="compact"
        cursorHover
        size="24px"
        onClick={() => handledata(data)}
        disabled={
          isValidElement(data?.tag) && data?.tag?.props?.label === "Pendiente"
        }
      />
    ),
  },
];

const iconActionsMobile = (tag: string) => {
  if (tag === "Aprobado") {
    return <MdCheck />;
  } else if (tag === "Pendiente") {
    return <MdRemove />;
  } else {
    return <MdClose />;
  }
};

interface TagProps {
  appearance?: string;
  label?: string;
}

interface TagElement {
  props: TagProps;
}

const isValidTagElement = (element: unknown): element is TagElement => {
  return isValidElement(element) && element.props !== undefined;
};

export const actionMobileApprovals = [
  {
    id: "tags",
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={
          isValidElement(data?.tag) &&
          iconActionsMobile(data?.tag?.props?.label)
        }
        appearance={
          isValidTagElement(data?.tag)
            ? data?.tag?.props?.appearance
            : undefined
        }
        cursorHover
        variant="filled"
        shape="circle"
      />
    ),
  },
  {
    id: "Error",
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={<MdWarningAmber />}
        appearance="warning"
        spacing="compact"
        cursorHover
        size="24px"
        onClick={() => handledata(data)}
        disabled={
          isValidElement(data?.tag) && data?.tag?.props?.label !== "Pendiente"
        }
      />
    ),
  },
  {
    id: "notificaciones",
    actionName: "",
    content: (data: IEntries) => (
      <Icon
        icon={<MdNotificationsNone />}
        appearance="primary"
        spacing="compact"
        cursorHover
        size="24px"
        onClick={() => handledata(data)}
        disabled={
          isValidElement(data?.tag) && data?.tag?.props?.label === "Pendiente"
        }
      />
    ),
  },
];
