import { MdLogout, MdOutlineMarkunreadMailbox } from "react-icons/md";

const getUserMenu = (handleToggleLogoutModal: () => void) => [
  {
    id: "section",
    title: "",
    actions: [
      {
        id: "logout",
        title: "Novedades (5)",
        action: handleToggleLogoutModal,
        iconBefore: <MdOutlineMarkunreadMailbox />,
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
