import { MdVpnKey } from "react-icons/md";

const appsConfig = [
  {
    id: 1,
    label: "Board",
    description: "Gestiona los creditos",
    icon: <MdVpnKey />,
    crumbs: [
      {
        path: "/",
        label: "Inicio",
        id: "/",
        isActive: false,
      },
      {
        path: "/board",
        label: "Crediboard",
        id: "/board",
        isActive: true,
      },
    ],
    url: "/board",
  },
];


const logoutConfig = {
  logoutPath: "/logout",
  logoutTitle: "Cerrar sesión",
};

export const appsConfigEnum = [
  {
    id: 1,
    label: {
      code: "Apps_board_label",
      description: "Board",
      i18n: {
        en: "Board",
        es: "Board",
      },
    },
    description: {
      code: "Apps_board_description",
      description: "Manage credits",
      i18n: {
        en: "Manage credits",
        es: "Gestiona los creditos",
      },
    },
    icon: <MdVpnKey />,
    crumbs: [
      {
        path: "/",
        label: {
          code: "Breadcrumb_home",
          description: "Home",
          i18n: {
            en: "Home",
            es: "Inicio",
          },
        },
        id: "/",
        isActive: false,
      },
      {
        path: "/board",
        label: {
          code: "Breadcrumb_board",
          description: "Crediboard",
          i18n: {
            en: "Crediboard",
            es: "Crediboard",
          },
        },
        id: "/board",
        isActive: true,
      },
    ],
    url: "/board",
  },
];

export const logoutConfigEnum = {
  logoutPath: "/logout",
  logoutTitle: {
    code: "Logout_title",
    description: "Log out",
    i18n: {
      en: "Log out",
      es: "Cerrar sesión",
    },
  },
};


export { appsConfig, logoutConfig };
