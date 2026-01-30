import { useState } from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Button } from "@inubekit/inubekit";

import { AddSeriesModal, AddSeriesModalProps } from "../index";
import { props, parameters } from "./props";
import {
  IExtraordinaryInstallmentAddSeries,
  IExtraordinaryInstallmentsAddSeries,
} from "@services/prospect/types";

const story: Meta<typeof AddSeriesModal> = {
  component: AddSeriesModal,
  title: "components/modals/AddSeriesModal",
  argTypes: props,
  parameters,
};

const DefaultTemplate: StoryFn<AddSeriesModalProps> = (args) => {
  const [showModal, setShowModal] = useState(false);
  const [seriesModal, setSeriesModal] = useState<
    IExtraordinaryInstallmentAddSeries[] | IExtraordinaryInstallmentAddSeries[]
  >();

  const [sentData, setSentData] =
    useState<React.SetStateAction<IExtraordinaryInstallmentsAddSeries | null>>(
      null,
    );

  const [installmentState, setInstallmentState] = useState<{
    installmentAmount: number;
    installmentDate: string;
    paymentChannelAbbreviatedName: string;
  }>({
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  });

  const handleShowModal = () => {
    setShowModal(!showModal);
    setSentData(null);
    setSeriesModal([] as IExtraordinaryInstallmentAddSeries[]);

    if (sentData === null) return;

    setSentData({} as IExtraordinaryInstallmentsAddSeries);
  };

  return (
    <>
      <Button onClick={handleShowModal}>Open Modal</Button>
      {showModal && (
        <AddSeriesModal
          {...args}
          handleClose={handleShowModal}
          seriesModal={seriesModal}
          setSentData={setSentData}
          installmentState={installmentState}
          setInstallmentState={setInstallmentState}
        />
      )}
    </>
  );
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  onSubmit: (values) => {
    console.log("Submitted values:", values);
  },
};
export default story;
