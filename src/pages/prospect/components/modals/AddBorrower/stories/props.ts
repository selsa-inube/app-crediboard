export const parameters = {
  docs: {
    description: {
      component: "Modal to create new borrowers.",
    },
  },
};

export const props = {
  title: {
    description: "main title of the modal",
  },
  portalId: {
    description: "name of the html element where the modal is rendered",
  },
  content: {
    description:
      "element to be rendered in the modal, usually a form to create a new borrower. ",
  },
};

export const TipeOfDocument = [
  { id: "01", label: "CC", value: "CC" },
  { id: "02", label: "CE", value: "CE" },
  { id: "03", label: "TI", value: "TI" },
];
export const TipeOfSex = [
  { id: "01", label: "Mujer", value: "Mujer" },
  { id: "02", label: "Hombre", value: "Hombre" },
];
export const TipeOfFamily = [
  { id: "01", label: "Padre/Madre", value: "Padre" },
  { id: "03", label: "Hermano/a", value: "Hermano" },
  { id: "04", label: "Abuelo/a", value: "Abuelo" },
  { id: "05", label: "Tio/a", value: "Tio" },
  { id: "06", label: "Primo/a", value: "Primo" },
  { id: "07", label: "Esposo/a", value: "Esposo" },
  { id: "08", label: "Hijo/a", value: "Hijo" },
  { id: "09", label: "Sobrino/a", value: "Sobrino" },
  { id: "10", label: "Nieto/a", value: "Nieto" },
  { id: "11", label: "Suegro/a", value: "Suegro" },
  { id: "12", label: "Cuñado/a", value: "Cuñado" },
  { id: "13", label: "Yerno/a", value: "Yerno" },
  { id: "15", label: "Otro", value: "Otro" },
];
