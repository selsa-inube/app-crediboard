import { useState, useEffect, useCallback } from "react";
import { useMediaQuery, useFlag } from "@inubekit/inubekit";

import { currencyFormat } from "@utils/formatData/currency";
import { updateProspect } from "@services/prospect/updateProspect";
import { IBorrower, IProspect, IBorrowerProperty } from "@services/prospect/types";
import { optionsSelect, IFinancialObligation } from "@components/modals/ReportCreditsModal/index.tsx";
import { getSearchProspectByCode } from "@services/prospect/ProspectByCode";

import { headers, ROWS_PER_PAGE, errorMessages } from "./config";
import { TableFinancialObligationsUI } from "./interface";
import { IProperty } from "./types";

export interface ITableFinancialObligationsProps {
  prospectId?: string;
  businessUnitPublicCode?: string;
  type?: string;
  id?: string;
  propertyValue?: string;
  balance?: string;
  fee?: string;
  dataProspect?: IProspect[];
  refreshKey?: number;
  showActions?: boolean;
  showOnlyEdit?: boolean;
  showButtons?: boolean;
  selectedBorrower?: optionsSelect;
  borrowerIdentificationNumber?: string;
  indexOnTable?: number;
  newObligation?: IFinancialObligation;
  setCurrentPage?: React.Dispatch<React.SetStateAction<number>>;
  currentPage?: number;
}

export const TableFinancialObligations = (
  props: ITableFinancialObligationsProps
) => {
  const { refreshKey, showActions, businessUnitPublicCode, prospectId, selectedBorrower, newObligation } = props;

  const [dataProspect, setDataProspect] = useState<IProspect[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [selectedDebtor, setSelectedDebtor] =
    useState<ITableFinancialObligationsProps | null>(null);
  const [extraDebtors, setExtraDebtors] = useState<
    ITableFinancialObligationsProps[]
  >([]);
  const [borrowersListFinancialObligation, setBorrowersListFinancialObligation] = useState<IBorrowerProperty[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [gotEndPage, setGotEndPage] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEdit = (debtor: ITableFinancialObligationsProps, index: number) => {
    let balance = "";
    let fee = "";

    if (typeof debtor.propertyValue === "string") {
      const values = debtor.propertyValue.split(",");
      balance = currencyFormat(Number(values[1]?.trim() || 0), false);
      fee = currencyFormat(Number(values[2]?.trim() || 0), false);
    }

    setSelectedDebtor({
      ...debtor,
      balance,
      fee,
      indexOnTable: index
    });
    setIsModalOpenEdit(true);
  };

  const filterListBorrowersFinancialObligation = useCallback(() => {
    if (!dataProspect) return;

    const listsBorrowers: IBorrowerProperty[] = [];
    let countIndex = 0;

    dataProspect[0].borrowers.map((borrower) => {
      if (borrower.borrowerIdentificationNumber !== selectedBorrower?.value) return;

      borrower.borrowerProperties.map((property) => {
        if (property.propertyName === "FinancialObligation") {
          listsBorrowers.push({
            id: countIndex,
            propertyName: borrower.borrowerName,
            propertyValue: property.propertyValue,
            borrowerIdentificationNumber: borrower.borrowerIdentificationNumber
          } as IBorrowerProperty);

          countIndex++;

          return borrower;
        }
      });
    });

    return listsBorrowers;
  }, [dataProspect, selectedBorrower?.value]);

  const addFinancialObligation = useCallback((newObligation: IFinancialObligation) => {

    if (!dataProspect || !selectedBorrower?.value) {
      console.error("No se puede añadir la obligación: faltan datos del prospecto o el deudor no está seleccionado.");
      return null;
    }

    const [paidFees, totalFees] = newObligation.feePaid.split('/');
    const newPropertyValue = [
      newObligation.type,
      newObligation.balance,
      newObligation.fee,
      newObligation.entity,
      newObligation.payment,
      newObligation.idUser,
      paidFees,
      totalFees,
    ].join(',');

    const newProperty: IBorrowerProperty = {
      propertyName: 'FinancialObligation',
      propertyValue: newPropertyValue,
    };

    const newContentTable = structuredClone(dataProspect);

    const borrowerIndex = newContentTable[0].borrowers.findIndex(
      (borrower) => borrower.borrowerIdentificationNumber === selectedBorrower.value
    );

    if (borrowerIndex === -1) {
      console.error("Deudor seleccionado no encontrado.");
      return null;
    }

    const borrowerToUpdate = newContentTable[0].borrowers[borrowerIndex];

    let lastObligationIndex = -1;
    for (let i = borrowerToUpdate.borrowerProperties.length - 1; i >= 0; i--) {
      if (borrowerToUpdate.borrowerProperties[i].propertyName === 'FinancialObligation') {
        lastObligationIndex = i;
        break;
      }
    }

    if (lastObligationIndex !== -1) {
      borrowerToUpdate.borrowerProperties.splice(lastObligationIndex + 1, 0, newProperty);
    } else {
      borrowerToUpdate.borrowerProperties.push(newProperty);
    }

    return newContentTable;
  }, [dataProspect, selectedBorrower?.value]);

  const { addFlag } = useFlag();

  const handleFlag = useCallback((description: string, typeError: string) => {
    addFlag({
      title: typeError,
      description: description,
      appearance: "danger",
      duration: 5000,
    });
  }, [addFlag]);

  const findFinancialObligation = (indexPropertyOnTable: number, borrowerIdentificationNumber: string) => {
    let indexBorrower = 0;
    let indexPropertyFinancialObligation = -1;
    let indexProperty = 0;

    if (!dataProspect) return { indexBorrower, indexProperty };

    dataProspect[0].borrowers.map((borrower, index) => {
      if (borrower.borrowerIdentificationNumber === borrowerIdentificationNumber) {
        indexBorrower = index;

        borrower.borrowerProperties.map((property, indexPropertyMap) => {
          if (property.propertyName === "FinancialObligation") {
            indexPropertyFinancialObligation++;
          }

          if (
            property.propertyName === "FinancialObligation" &&
            indexPropertyFinancialObligation === indexPropertyOnTable
          ) {
            indexProperty = indexPropertyMap;
          }
        })
      }
    });

    return {
      indexBorrower,
      indexProperty
    };
  }

  const saveNewObligation = useCallback(async () => {
    try {
      if (!newObligation) return;

      const newContentTable = addFinancialObligation(newObligation);

      if (!newContentTable) return;

      await updateProspect(businessUnitPublicCode || "", newContentTable[0]);

      if ((borrowersListFinancialObligation.length % ROWS_PER_PAGE) === 0) {
        setGotEndPage(true);
      }

      setDataProspect(newContentTable);

    } catch (error) {
      handleFlag(errorMessages.save.description, errorMessages.save.title);
    }
  }, [
    newObligation,
    addFinancialObligation,
    businessUnitPublicCode,
    borrowersListFinancialObligation.length,
    setGotEndPage,
    setDataProspect,
    handleFlag
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500);

    getSearchProspectByCode(businessUnitPublicCode || "", prospectId || "").then((res) => {
      setDataProspect([res]);
    });

    return () => clearTimeout(timeout);
  }, [businessUnitPublicCode, prospectId]);

  useEffect(() => {
    const financialObligationBorrowers = filterListBorrowersFinancialObligation();

    if (financialObligationBorrowers) {
      setBorrowersListFinancialObligation(financialObligationBorrowers);
    }
  }, [selectedBorrower, dataProspect, filterListBorrowersFinancialObligation]);

  useEffect(() => {
    if (newObligation) {
      saveNewObligation();
    }
  }, [newObligation, saveNewObligation]);

  useEffect(() => {
    setCurrentPage(0);
  }, [selectedBorrower]);

  const isMobile = useMediaQuery("(max-width:880px)");

  const visibleHeaders = isMobile
    ? headers.filter(
      (header) =>
        ["type", "balance", "actions"].includes(header.key) &&
        (showActions || header.key !== "actions")
    )
    : headers.filter((header) => showActions || header.key !== "actions");

  useEffect(() => {
    const data = Array.isArray(dataProspect) ? dataProspect : [dataProspect];

    if (data && data.length > 0) {
      const borrowerList = Array.isArray(data[0]?.borrowers)
        ? (data[0]?.borrowers as IBorrower[])
        : [];

      const financialObligationsFromProps =
        borrowerList?.[0]?.borrowerProperties?.filter(
          (prop: IProperty) => prop.propertyName === "FinancialObligation"
        ) || [];

      setExtraDebtors([...financialObligationsFromProps]);
    } else {
      setExtraDebtors([]);
    }
  }, [refreshKey, dataProspect, businessUnitPublicCode, prospectId]);

  const handleDelete = async (id: number, borrowerIdentificationNumber: string) => {
    setShowDeleteModal(true);
    const newContentTable = deleteFinancialObligation(id, borrowerIdentificationNumber);

    if (!newContentTable) return;

    await updateProspect(businessUnitPublicCode || "", newContentTable[0]);

    if (setDataProspect === undefined) return;

    setDataProspect(newContentTable);

    moveBeforePage();
  };

  const deleteFinancialObligation = (indexPropertyOnTable: number, borrowerIdentificationNumber: string) => {
    const {
      indexBorrower,
      indexProperty
    } = findFinancialObligation(indexPropertyOnTable, borrowerIdentificationNumber);

    const newContentTable = structuredClone(dataProspect);

    if (!setDataProspect || !newContentTable) return;

    newContentTable[0].borrowers[indexBorrower].borrowerProperties.splice(indexProperty, 1);

    return newContentTable;

  }

  const moveBeforePage = () => {
    const totalPages = Math.ceil(borrowersListFinancialObligation.length / ROWS_PER_PAGE) || 1;
    const isTheLastRegisterOnPage = (totalPages - 1) === currentPage && ((borrowersListFinancialObligation.length % ROWS_PER_PAGE - 1) === 0);

    if ((totalPages - 1) === currentPage && isTheLastRegisterOnPage) {
      setCurrentPage(prev => prev - 1);
    }
  };
  const handleUpdate = async (
    updatedBorrower: ITableFinancialObligationsProps
  ) => {
    try {
      if (
        !updatedBorrower.borrowerIdentificationNumber ||
        updatedBorrower.fee === undefined ||
        updatedBorrower.balance === undefined
      ) return;

      const newContentTable = editFinancialObligation(
        updatedBorrower.indexOnTable as number,
        updatedBorrower.borrowerIdentificationNumber,
        updatedBorrower.fee.toString(),
        updatedBorrower.balance.toString()
      );

      if (!newContentTable) return;

      await updateProspect(businessUnitPublicCode || "", newContentTable[0]);

      setDataProspect(newContentTable);

      setIsModalOpenEdit(false);
    } catch (error) {
      handleFlag(errorMessages.update.description, errorMessages.update.title);
    }
  };

  const editFinancialObligation = (
    indexPropertyOnTable: number,
    borrowerIdentificationNumber: string,
    newFee: string,
    newBalance: string
  ) => {
    if (!dataProspect) return null;

    const newContentTable = structuredClone(dataProspect);

    const {
      indexBorrower,
      indexProperty
    } = findFinancialObligation(indexPropertyOnTable, borrowerIdentificationNumber);

    const borrowerToUpdate = newContentTable[0].borrowers[indexBorrower];

    const originalPropertyValue = borrowerToUpdate.borrowerProperties[indexProperty].propertyValue;
    const originalValues = typeof originalPropertyValue === "string" ? originalPropertyValue.split(",") : ["", "", ""];
    const cleanNewBalance = newBalance.replace(/[$,.]/g, '');
    const cleanNewFee = newFee.replace(/[$,.]/g, '');

    originalValues[1] = cleanNewBalance;
    originalValues[2] = cleanNewFee;

    borrowerToUpdate.borrowerProperties[indexProperty].propertyValue = originalValues.join(",");
    return newContentTable;
  };

  return (
    <TableFinancialObligationsUI
      dataInformation={borrowersListFinancialObligation}
      extraDebtors={extraDebtors}
      loading={loading}
      visibleHeaders={visibleHeaders}
      isMobile={isMobile}
      selectedDebtor={selectedDebtor}
      isModalOpenEdit={isModalOpenEdit}
      setIsModalOpenEdit={setIsModalOpenEdit}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
      handleUpdate={handleUpdate}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      gotEndPage={gotEndPage}
      setGotEndPage={setGotEndPage}
      showDeleteModal={showDeleteModal}
      setShowDeleteModal={setShowDeleteModal}
    />
  );
};
