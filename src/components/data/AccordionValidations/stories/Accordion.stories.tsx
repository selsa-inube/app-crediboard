import { BrowserRouter } from "react-router-dom";
import { Meta, StoryFn, StoryObj } from "@storybook/react";

import { parameters } from "./props";
import { AccordionValidations, IAccordionValidationsProps } from "..";

const meta: Meta<typeof AccordionValidations> = {
  title: "components/data/AccordionValidations",
  component: AccordionValidations,
  parameters,

  decorators: [
    (Story: StoryFn) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export type MockDataSummaryPage = typeof mockDataSummaryPage;

const mockDataSummaryPage = [
  {
    section: "Información general",
    attributes: [
      {
        attribute: "Nombre del caso de uso",
        value: "Créditos aprobados",
      },
      {
        attribute: "Descripción",
        value: "Argentina",
      },
      {
        attribute: "Opción cliente servidor",
        value: "81544670",
      },
      {
        attribute: "Opción web",
        value: "20/Nov/2001",
      },
    ],
    attributesButton: {
      text: "Regresar a este paso",
      path: "/",
    },
  },
  {
    section: "Cliente servidor",
    attributes: [
      {
        attribute: "Seleccione cliente servidor",
        value: "Colombia",
      },
    ],
    attributesButton: {
      text: "Regresar a este paso",
      path: "/",
    },
  },
];

type Story = StoryObj<typeof AccordionValidations>;

export const Default: Story = (args: IAccordionValidationsProps) => (
  <AccordionValidations {...args} />
);
Default.args = {
  title: "Casos de uso",
  defaultOpen: true,
};

export default meta;
