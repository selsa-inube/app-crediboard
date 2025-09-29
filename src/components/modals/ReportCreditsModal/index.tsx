import { useState, useEffect, useCallback } from "react";
import { MdAdd, MdCached, MdOutlineInfo } from "react-icons/md";
import { FormikValues } from "formik";
import {
  Stack,
  useMediaQuery,
  Button,
  Select,
  Text,
  Icon,
} from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IProspect, IBorrower } from "@services/prospect/types";
import { getUseCaseValue, useValidateUseCase } from "@hooks/useValidateUseCase";
import InfoModal from "@pages/prospect/components/modals/InfoModal";
import { privilegeCrediboard } from "@config/privilege";

import { ListModal } from "../ListModal";
import { FinancialObligationModal } from "../financialObligationModal";
import { defaultOptionsSelect, configSelect } from "./config";

export interface ReportCreditsModalProps {
  handleClose: () => void;
  onChange: (name: string, newValue: string) => void;
  options: { id: string; label: string; value: string }[];
  debtor: string;
  prospectData?: IProspect[];
  setDataProspect?: React.Dispatch<React.SetStateAction<IProspect[]>>;
  businessUnitPublicCode: string;
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
    creditRequestCode,
  } = props;
  const [loading, setLoading] = useState(true);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBorrower, setSelectedBorrower] = useState<optionsSelect>();
  const [optionsBorrowers, setOptionsBorrowers] = useState<optionsSelect[]>([]);
  const [newObligation, setNewObligation] = useState<IFinancialObligation>();

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

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filterListBorrowers = useCallback(
    (parameter: keyof IBorrower, value: string) => {
      if (!prospectData) return;

      const listsBorrowers = prospectData[0].borrowers?.filter((borrower) => {
        if (borrower[parameter] === value) {
          return borrower;
        }
      });

      return listsBorrowers?.[0];
    },
    [prospectData]
  );

  const buildObjectSelection = useCallback((name: string, value: string) => {
    return {
      id: value,
      label: name,
      value: value,
    };
  }, []);

  const getOptionsSelect = useCallback(() => {
    if (!prospectData) return;

    return prospectData[0].borrowers?.map((borrower) => {
      return buildObjectSelection(
        borrower.borrowerName,
        borrower.borrowerIdentificationNumber
      );
    });
  }, [prospectData, buildObjectSelection]);

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
  return (
    <BaseModal
      title={dataReport.title}
      nextButton={dataReport.close}
      handleNext={handleClose}
      handleClose={handleClose}
      width={!isMobile ? "1050px" : "290px"}
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
            {optionsBorrowers && optionsBorrowers.length > 1 ? (
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
            ) : (
              <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Text appearance="dark" as="h2">
                  {optionsBorrowers[0]?.label}
                </Text>
              </Stack>
            )}

            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems="center"
              gap="16px"
            >
              <Stack gap="2px">
                <Button
                  children="Restablecer"
                  iconBefore={<MdCached />}
                  fullwidth={isMobile}
                  variant="outlined"
                  spacing="wide"
                  disabled={editCreditApplication}
                  onClick={() => setIsOpenModal(true)}
                />
                <Stack alignItems="center">
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
              <Stack gap="2px">
                <Stack gap="16px">
                  <Button
                    children={dataReport.addObligations}
                    iconBefore={<MdAdd />}
                    fullwidth={isMobile}
                    disabled={editCreditApplication}
                    onClick={() => setOpenModal(true)}
                  />
                </Stack>
                <Stack alignItems="center">
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
            </Stack>
          </Stack>
        )}
        <Stack gap="16px" justifyContent="center">
          {isOpenModal && (
            <ListModal
              title={dataReport.restore}
              handleClose={() => setIsOpenModal(false)}
              handleSubmit={() => setIsOpenModal(false)}
              cancelButton="Cancelar"
              appearanceCancel="gray"
              buttonLabel={dataReport.restore}
              content={dataReport.descriptionModal}
            />
          )}
          {openModal && (
            <FinancialObligationModal
              title="Agregar obligaciones"
              onCloseModal={handleCloseModal}
              onConfirm={(values) =>
                handleSaveNewObligation(values as IFinancialObligation)
              }
              initialValues={initialValues}
              confirmButtonText="Agregar"
            />
          )}
        </Stack>
        <TableFinancialObligations
          showActions={true}
          selectedBorrower={selectedBorrower}
          prospectId={prospectData?.[0]?.prospectId || ""}
          newObligation={newObligation}
          businessUnitPublicCode={businessUnitPublicCode}
          onObligationProcessed={handleObligationProcessed}
          creditRequestCode={creditRequestCode}
        />
      </Stack>
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
