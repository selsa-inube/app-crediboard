import { dataTableExtraDebtors } from "@components/data/TableExtraDebtors/config";

export const mockExtraDebtors: dataTableExtraDebtors[] = [
  {
    id: crypto.randomUUID(),
    documentType: "Cedula",
    documentNumber: 1021365993,
    names: "Camilo",
    lastName: "Rincon",
    income: 5000000,
    expenses: 1500000,
    email: "camilo@inube.com",
    phone: 3123654470,
    gender: "Masculino",
    actions: "",
    trace_id: crypto.randomUUID(),
  },
];
