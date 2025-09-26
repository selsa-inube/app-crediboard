import { Icon, Text, useMediaQuery } from "@inubekit/inubekit";
import { useState } from "react";
import { MdOutlineInfo } from "react-icons/md";

import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { BaseModal } from "@components/modals/baseModal";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrediboard } from "@config/privilege";

import { DeleteData } from "./config";

export interface IDeleteModalProps {
  TextDelete: string;
  handleClose: () => void;
  handleDelete?: (id?: number, borrowerIdentificationNumber?: string) => void;
  iconBefore?: React.JSX.Element;
}

export function DeleteModal(props: IDeleteModalProps) {
  const {
    handleClose,
    handleDelete = () => {},
    TextDelete,
    iconBefore,
  } = props;

  const isMobile = useMediaQuery("(max-width:880px)");

  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  return (
    <BaseModal
      title={DeleteData.title}
      nextButton={DeleteData.delate}
      backButton={DeleteData.cancel}
      handleNext={handleDelete}
      handleClose={handleClose}
      disabledNext={editCreditApplication}
      iconBeforeNext={
        editCreditApplication ? (
          <Icon
            icon={<MdOutlineInfo />}
            appearance="primary"
            size="16px"
            cursorHover
            onClick={handleInfo}
          />
        ) : (
          iconBefore
        )
      }
      initialDivider={false}
      width={isMobile ? "287px" : "402px"}
    >
      <Text>{TextDelete}</Text>
      {isModalOpen ? (
        <InfoModal
          onClose={handleInfoModalClose}
          title={privilegeCrediboard.title}
          subtitle={privilegeCrediboard.subtitle}
          description={privilegeCrediboard.description}
          nextButtonText={privilegeCrediboard.nextButtonText}
          isMobile={isMobile}
        />
      ) : (
        <></>
      )}
    </BaseModal>
  );
}
