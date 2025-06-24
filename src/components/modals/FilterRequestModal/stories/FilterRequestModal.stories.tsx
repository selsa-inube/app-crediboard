import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button, IOption } from "@inubekit/inubekit";

import { FilterRequestModal, FilterRequestModalProps } from "..";

const assignmentOptions: IOption[] = [
  { id: "1", label: "Ascenso salarial", value: "ascenso_salarial" },
  { id: "2", label: "Certificación", value: "certificacion" },
  { id: "3", label: "Incapacidad", value: "incapacidad" },
  { id: "4", label: "Licencia no remunerada", value: "licencia_no_remunerada" },
  { id: "5", label: "Permiso", value: "permiso" },
];

const statusOptions: IOption[] = [
  { id: "1", label: "Por evaluar", value: "por_evaluar" },
  { id: "2", label: "En progreso", value: "en_progreso" },
  { id: "3", label: "Terminada", value: "terminada" },
];

const story: Meta<typeof FilterRequestModal> = {
  component: FilterRequestModal,
  title: "components/modals/FilterRequestModal",
};

const DefaultTemplate: StoryFn<FilterRequestModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

  const handleSubmit = () => {
    setShowModal(false);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && (
        <FilterRequestModal
          {...args}
          onCloseModal={handleShowModal}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  portalId: "portal",
  assignmentOptions,
  statusOptions,
};

export default story;
