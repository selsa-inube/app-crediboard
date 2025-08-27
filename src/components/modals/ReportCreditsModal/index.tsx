import { useState, useEffect } from "react";
import { MdAdd, MdCached } from "react-icons/md";
import { FormikValues } from "formik";
import { Stack, useMediaQuery, Button, Select } from "@inubekit/inubekit";

import { BaseModal } from "@components/modals/baseModal";
import { dataReport } from "@pages/prospect/components/TableObligationsFinancial/config";
import { TableFinancialObligations } from "@pages/prospect/components/TableObligationsFinancial";
import { IProspect, IBorrower } from "@services/prospect/types";

import { ListModal } from "../ListModal";
import { FinancialObligationModal } from "../financialObligationModal";

export interface ReportCreditsModalProps {
  handleClose: () => void;
  onChange: (name: string, newValue: string) => void;
  options: { id: string; label: string; value: string }[];
  debtor: string;
  prospectData?: IProspect[];
  setDataProspect?: React.Dispatch<React.SetStateAction<IProspect[]>>;
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
  const { handleClose, prospectData } = props;
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
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    const mainBorrower = filterListBorrowers("borrowerType", "MainBorrower");

    if (mainBorrower) {
      setSelectedBorrower(
        buildObjectSelection(mainBorrower.borrowerName, mainBorrower.borrowerIdentificationNumber)
      );
    }

    setOptionsBorrowers(getOptionsSelect() || []);

    return () => clearTimeout(timeout);
  }, []);

  const isMobile = useMediaQuery("(max-width:880px)");

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const filterListBorrowers = (parameter: keyof IBorrower, value: string) => {
    if (!prospectData) return;

    const listsBorrowers = prospectData[0].borrowers?.filter((borrower) => {
        if (borrower[parameter] === value) {
          return borrower;
        }
    });

    return listsBorrowers[0];
  };

  const getOptionsSelect = () => {
    if (!prospectData) return;

    return prospectData[0].borrowers?.map((borrower) => {
      return buildObjectSelection(borrower.borrowerName, borrower.borrowerIdentificationNumber);
    })
  }

  const onChangeSelect = (name: string, value: string) => {
    setSelectedBorrower(
      buildObjectSelection(name, value)
    );
  }

  const buildObjectSelection = (name: string, value: string) => {
    return {
      id: value,
      label: name,
      value: value
    }
  }

  const handleSaveNewObligation = (obligation: IFinancialObligation) => {
    setNewObligation(obligation);
  }
  console.log("getOptionsSelect: ", getOptionsSelect());
  console.log("prospectData: ", prospectData)
  console.log("selectedBorrower: ", selectedBorrower);

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
            <Select
              id="income"
              name="deudor"
              label="Deudor"
              placeholder="Seleccione una opción"
              options={optionsBorrowers || []}
              value={selectedBorrower?.value || ""}
              onChange={(name, value) => onChangeSelect(name, value)}
              size="compact"
            />
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems="center"
              gap="16px"
            >
              <Stack>
                <Button
                  children="Restablecer"
                  iconBefore={<MdCached />}
                  fullwidth={isMobile}
                  variant="outlined"
                  spacing="wide"
                  onClick={() => setIsOpenModal(true)}
                />
              </Stack>
              <Stack gap="16px">
                <Button
                  children={dataReport.addObligations}
                  iconBefore={<MdAdd />}
                  fullwidth={isMobile}
                  onClick={() => setOpenModal(true)}
                />
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
              onConfirm={(values) => handleSaveNewObligation(values as IFinancialObligation)}
              initialValues={initialValues}
              confirmButtonText="Agregar"
            />
          )}
        </Stack>
        <TableFinancialObligations
          showActions={true}
          selectedBorrower={selectedBorrower}
          prospectId={prospectData[0]?.prospectId || ""}
          newObligation={newObligation}
        />
      </Stack>
    </BaseModal>
  );
}
