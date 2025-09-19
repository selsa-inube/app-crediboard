import { MdLogout, MdOutlineMarkunreadMailbox } from "react-icons/md";

const getUserMenu = (
  handleToggleLogoutModal: () => void,
  notificationsCount: number = 0
) => [
  {
    id: "notifications-section",
    title: "",
    actions: [
      {
        id: "notifications",
        title: `Novedades (${notificationsCount})`,
        action: handleToggleLogoutModal,
        iconBefore: <MdOutlineMarkunreadMailbox />,
      },
    ],
    divider: true,
  },
  {
    id: "logout-section",
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
