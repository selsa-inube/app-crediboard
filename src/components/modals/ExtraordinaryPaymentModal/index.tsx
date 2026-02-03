import { useState, useCallback } from "react";
import { MdOutlineAdd, MdOutlineInfo } from "react-icons/md";
import { Stack, Icon, useMediaQuery, Button } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { IProspect } from "@services/prospect/types";
import { AddSeriesModal } from "@components/modals/AddSeriesModal";
import { TableExtraordinaryInstallment } from "@pages/prospect/components/TableExtraordinaryInstallment";
import {
  IExtraordinaryInstallmentsAddSeries,
  IExtraordinaryInstallmentAddSeries,
} from "@services/prospect/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard, optionsDisableStage } from "@config/privilege";
import { useEnum } from "@hooks/useEnum";

import { ErrorModal } from "../ErrorModal";
import { TextLabelsEnum } from "./config";
import { IExtraordinaryPayment } from "./types";

export interface ExtraordinaryPaymentModalProps {
  businessUnitPublicCode: string;
  businessManagerCode: string;
  dataTable: IExtraordinaryPayment[];
  availableEditCreditRequest: boolean;
  prospectData?: IProspect;
  setSentData: React.Dispatch<
    React.SetStateAction<IExtraordinaryInstallmentsAddSeries | null>
  >;
  sentData?: IExtraordinaryInstallmentsAddSeries | null;
  handleClose: () => void;
  onClickDetails?: (id: string) => void;
  onClickEdit?: (id: string) => void;
  onClickEliminate?: (id: string) => void;
  creditRequestCode: string | undefined;
}

export const ExtraordinaryPaymentModal = (
  props: ExtraordinaryPaymentModalProps,
) => {
  const {
    handleClose,
    prospectData,
    sentData,
    setSentData,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
    availableEditCreditRequest,
  } = props;

  const [installmentState, setInstallmentState] = useState({
    installmentAmount: 0,
    installmentDate: "",
    paymentChannelAbbreviatedName: "",
  });
  const [isAddSeriesModalOpen, setAddSeriesModalOpen] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isMobile = useMediaQuery("(max-width:880px)");
  const { lang } = useEnum();

  const openAddSeriesModal = () => {
    setInstallmentState({
      installmentAmount: 0,
      installmentDate: "",
      paymentChannelAbbreviatedName: "",
    });
    setAddSeriesModalOpen(true);
  };
  const [seriesModal, setSeriesModal] = useState<
    IExtraordinaryInstallmentAddSeries[]
  >([]);

  const handleCloseErrorModal = useCallback(() => {
    setShowErrorModal(false);
  }, []);
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const [selectedModal, setAddModal] =
    useState<IExtraordinaryInstallmentAddSeries | null>(null);
  const closeAddSeriesModal = () => {
    setAddSeriesModalOpen(false);
  };

  const handleSubmit = () => {
    closeAddSeriesModal();
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  return (
    <>
      <BaseModal
        title={TextLabelsEnum.extraPayments.i18n[lang]}
        nextButton={TextLabelsEnum.close.i18n[lang]}
        handleNext={handleClose}
        handleClose={handleClose}
        width={!isMobile ? "850px" : "360px"}
        finalDivider={true}
      >
        <Stack gap="24px" direction="column">
          <Stack justifyContent="end" alignItems="center" gap="2px">
            <Button
              type="button"
              appearance="primary"
              spacing="wide"
              fullwidth={isMobile}
              disabled={editCreditApplication || availableEditCreditRequest}
              iconBefore={
                <Icon
                  icon={<MdOutlineAdd />}
                  appearance="light"
                  size="18px"
                  spacing="narrow"
                />
              }
              onClick={openAddSeriesModal}
            >
              {TextLabelsEnum.addSeries.i18n[lang]}
            </Button>
            {editCreditApplication ||
              (availableEditCreditRequest && (
                <Icon
                  icon={<MdOutlineInfo />}
                  appearance="primary"
                  size="16px"
                  cursorHover
                  onClick={handleInfo}
                />
              ))}
          </Stack>
          <Stack>
            <TableExtraordinaryInstallment
              prospectData={prospectData}
              sentData={sentData}
              setSentData={setSentData}
              handleClose={closeAddSeriesModal}
              businessUnitPublicCode={businessUnitPublicCode}
              businessManagerCode={businessManagerCode}
              creditRequestCode={creditRequestCode || ""}
              availableEditCreditRequest={availableEditCreditRequest}
            />
          </Stack>
          {isAddSeriesModalOpen && (
            <AddSeriesModal
              handleClose={closeAddSeriesModal}
              onSubmit={handleSubmit}
              installmentState={installmentState}
              setInstallmentState={setInstallmentState}
              setSentData={setSentData}
              sentData={sentData}
              seriesModal={seriesModal}
              setSeriesModal={setSeriesModal}
              setAddModal={setAddModal}
              selectedModal={selectedModal}
              prospectData={prospectData}
              service={true}
              setShowErrorModal={setShowErrorModal}
              setMessageError={setMessageError}
              lang={lang}
              toggleAddSeriesModal={openAddSeriesModal}
              lineOfCreditAbbreviatedName={
                prospectData?.creditProducts?.[0]
                  ?.lineOfCreditAbbreviatedName || ""
              }
              moneyDestinationAbbreviatedName={
                prospectData?.moneyDestinationAbbreviatedName || ""
              }
            />
          )}
          {isModalOpen && (
            <InfoModal
              onClose={handleInfoModalClose}
              title={privilegeCrediboard.title}
              subtitle={privilegeCrediboard.subtitle}
              description={
                availableEditCreditRequest
                  ? optionsDisableStage.description
                  : privilegeCrediboard.description
              }
              nextButtonText={privilegeCrediboard.nextButtonText}
              isMobile={isMobile}
            />
          )}
        </Stack>
      </BaseModal>
      {showErrorModal && (
        <ErrorModal
          handleClose={() => {
            handleCloseErrorModal();
            handleClose();
          }}
          message={messageError}
        />
      )}
    </>
  );
};
