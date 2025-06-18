export interface IOption {
  id: string;
  label: string;
  value: string;
  checked: boolean;
}
const selectCheckOptions: IOption[] = [
  {
    id: "1",
    label: "Solo los míos",
    value: "onlyMyRequests",
    checked: false,
  },

  {
    id: "2",
    label: "Finalizados hace menos de 30 días",
    value: "completedLessThan30DaysAgo",
    checked: false,
  },

  {
    id: "3",
    label: "En atención del cliente",
    value: "pendingCustomerAction",
    checked: false,
  },

  {
    id: "4",
    label: "Comentarios sin leer",
    value: "unreadNovelties",
    checked: false,
  },

  {
    id: "5",
    label: "Sin asignar responsable",
    value: "unassigned",
    checked: false,
  },
];

export { selectCheckOptions };
