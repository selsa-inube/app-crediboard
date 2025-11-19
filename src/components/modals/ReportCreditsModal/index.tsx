import { useState, useEffect, useCallback, useRef } from "react";
import { MdAdd, MdCached, MdOutlineInfo } from "react-icons/md";
import { FormikValues } from "formik";
import {
  Stack,
  useMediaQuery,
  Button,
  Select,
  Text,
  Icon,
  useFlag,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IProspect, IBorrower } from "@services/prospect/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard, optionsDisableStage } from "@config/privilege";
import { updateProspect } from "@services/prospect/updateProspect";
import { getSearchProspectByCode } from "@services/creditRequest/query/ProspectByCode";
import { ErrorModal } from "@components/modals/ErrorModal";
import { ScrollableContainer } from "@pages/prospect/components/modals/ProspectProductModal/styles"
import { CardGray } from "@components/cards/CardGray";

import { FinancialObligationModal } from "../financialObligationModal";
import { defaultOptionsSelect, configSelect, errorMessages, restoreData } from "./config";

export interface ReportCreditsModalProps {
  handleClose: () => void;
  availableEditCreditRequest: boolean;
  onChange: (name: string, newValue: string) => void;
  options: { id: string; label: string; value: string }[];
  debtor: string;
  prospectData?: IProspect[];
  setDataProspect?: React.Dispatch<React.SetStateAction<IProspect[]>>;
  businessUnitPublicCode: string;
  businessManagerCode: string;
  creditRequestCode: string;
}

export interface optionsSelect {
  id: string;
  label: string;
  value: string;
}

export interface IFinancialObligation {
  balance: number;
  entity: string;
  fee: number;
  feePaid: string;
  idUser: number;
  payment: string;
  term: number;
  type: string;
}

export function ReportCreditsModal(props: ReportCreditsModalProps) {
  const {
    handleClose,
    prospectData,
    businessUnitPublicCode,
    businessManagerCode,
    creditRequestCode,
    availableEditCreditRequest
  } = props;
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<optionsSelect>();
  const [optionsBorrowers, setOptionsBorrowers] = useState<optionsSelect[]>([]);
  const [newObligation, setNewObligation] = useState<IFinancialObligation>();
  const [localProspectData, setLocalProspectData] = useState<IProspect[]>(
    prospectData || []
  );
  const [tableRefreshKey, setTableRefreshKey] = useState(0);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const initialProspectSnapshot = useRef<IProspect[] | null>(null);

  const { addFlag } = useFlag();

  const initialValues: FormikValues = {
    type: "",
    entity: "",
    fee: "",
    balance: "",
    payment: "",
    feePaid: "",
    term: "",
    idUser: "",
  };

  const isMobile = useMediaQuery("(max-width:880px)");
  -useEffect(() => {
    const loadCompleteData = async () => {
      try {
        const completeData = await getSearchProspectByCode(
          businessUnitPublicCode,
          businessManagerCode,
          creditRequestCode
        );

        setLocalProspectData([completeData]);

        if (!initialProspectSnapshot.current) {
          initialProspectSnapshot.current = JSON.parse(
            JSON.stringify([completeData])
          );
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    loadCompleteData();
  }, [businessUnitPublicCode, businessManagerCode, creditRequestCode]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filterListBorrowers = useCallback(
    (parameter: keyof IBorrower, value: string) => {
      if (!localProspectData) return;

      const listsBorrowers = localProspectData[0].borrowers?.filter(
        (borrower) => {
          if (borrower[parameter] === value) {
            return borrower;
          }
        }
      );

      return listsBorrowers?.[0];
    },
    [localProspectData]
  );

  const buildObjectSelection = useCallback((name: string, value: string) => {
    return {
      id: value,
      label: name,
      value: value,
    };
  }, []);

  const getOptionsSelect = useCallback(() => {
    if (!localProspectData) return;

    return localProspectData[0].borrowers?.map((borrower) => {
      return buildObjectSelection(
        borrower.borrowerName,
        borrower.borrowerIdentificationNumber
      );
    });
  }, [localProspectData, buildObjectSelection]);

  const handleObligationProcessed = () => {
    setNewObligation(undefined);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    const mainBorrower = filterListBorrowers("borrowerType", "MainBorrower");

    if (mainBorrower) {
      setSelectedBorrower(
        buildObjectSelection(
          mainBorrower.borrowerName,
          mainBorrower.borrowerIdentificationNumber
        )
      );
    }

    setOptionsBorrowers(getOptionsSelect() || [defaultOptionsSelect]);

    return () => clearTimeout(timeout);
  }, [filterListBorrowers, getOptionsSelect, buildObjectSelection]);

  useEffect(() => {
    if (
      optionsBorrowers &&
      optionsBorrowers.length === 1 &&
      !selectedBorrower
    ) {
      setSelectedBorrower(optionsBorrowers[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsBorrowers]);

  const onChangeSelect = (name: string, value: string) => {
    setSelectedBorrower(buildObjectSelection(name, value));
  };

  const handleSaveNewObligation = (obligation: IFinancialObligation) => {
    setNewObligation(obligation);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleInfo = () => {
    setIsModalOpen(true);
  };
  const handleInfoModalClose = () => {
    setIsModalOpen(false);
  };
  const { disabledButton: editCreditApplication } = useValidateUseCase({
    useCase: getUseCaseValue("editCreditApplication"),
  });

  const handleRestore = async () => {
    setIsOpenModal(false);

    if (!selectedBorrower?.value || !initialProspectSnapshot.current) {
      addFlag({
        title: "Error",
        description: "No se pudo restaurar: faltan datos necesarios",
        appearance: "danger",
        duration: 5000,
      });
      return;
    }

    try {
      const restoredData = JSON.parse(
        JSON.stringify(initialProspectSnapshot.current)
      );

      await updateProspect(
        businessUnitPublicCode,
        businessManagerCode,
        restoredData[0]
      );

      setTableRefreshKey((prev) => prev + 1);

      const refreshedData = await getSearchProspectByCode(
        businessUnitPublicCode,
        businessManagerCode,
        creditRequestCode
      );

      setLocalProspectData([refreshedData]);
    } catch (error) {
      setErrorMessage(errorMessages.updateProspect.description);
      setErrorModal(true);
    }
  };

  return (
    <>
      <BaseModal
        title={dataReport.title}
        nextButton={dataReport.close}
        handleNext={handleClose}
        handleClose={handleClose}
        width={!isMobile ? "1050px" : "320px"}
        $height="calc(100vh - 64px)"
      >
        <ScrollableContainer
        $smallScreen={isMobile}
        $width={isMobile ? "270px" : "auto"}
        >
        <Stack direction="column" gap="16px">
          {loading ? (
            <></>
          ) : (
            <Stack
              justifyContent="space-between"
              direction={isMobile ? "column" : "row"}
              gap="16px"
            >
              {optionsBorrowers && optionsBorrowers.length === 1 ? (
                <CardGray
                  label={"Deudor"}
                  placeHolder={optionsBorrowers[0]?.label}
                />
              ) : (
                <Select
                  id="income"
                  name={configSelect.name}
                  label={configSelect.label}
                  placeholder={configSelect.placeholder}
                  options={optionsBorrowers || []}
                  value={selectedBorrower?.value || ""}
                  onChange={(name, value) => onChangeSelect(name, value)}
                  size="compact"
                />
              )}

              <Stack
                direction={isMobile ? "column" : "row"}
                alignItems="center"
                gap="16px"
                width={
                  isMobile 
                  ? "100%" 
                  : "auto"
                }
              >
                <Stack 
                  gap="2px"
                  width={
                  isMobile 
                    ? "100%" 
                    : "auto"
                }
                >
                  <Button
                    children={restoreData.label}
                    iconBefore={<MdCached />}
                    fullwidth={isMobile}
                    variant="outlined"
                    spacing="wide"
                    disabled={editCreditApplication || availableEditCreditRequest}
                    onClick={() => setIsOpenModal(true)}
                  />
                  <Stack alignItems="center">
                    {editCreditApplication || availableEditCreditRequest ? (
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
                <Stack 
                gap="2px"
                width={
                  isMobile 
                  ? "100%" 
                  : "auto"
                }
                >
                  <Stack 
                  gap="16px"
                  width={
                    isMobile 
                    ? "100%" 
                    : "auto"
                  }
                  >
                    <Button
                      children={dataReport.addObligations}
                      iconBefore={<MdAdd />}
                      fullwidth={isMobile}
                      disabled={editCreditApplication || availableEditCreditRequest}
                      onClick={() => setOpenModal(true)}
                    />
                  </Stack>
                  <Stack alignItems="center">
                    {editCreditApplication || availableEditCreditRequest ? (
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
              </Stack>
            </Stack>
          )}
          <Stack gap="16px" justifyContent="center">
            {isOpenModal && (
              <BaseModal
                title={dataReport.restore}
                nextButton={dataReport.restore}
                backButton={dataReport.cancel}
                handleNext={handleRestore}
                handleClose={() => setIsOpenModal(false)}
                width={!isMobile ? "600px" : "290px"}
              >
                <Text>{dataReport.descriptionModal}</Text>
              </BaseModal>
            )}
            {openModal && (
              <FinancialObligationModal
                title={dataReport.addObligations}
                onCloseModal={handleCloseModal}
                onConfirm={(values) =>
                  handleSaveNewObligation(values as IFinancialObligation)
                }
                initialValues={initialValues}
                confirmButtonText={dataReport.add}
              />
            )}
          </Stack>
          <TableFinancialObligations
            key={tableRefreshKey}
            showActions={!availableEditCreditRequest}
            selectedBorrower={selectedBorrower}
            prospectId={localProspectData?.[0]?.prospectId || ""}
            newObligation={newObligation}
            businessUnitPublicCode={businessUnitPublicCode}
            onObligationProcessed={handleObligationProcessed}
            creditRequestCode={creditRequestCode}
            businessManagerCode={businessManagerCode}
          />
        </Stack>
        {isModalOpen ? (
          <InfoModal
            onClose={handleInfoModalClose}
            title={privilegeCrediboard.title}
            subtitle={privilegeCrediboard.subtitle}
            description={availableEditCreditRequest ? optionsDisableStage.description : privilegeCrediboard.description}
            nextButtonText={privilegeCrediboard.nextButtonText}
            isMobile={isMobile}
          />
        ) : (
          <></>
        )}
        </ScrollableContainer>
      </BaseModal>
      {
        errorModal && (
          <ErrorModal
            isMobile={isMobile}
            message={errorMessage}
            handleClose={() => {
              setErrorModal(false)
            }}
          />
        )
      }
    </>
  );
}
