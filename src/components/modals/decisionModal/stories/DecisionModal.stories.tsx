import { MdOutlineWarningAmber } from "react-icons/md";
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Meta, StoryFn } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { EComponentAppearance } from "@enum/appearances";
import { DecisionModal } from "..";
import { IDecisionModal } from "@ptypes/design/IDecisionModal";

const meta: Meta<typeof DecisionModal> = {
  title: "modals/DecisionModal",
  component: DecisionModal,
  decorators: [
    (Story: StoryFn, context) => (
      <BrowserRouter>{Story(context.args, context)}</BrowserRouter>
    ),
  ],
};

const Template: StoryFn<IDecisionModal> = (args) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Show Modal</Button>
      {showModal && (
        <DecisionModal {...args} onCloseModal={() => setShowModal(false)} />
      )}
    </>
  );
};

export const DeleteProcess = Template.bind({});
DeleteProcess.args = {
  portalId: "portal",
  title: "Eliminar",
  description: "¿Realmente deseas eliminar este destino de dinero?",
  actionText: "Eliminar",
};

export const EditProcess = Template.bind({});
EditProcess.args = {
  portalId: "portal",
  title: "Editar",
  description: "¿Realmente deseas editar este destino de dinero?",
  actionText: "Continuar",
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  portalId: "portal",
  title: "Atención",
  description:
    "El destino de dinero debería tener al menos una (1) línea de crédito, en caso contrario este destino de dinero NO será utilizable.",
  actionText: "Continuar aún así",
  withIcon: true,
  icon: <MdOutlineWarningAmber />,
  appearance: EComponentAppearance.WARNING,
};

export default meta;
