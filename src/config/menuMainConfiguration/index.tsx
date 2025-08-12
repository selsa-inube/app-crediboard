import { MdLogout } from "react-icons/md";

const getUserMenu = (handleToggleLogoutModal: () => void) => [
  {
    id: "section",
    title: "",
    actions: [
      {
        id: "logout",
        title: "Cerrar sesión",
        action: handleToggleLogoutModal,
        iconBefore: <MdLogout />,
      },
    ],
    divider: true,
  },
  {
    id: "section",
    title: "",
    links: [
      {
        id: "logout",
        title: "Cerrar sesión",
        path: "/logout",
        iconBefore: <MdLogout />,
      },
    ],
    divider: true,
  },
];

export { getUserMenu };
