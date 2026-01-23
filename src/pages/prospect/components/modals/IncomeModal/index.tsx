import { useState } from "react";
import { IOption, useFlag, useMediaQuery } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { IIncomeSources } from "@pages/prospect/components/CreditProspect/types";
import { SourceIncome } from "@pages/prospect/components/SourceIncome";
import { ScrollableContainer } from "@pages/prospect/components/modals/ProspectProductModal/styles";
import { useEnum } from "@hooks/useEnum";

import { dataIncomeModalEnum } from "./config";

interface IncomeModalProps {
  initialValues?: IIncomeSources;
  disabled?: boolean;
  businessUnitPublicCode?: string;
  businessManagerCode: string;
  borrowerOptions: IOption[];
  creditRequestCode?: string;
  handleClose: () => void;
  onSubmit: (data: IIncomeSources) => void;
  openModal?: (state: boolean) => void;
}

export function IncomeModal(props: IncomeModalProps) {
  const {
    disabled,
    initialValues,
    businessUnitPublicCode,
    creditRequestCode,
    businessManagerCode,
    borrowerOptions,
    handleClose,
    openModal,
    onSubmit,
  } = props;
  const { lang } = useEnum();

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
      title: `${dataIncomeModalEnum.flagTitle.i18n[lang]}`,
      description: `${dataIncomeModalEnum.flagDescription.i18n[lang]}`,
      appearance: "success",
      duration: 5000,
    });
  };

  return (
    <BaseModal
      title={dataIncomeModalEnum.title.i18n[lang]}
      nextButton={dataIncomeModalEnum.save.i18n[lang]}
      backButton={dataIncomeModalEnum.cancel.i18n[lang]}
      handleNext={handleSubmit}
      handleBack={handleClose}
      width={isMobile ? "auto" : "1002px"}
      finalDivider={true}
      $height={(isMobile) ? "calc(100vh - 64px)" : "auto"}
    >
      <ScrollableContainer $smallScreen={(isMobile)}>
        <SourceIncome
          ShowSupport={false}
          disabled={disabled}
          openModal={openModal}
          data={initialValues}
          showEdit={false}
          onDataChange={handleDataChange}
          businessUnitPublicCode={businessUnitPublicCode}
          businessManagerCode={businessManagerCode}
          creditRequestCode={creditRequestCode}
          borrowerOptions={borrowerOptions}
        />
      </ScrollableContainer>
    </BaseModal>
  );
}

export type { IncomeModalProps };
