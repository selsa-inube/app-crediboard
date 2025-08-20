import { useState } from "react";
import { useFlag, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { IIncomeSources } from "@pages/prospect/components/CreditProspect/types";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";

import { dataIncomeModal } from "./config";

interface IncomeModalProps {
  initialValues?: IIncomeSources;
  disabled?: boolean;
  handleClose: () => void;
  onSubmit: (data: IIncomeSources) => void;
  openModal?: (state: boolean) => void;
}

export function IncomeModal(props: IncomeModalProps) {
  const { disabled, initialValues, handleClose, openModal, onSubmit } = props;

  const [formData, setFormData] = useState<IIncomeSources | undefined>(
    initialValues
  );

  const handleDataChange = (newData: IIncomeSources) => {
    setFormData(newData);
  };

  const isMobile = useMediaQuery("(max-width:880px)");

  const { addFlag } = useFlag();

  const handleSubmit = () => {
    if (!formData) return;
    onSubmit(formData);
    handleClose();
    addFlag({
      title: `${dataIncomeModal.flagTittle}`,
      description: `${dataIncomeModal.flagDescription}`,
      appearance: "success",
      duration: 5000,
    });
  };

  return (
    <BaseModal
      title={dataIncomeModal.title}
      nextButton={dataIncomeModal.save}
      backButton={dataIncomeModal.cancel}
      handleNext={handleSubmit}
      handleBack={handleClose}
      width={isMobile ? "auto" : "1002px"}
      finalDivider={true}
    >
      <SourceIncome
        ShowSupport={false}
        disabled={disabled}
        openModal={openModal}
        data={initialValues}
        showEdit={false}
        onDataChange={handleDataChange}
      />
    </BaseModal>
  );
}

export type { IncomeModalProps };
