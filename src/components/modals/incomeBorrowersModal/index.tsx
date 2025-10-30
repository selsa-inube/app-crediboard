import { useState, useEffect } from "react";
import { MdOutlineInfo } from "react-icons/md";
import {
  Button,
  Icon,
  IOption,
  Select,
  Stack,
  Text,
  Textfield,
} from "@inubekit/inubekit";

import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import { privilegeCrediboard } from "@config/privilege";
import { IProspect } from "@services/prospect/types";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { IncomeBorrower } from "@pages/prospect/components/modals/DebtorDetailsModal/incomeDebtor";

import { BaseModal } from "../baseModal";
import { dataCreditProspect } from "./config";

interface IIncomeBorrowersModalProps {
  borrowersProspect: IProspect | undefined;
  borrowerOptions: IOption[];
  selectedIndex: number;
  dataProspect: IProspect[];
  selectedBorrower: IProspect["borrowers"][number] | undefined;
  isMobile: boolean;
  handleCloseModal: () => void;
  handleChange: (name: string, newValue: string) => void;
  setOpenModal: (modal: string) => void;
}

export function IncomeBorrowersModal(props: IIncomeBorrowersModalProps) {
  const {
    borrowersProspect,
    borrowerOptions,
    selectedIndex,
    dataProspect,
    selectedBorrower,
    isMobile,
    handleCloseModal,
    handleChange,
    setOpenModal,
  } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currentBorrower =
    dataProspect[0]?.borrowers?.find(
      (borrower) =>
        borrower.borrowerName === borrowerOptions[selectedIndex]?.value
    ) || selectedBorrower;

  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  const getOptionLabel = (options: IOption[], value: string) => {
    const option = options?.find(
      (opt) => opt.id === value || opt.value === value
    );
    return option?.label || option?.value || value;
  };

  useEffect(() => {
    if (
      borrowerOptions &&
      borrowerOptions.length === 1 &&
      selectedIndex === -1
    ) {
      const singleOption = borrowerOptions[0];
      const optionValue = singleOption.id || singleOption.value;
      if (optionValue) {
        handleChange("borrower", optionValue);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [borrowerOptions, selectedIndex]);

  const handleInfo = () => {
    setIsModalOpen(true);
  };

  const handleEditClick = () => {
    handleCloseModal();
    setOpenModal("IncomeModalEdit");
  };

  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };

  return (
    <BaseModal
      title={dataCreditProspect.incomeSources}
      nextButton={dataCreditProspect.close}
      handleNext={handleCloseModal}
      handleClose={handleCloseModal}
      width={isMobile ? "300px" : "auto"}
    >
      {borrowersProspect ? (
        <>
          <Stack
            justifyContent="space-between"
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "end"}
            width="100%"
            gap="16px"
          >
            {borrowerOptions && borrowerOptions.length === 1 ? (
              <Textfield
                label="Deudor"
                id="borrower"
                name="borrower"
                value={getOptionLabel(
                  borrowerOptions,
                  borrowerOptions[selectedIndex]?.value
                )}
                disabled
                fullwidth={isMobile}
                size="compact"
              />
            ) : (
              <Select
                label="Deudor"
                id="borrower"
                name="borrower"
                options={borrowerOptions}
                value={borrowerOptions[selectedIndex]?.value}
                onChange={handleChange}
                fullwidth={isMobile}
                size="compact"
              />
            )}
            <Stack alignItems="center" justifyContent="center" gap="2px">
              <Button
                onClick={handleEditClick}
                fullwidth={isMobile}
                disabled={editCreditApplication}
              >
                {dataCreditProspect.edit}
              </Button>
              {editCreditApplication ? (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={handleInfo}
                />
              ) : (
                <></>
              )}
            </Stack>
          </Stack>
          {currentBorrower ? (
            <IncomeBorrower initialIncome={currentBorrower} />
          ) : (
            <></>
          )}
        </>
      ) : (
        <Stack width="400px">
          <Text>{dataCreditProspect.noDataIncome}</Text>
        </Stack>
      )}
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
