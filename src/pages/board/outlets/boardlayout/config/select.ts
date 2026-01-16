export interface ISelectCheckOption {
  id: string;
  code: string;
  description: string;
  value: string;
  checked: boolean;
  i18n: {
    en: string;
    es: string;
  };
}

export const selectCheckOptionsEnum: ISelectCheckOption[] = [
  {
    id: "1",
    code: "SelectCheckOption_onlyMyRequests",
    description: "Filter for only my requests",
    value: "onlyMyRequests",
    checked: false,
    i18n: {
      en: "Only mine",
      es: "Solo los míos",
    },
  },
  {
    id: "2",
    code: "SelectCheckOption_completedLessThan30DaysAgo",
    description: "Filter for requests completed less than 30 days ago",
    value: "completedLessThan30DaysAgo",
    checked: false,
    i18n: {
      en: "Completed less than 30 days ago",
      es: "Finalizados hace menos de 30 días",
    },
  },
  {
    id: "3",
    code: "SelectCheckOption_pendingCustomerAction",
    description: "Filter for requests pending customer action",
    value: "pendingCustomerAction",
    checked: false,
    i18n: {
      en: "Pending customer action",
      es: "En atención del cliente",
    },
  },
  {
    id: "4",
    code: "SelectCheckOption_unreadNovelties",
    description: "Filter for requests with unread comments",
    value: "unreadNovelties",
    checked: false,
    i18n: {
      en: "Unread comments",
      es: "Comentarios sin leer",
    },
  },
  {
    id: "5",
    code: "SelectCheckOption_unassigned",
    description: "Filter for requests without assigned responsible",
    value: "unassigned",
    checked: false,
    i18n: {
      en: "Unassigned responsible",
      es: "Sin asignar responsable",
    },
  },
];